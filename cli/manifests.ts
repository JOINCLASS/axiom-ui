/**
 * Shared loader for the pre-built manifests.json.
 */
import { readFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

export type ComponentManifest = {
  intent: string;
  props: Record<string, string>;
  states: string[];
  a11y: string[];
  examples: { title: string; code: string }[];
};

const packageRoot = resolve(dirname(fileURLToPath(import.meta.url)), "../..");

export function loadManifests(): Record<string, ComponentManifest> {
  const path = join(packageRoot, "manifests.json");
  return JSON.parse(readFileSync(path, "utf8"));
}

export function componentSource(name: string): string {
  const path = join(packageRoot, "templates", `${name}.tsx`);
  return readFileSync(path, "utf8");
}
