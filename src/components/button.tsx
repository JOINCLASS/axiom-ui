/**
 * Trigger an action. The only button — one style, no variants.
 * Accepts every native <button> attribute; `type` defaults to "button"
 * so it never submits a form by accident.
 */
import type { ComponentPropsWithRef } from "react";

export type ButtonProps = ComponentPropsWithRef<"button">;

export function Button({ className, type = "button", ...props }: ButtonProps) {
  return (
    <button
      type={type}
      className={
        "inline-flex cursor-pointer items-center justify-center rounded-md bg-zinc-900 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-zinc-700 active:bg-zinc-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-zinc-900 disabled:pointer-events-none disabled:opacity-50" +
        (className ? " " + className : "")
      }
      {...props}
    />
  );
}

export const manifest = {
  intent:
    "Trigger an action. The only button in the library. Adjust looks by appending Tailwind classes via className.",
  props: {
    "...native":
      "Every ComponentPropsWithRef<'button'> attribute passes through unchanged (onClick, disabled, aria-*, form attributes, ref, ...).",
    type: '"button" | "submit" | "reset" — defaults to "button" so it never submits a form by accident.',
    className:
      "Escape hatch: Tailwind classes appended after the defaults, so they win when they conflict.",
  },
  states: ["idle", "hover", "focus-visible", "active", "disabled"],
  a11y: [
    "Renders a native <button>: keyboard activation (Enter/Space) and focus semantics come for free.",
    "Visible focus-visible outline for keyboard users.",
    "disabled uses the native attribute, so it is announced by screen readers and removed from tab order.",
  ],
  examples: [
    { title: "Default", code: "<Button onClick={save}>Save</Button>" },
    { title: "Disabled", code: "<Button disabled>Save</Button>" },
    {
      title: "Full width via escape hatch",
      code: '<Button className="w-full">Save</Button>',
    },
    { title: "Submit inside a form", code: '<Button type="submit">Send</Button>' },
  ],
} as const;
