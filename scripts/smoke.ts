/**
 * Smoke test for the built CLI + MCP server. Assumes `pnpm build` has
 * already produced dist/, templates/, manifests.json. Runs the real bin
 * as a subprocess so packaging bugs (paths, shebang, exports) show up.
 */
import { execFileSync, spawn } from "node:child_process";
import { mkdtempSync, readFileSync, rmSync, statSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

const root = join(import.meta.dirname, "..");
const bin = join(root, "dist/cli/bin.js");

let failed = 0;
function assert(cond: unknown, message: string): void {
  if (!cond) {
    console.error(`FAIL: ${message}`);
    failed++;
  } else {
    console.log(`ok   ${message}`);
  }
}

statSync(bin);

const listOut = execFileSync("node", [bin, "list"], { encoding: "utf8", cwd: root });
assert(/^button\b/m.test(listOut), "list: includes button");
assert(/^tabs\b/m.test(listOut), "list: includes tabs");
assert(listOut.split("\n").filter(Boolean).length === 12, "list: prints 12 components");

const tmp = mkdtempSync(join(tmpdir(), "axiom-smoke-"));
try {
  execFileSync("node", [bin, "add", "button", "--dir", tmp], { encoding: "utf8", cwd: root });
  const copied = readFileSync(join(tmp, "button.tsx"), "utf8");
  const original = readFileSync(join(root, "src/components/button.tsx"), "utf8");
  assert(copied === original, "add: copied file is byte-identical to source");

  let secondFailed = false;
  try {
    execFileSync("node", [bin, "add", "button", "--dir", tmp], { encoding: "utf8", cwd: root, stdio: "pipe" });
  } catch {
    secondFailed = true;
  }
  assert(secondFailed, "add: refuses to overwrite without --force");

  execFileSync("node", [bin, "add", "button", "--dir", tmp, "--force"], { encoding: "utf8", cwd: root });
  assert(readFileSync(join(tmp, "button.tsx"), "utf8") === original, "add --force: overwrites cleanly");
} finally {
  rmSync(tmp, { recursive: true, force: true });
}

await new Promise<void>((resolve, reject) => {
  const mcp = spawn("node", [bin, "mcp"], { cwd: root });
  let out = "";
  mcp.stdout.on("data", (chunk) => {
    out += chunk;
  });
  mcp.on("error", reject);
  mcp.on("exit", () => {
    assert(out.includes('"protocolVersion"'), "mcp: initialize returns protocolVersion");
    assert(out.includes('"list_components"'), "mcp: tools/list includes list_components");
    assert(out.includes('"get_component"'), "mcp: tools/list includes get_component");
    resolve();
  });

  const requests = [
    { jsonrpc: "2.0", id: 1, method: "initialize", params: { protocolVersion: "2024-11-05", capabilities: {}, clientInfo: { name: "smoke", version: "1" } } },
    { jsonrpc: "2.0", method: "notifications/initialized" },
    { jsonrpc: "2.0", id: 2, method: "tools/list" },
  ];
  for (const request of requests) mcp.stdin.write(JSON.stringify(request) + "\n");
  mcp.stdin.end();
});

if (failed > 0) {
  console.error(`\n${failed} smoke check(s) failed.`);
  process.exit(1);
}
console.log("\nSmoke checks passed.");
