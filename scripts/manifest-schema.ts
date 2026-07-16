/**
 * Canonical shape of the machine-readable manifest every component exports.
 * Components stay import-free; validate-manifests.ts checks them against
 * this type from the outside.
 */
export type ComponentManifest = {
  intent: string;
  props: Record<string, string>;
  states: readonly string[];
  a11y: readonly string[];
  examples: readonly { title: string; code: string }[];
};
