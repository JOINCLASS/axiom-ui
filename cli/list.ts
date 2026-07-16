/**
 * `axiom-ui list` — print component names and their intents.
 */
import { loadManifests } from "./manifests.js";

export function runList(): void {
  const manifests = loadManifests();
  const width = Math.max(...Object.keys(manifests).map((name) => name.length)) + 2;
  for (const [name, manifest] of Object.entries(manifests)) {
    console.log(`${name.padEnd(width)}${manifest.intent}`);
  }
}
