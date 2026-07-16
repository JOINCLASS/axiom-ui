/**
 * `axiom-ui add <name> [--dir <path>] [--force]` — copy a template
 * component file into the user's repo. No dependency injection, no
 * post-processing: what you see in templates/<name>.tsx is what lands
 * on disk. This is copy-and-own literally.
 */
import { copyFileSync, existsSync, mkdirSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { loadManifests } from "./manifests.js";

const packageRoot = resolve(dirname(fileURLToPath(import.meta.url)), "../..");
const templatesDir = join(packageRoot, "templates");

export async function runAdd(args: string[]): Promise<void> {
  let name: string | undefined;
  let dir = "./src/components";
  let force = false;

  for (let i = 0; i < args.length; i++) {
    const arg = args[i];
    if (arg === "--dir") {
      const next = args[++i];
      if (!next) fail("--dir requires a path");
      dir = next;
    } else if (arg === "--force") {
      force = true;
    } else if (arg?.startsWith("--")) {
      fail(`Unknown option: ${arg}`);
    } else if (name === undefined) {
      name = arg;
    } else {
      fail(`Unexpected argument: ${arg}`);
    }
  }

  if (!name) fail("Missing component name. Try `axiom-ui list`.");

  const manifests = loadManifests();
  if (!(name in manifests)) {
    fail(`Unknown component "${name}". Try \`axiom-ui list\` for available names.`);
  }

  const source = join(templatesDir, `${name}.tsx`);
  const target = resolve(process.cwd(), dir, `${name}.tsx`);

  mkdirSync(dirname(target), { recursive: true });

  if (existsSync(target) && !force) {
    fail(`File exists: ${target}\n  Re-run with --force to overwrite.`);
  }

  copyFileSync(source, target);
  console.log(`✓ ${name} → ${target}`);
}

function fail(message: string): never {
  console.error(message);
  process.exit(1);
}
