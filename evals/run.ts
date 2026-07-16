/**
 * One-shot generation rate benchmark (KPI, not a PR gate — philosophy §6).
 * For each case: give the LLM only button.tsx + the task, then judge the
 * generated snippet with tsc (invented props fail the native-props type)
 * plus the case's own criteria. Run: pnpm eval
 */
import Anthropic from "@anthropic-ai/sdk";
import { execFileSync } from "node:child_process";
import { mkdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { cases } from "./cases.ts";

const MODEL = process.env.EVAL_MODEL ?? "claude-opus-4-7";
const MAX_TOKENS = 2048;

if (!process.env.ANTHROPIC_API_KEY) {
  console.error("ANTHROPIC_API_KEY is not set.");
  process.exit(1);
}

const evalsDir = import.meta.dirname;
const tmpDir = join(evalsDir, "tmp");
const source = readFileSync(
  join(evalsDir, "../src/components/button.tsx"),
  "utf8",
);

const client = new Anthropic();

function extractCode(text: string): string {
  const fenced = text.match(/```(?:tsx|jsx|ts)?\n([\s\S]*?)```/);
  return (fenced?.[1] ?? text).trim();
}

function harness(declares: string, snippet: string): string {
  const body = snippet.startsWith("<")
    ? `export function Case() {\n  return (\n    <>\n${snippet}\n    </>\n  );\n}`
    : snippet;
  return `import { Button } from "../../src/components/button";\n${declares}\n${body}\n`;
}

async function generate(prompt: string): Promise<string> {
  const response = await client.messages.create({
    model: MODEL,
    max_tokens: MAX_TOKENS,
    system: [
      {
        type: "text",
        text:
          "You are a React developer. The ONLY component documentation you have is this single file. Reply with ONLY the JSX/TSX code snippet you would write — no explanation.\n\n" +
          source,
        cache_control: { type: "ephemeral" },
      },
    ],
    messages: [{ role: "user", content: prompt }],
  });
  return extractCode(
    response.content
      .filter((block) => block.type === "text")
      .map((block) => block.text)
      .join(""),
  );
}

rmSync(tmpDir, { recursive: true, force: true });
mkdirSync(tmpDir, { recursive: true });

const snippets = new Map<string, string>();
for (const evalCase of cases) {
  try {
    const snippet = await generate(evalCase.prompt);
    snippets.set(evalCase.id, snippet);
    writeFileSync(
      join(tmpDir, `${evalCase.id}.tsx`),
      harness(evalCase.declares, snippet),
    );
  } catch (error) {
    if (error instanceof Anthropic.APIError) {
      console.error(`${evalCase.id}: API error ${error.status}: ${error.message}`);
    } else {
      throw error;
    }
  }
}

let tscOutput = "";
try {
  execFileSync("pnpm", ["exec", "tsc", "-p", join(evalsDir, "tsconfig.json")], {
    encoding: "utf8",
  });
} catch (error) {
  tscOutput = String((error as { stdout?: string }).stdout ?? "");
}

const results = cases.map((evalCase) => {
  const snippet = snippets.get(evalCase.id);
  const typechecks =
    snippet !== undefined && !tscOutput.includes(`${evalCase.id}.tsx`);
  const checkPass = snippet !== undefined && evalCase.check(snippet);
  return {
    id: evalCase.id,
    pass: typechecks && checkPass,
    typechecks,
    checkPass,
    snippet: snippet ?? null,
  };
});

const passed = results.filter((result) => result.pass).length;
const record = {
  date: new Date().toISOString().slice(0, 10),
  model: MODEL,
  rate: `${passed}/${cases.length}`,
  results,
};

const resultsDir = join(evalsDir, "results");
mkdirSync(resultsDir, { recursive: true });
writeFileSync(
  join(resultsDir, `${record.date}.json`),
  JSON.stringify(record, null, 2) + "\n",
);

for (const result of results) {
  console.log(
    `${result.id.padEnd(20)} ${result.pass ? "PASS" : `FAIL (tsc: ${result.typechecks}, check: ${result.checkPass})`}`,
  );
}
console.log(`\none-shot generation rate: ${passed}/${cases.length} (${MODEL})`);
