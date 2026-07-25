export type Manifest = {
  intent: string;
  props: Record<string, string>;
  states: readonly string[];
  a11y: readonly string[];
  examples: readonly { title: string; code: string }[];
};

const manifestModules = import.meta.glob<Manifest>(
  ["../../../src/components/*.tsx", "!**/*.test.tsx"],
  { import: "manifest", eager: true },
);

const rawSources = import.meta.glob<string>(
  ["../../../src/components/*.tsx", "!**/*.test.tsx"],
  { query: "?raw", import: "default", eager: true },
);

function byName<T>(modules: Record<string, T>): Record<string, T> {
  return Object.fromEntries(
    Object.entries(modules).map(([path, value]) => [
      path.replace(/^.*\/(.+)\.tsx$/, "$1"),
      value,
    ]),
  );
}

export const manifests = byName(manifestModules);
export const sources = byName(rawSources);

export const groups: { id: string; en: string; ja: string; components: string[] }[] = [
  { id: "form", en: "Form primitives", ja: "フォーム", components: ["button", "input", "textarea", "checkbox", "select", "combobox"] },
  { id: "layout", en: "Layout / structure", ja: "レイアウト", components: ["dialog", "tabs"] },
  { id: "overlay", en: "Overlay / feedback", ja: "オーバーレイ", components: ["popover", "menu", "tooltip", "toast"] },
];

export const componentNames = groups.flatMap((g) => g.components);

export function displayName(name: string): string {
  return name.charAt(0).toUpperCase() + name.slice(1);
}
