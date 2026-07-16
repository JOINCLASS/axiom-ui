/**
 * Single-line text input. Accepts every native <input> attribute
 * (type, value, onChange, placeholder, aria-*, ref, ...). The default
 * type is the native "text"; set `type="email" | "password" | ...`
 * when you need it.
 */
import type { ComponentPropsWithRef } from "react";

export type InputProps = ComponentPropsWithRef<"input">;

export function Input({ className, ...props }: InputProps) {
  return (
    <input
      className={
        "block w-full rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 placeholder:text-zinc-400 focus-visible:border-zinc-900 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-zinc-900 disabled:cursor-not-allowed disabled:opacity-50" +
        (className ? " " + className : "")
      }
      {...props}
    />
  );
}

export const manifest = {
  intent:
    "Single-line text input. Adjust looks by appending Tailwind classes via className.",
  props: {
    "...native":
      "Every ComponentPropsWithRef<'input'> attribute passes through unchanged (type, value, onChange, placeholder, aria-*, ref, ...).",
    type: 'Native input type: "text" (default) | "email" | "password" | "number" | "search" | "tel" | "url" | "date" | ... Set explicitly when you need a specific type.',
    className:
      "Escape hatch: Tailwind classes appended after the defaults, so they win when they conflict.",
  },
  states: ["idle", "focus-visible", "disabled", "placeholder"],
  a11y: [
    "Renders a native <input>: label association via htmlFor + id, keyboard input, and form semantics come for free.",
    "Visible focus-visible outline for keyboard users.",
    "disabled uses the native attribute, so it is announced by screen readers and removed from tab order.",
  ],
  examples: [
    {
      title: "Default (text)",
      code: '<Input value={value} onChange={(e) => setValue(e.target.value)} />',
    },
    {
      title: "With placeholder",
      code: '<Input placeholder="you@example.com" type="email" />',
    },
    {
      title: "Labeled via htmlFor",
      code: '<label htmlFor="email">Email</label>\n<Input id="email" type="email" />',
    },
    { title: "Disabled", code: "<Input value=\"read only\" disabled />" },
  ],
} as const;
