/**
 * Hard CI gate (philosophy §2.4): token/component and bundle/component.
 * Measures every src/components/*.tsx (tests excluded) and fails when a
 * component exceeds its budget. Run: pnpm gate
 */
import { readFileSync, readdirSync, rmSync } from "node:fs";
import { join } from "node:path";
import { encode } from "gpt-tokenizer";
import { build, type Rollup } from "vite";

const BUDGETS = {
  tokens: 1500,
  bundleBytes: 4096,
};

const componentsDir = join(import.meta.dirname, "../src/components");
const outDir = join(import.meta.dirname, "../.gate-tmp");

const componentFiles = readdirSync(componentsDir).filter(
  (file) => file.endsWith(".tsx") && !file.endsWith(".test.tsx"),
);

async function bundleBytes(file: string): Promise<number> {
  const result = (await build({
    logLevel: "silent",
    configFile: false,
    build: {
      write: false,
      minify: true,
      outDir,
      lib: {
        entry: join(componentsDir, file),
        formats: ["es"],
        fileName: "out",
      },
      rollupOptions: { external: ["react", "react/jsx-runtime", "react-dom"] },
    },
  })) as Rollup.RollupOutput[];

  const chunks = result.flatMap((output) => output.output);
  return chunks.reduce(
    (total, chunk) =>
      total + Buffer.byteLength("code" in chunk ? chunk.code : chunk.source),
    0,
  );
}

let failed = false;
const rows: string[] = [];

for (const file of componentFiles) {
  const source = readFileSync(join(componentsDir, file), "utf8");
  const tokens = encode(source).length;
  const bytes = await bundleBytes(file);

  const tokensOk = tokens <= BUDGETS.tokens;
  const bytesOk = bytes <= BUDGETS.bundleBytes;
  if (!tokensOk || !bytesOk) failed = true;

  rows.push(
    `${file.padEnd(20)} tokens ${String(tokens).padStart(5)}/${BUDGETS.tokens} ${tokensOk ? "OK" : "OVER"}   bundle ${String(bytes).padStart(5)}/${BUDGETS.bundleBytes} B ${bytesOk ? "OK" : "OVER"}`,
  );
}

rmSync(outDir, { recursive: true, force: true });

console.log(rows.join("\n"));
if (failed) {
  console.error("\nGate failed: a component exceeds its budget. Delete before you optimize.");
  process.exit(1);
}
console.log("\nGate passed.");
