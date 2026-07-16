/**
 * A checkbox. Accepts every native <input> attribute, but `type` is
 * fixed to "checkbox" — use the `role="switch"` escape hatch (a
 * standard ARIA pattern) when a toggle switch is what you want. This
 * is why the library has no separate Switch component.
 */
import type { ComponentPropsWithRef } from "react";

export type CheckboxProps = Omit<ComponentPropsWithRef<"input">, "type">;

export function Checkbox({ className, ...props }: CheckboxProps) {
  return (
    <input
      type="checkbox"
      className={
        "h-4 w-4 cursor-pointer rounded border-zinc-300 text-zinc-900 accent-zinc-900 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-zinc-900 disabled:cursor-not-allowed disabled:opacity-50" +
        (className ? " " + className : "")
      }
      {...props}
    />
  );
}

export const manifest = {
  intent:
    "A checkbox. type is fixed to \"checkbox\"; for a switch-styled toggle, set role=\"switch\" plus your own visual className — this is the intended replacement for a separate Switch component.",
  props: {
    "...native":
      "Every native <input> attribute except type passes through unchanged (checked, defaultChecked, onChange, name, value, aria-*, ref, ...).",
    role: 'Set to "switch" when semantically a toggle switch. Combine with visual className to render as a pill toggle.',
    className:
      "Escape hatch: Tailwind classes appended after the defaults, so they win when they conflict.",
  },
  states: ["idle", "checked", "focus-visible", "disabled"],
  a11y: [
    "Renders a native <input type=\"checkbox\">: keyboard toggle (Space), form semantics, and screen-reader state come for free.",
    "role=\"switch\" is a standard ARIA pattern for toggle switches — screen readers announce \"on/off\" instead of \"checked/not checked\".",
    "disabled uses the native attribute, so it is announced by screen readers and removed from tab order.",
  ],
  examples: [
    {
      title: "Default",
      code: '<Checkbox checked={agreed} onChange={(e) => setAgreed(e.target.checked)} />',
    },
    {
      title: "Labeled",
      code: '<label className="inline-flex items-center gap-2">\n  <Checkbox name="terms" />\n  <span>I accept the terms</span>\n</label>',
    },
    {
      title: "Switch (no separate component needed)",
      code: '<Checkbox role="switch" checked={enabled} onChange={(e) => setEnabled(e.target.checked)} />',
    },
    { title: "Disabled", code: "<Checkbox checked disabled />" },
  ],
} as const;
