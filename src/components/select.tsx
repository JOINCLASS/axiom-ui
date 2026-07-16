/**
 * A styled wrapper around the native <select>. Children are native
 * <option> elements. The dropdown chevron is left to the browser —
 * custom chevrons and custom (non-native) dropdowns were considered
 * and rejected. Native gets you mobile pickers, keyboard nav, and
 * screen-reader announcements for free.
 */
import type { ComponentPropsWithRef } from "react";

export type SelectProps = ComponentPropsWithRef<"select">;

export function Select({ className, ...props }: SelectProps) {
  return (
    <select
      className={
        "block w-full cursor-pointer rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 focus-visible:border-zinc-900 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-zinc-900 disabled:cursor-not-allowed disabled:opacity-50" +
        (className ? " " + className : "")
      }
      {...props}
    />
  );
}

export const manifest = {
  intent:
    "Styled wrapper around the native <select>. Pass <option> children. No custom dropdown — mobile-native, keyboard-native, screen-reader-native.",
  props: {
    "...native":
      "Every ComponentPropsWithRef<'select'> attribute passes through unchanged (value, onChange, name, multiple, aria-*, ref, ...).",
    children: "Native <option> and <optgroup> elements.",
    className:
      "Escape hatch: Tailwind classes appended after the defaults. Both sets land in the generated CSS, so prefix with `!` (e.g. `!p-0`, `!w-auto`) when overriding a conflicting default utility.",
  },
  states: ["idle", "focus-visible", "disabled"],
  a11y: [
    "Renders a native <select>: keyboard navigation (arrows, type-ahead), mobile-native picker UI, and screen-reader announcements come for free.",
    "Visible focus-visible outline for keyboard users.",
    "disabled uses the native attribute, so it is announced by screen readers and removed from tab order.",
  ],
  examples: [
    {
      title: "Default",
      code: '<Select value={value} onChange={(e) => setValue(e.target.value)}>\n  <option value="apple">Apple</option>\n  <option value="banana">Banana</option>\n</Select>',
    },
    {
      title: "With placeholder option",
      code: '<Select defaultValue="">\n  <option value="" disabled>Choose a fruit</option>\n  <option value="apple">Apple</option>\n</Select>',
    },
    { title: "Disabled", code: "<Select disabled><option>Locked</option></Select>" },
  ],
} as const;
