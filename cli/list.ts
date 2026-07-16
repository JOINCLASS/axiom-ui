/**
 * `axiom-ui list` — print component names and their intents.
 */
import { loadManifests } from "./manifests.js";

export function runList(): void {
  const manifests = loadManifests();
  for (const [name, manifest] of Object.entries(manifests)) {
    console.log(`${name.padEnd(10)} ${manifest.intent}`);
  }
}
