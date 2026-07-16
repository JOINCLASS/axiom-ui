/**
 * Multi-line text input. Accepts every native <textarea> attribute
 * (value, onChange, placeholder, rows, aria-*, ref, ...). Rows
 * defaults to the native 2; set `rows` explicitly for a taller area.
 */
import type { ComponentPropsWithRef } from "react";

export type TextareaProps = ComponentPropsWithRef<"textarea">;

export function Textarea({ className, ...props }: TextareaProps) {
  return (
    <textarea
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
    "Multi-line text input. Adjust looks by appending Tailwind classes via className.",
  props: {
    "...native":
      "Every ComponentPropsWithRef<'textarea'> attribute passes through unchanged (value, onChange, placeholder, rows, cols, aria-*, ref, ...).",
    rows: "Native attribute controlling visible height in lines. Defaults to the native 2.",
    className:
      "Escape hatch: Tailwind classes appended after the defaults, so they win when they conflict.",
  },
  states: ["idle", "focus-visible", "disabled", "placeholder"],
  a11y: [
    "Renders a native <textarea>: label association via htmlFor + id, keyboard input, and form semantics come for free.",
    "Visible focus-visible outline for keyboard users.",
    "disabled uses the native attribute, so it is announced by screen readers and removed from tab order.",
  ],
  examples: [
    {
      title: "Default",
      code: '<Textarea value={value} onChange={(e) => setValue(e.target.value)} />',
    },
    {
      title: "With rows and placeholder",
      code: '<Textarea rows={6} placeholder="Write your message..." />',
    },
    {
      title: "Labeled via htmlFor",
      code: '<label htmlFor="msg">Message</label>\n<Textarea id="msg" />',
    },
  ],
} as const;
