/**
 * Tabs as three stateless primitives: Tabs (the tablist container),
 * Tab (a button), TabPanel (the content). Selection state lives in
 * the caller — usually useState, but URL or form state also work.
 * Arrow keys move focus between tabs and click the newly-focused
 * one, which triggers the caller's onClick to update state.
 */
import type { ComponentPropsWithRef, KeyboardEvent } from "react";

export type TabsProps = ComponentPropsWithRef<"div">;
export type TabProps = ComponentPropsWithRef<"button"> & { selected: boolean };
export type TabPanelProps = ComponentPropsWithRef<"div"> & { selected: boolean };

export function Tabs({ className, onKeyDown, ...props }: TabsProps) {
  return (
    <div
      role="tablist"
      onKeyDown={(event: KeyboardEvent<HTMLDivElement>) => {
        onKeyDown?.(event);
        if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") return;
        const tabs = Array.from(
          event.currentTarget.querySelectorAll<HTMLElement>(
            '[role="tab"]:not([disabled])',
          ),
        );
        const index = tabs.indexOf(document.activeElement as HTMLElement);
        if (index === -1) return;
        event.preventDefault();
        const delta = event.key === "ArrowRight" ? 1 : -1;
        const next = tabs[(index + delta + tabs.length) % tabs.length];
        next?.focus();
        next?.click();
      }}
      className={
        "flex border-b border-zinc-200" + (className ? " " + className : "")
      }
      {...props}
    />
  );
}

export function Tab({ selected, className, type = "button", ...props }: TabProps) {
  return (
    <button
      type={type}
      role="tab"
      aria-selected={selected}
      tabIndex={selected ? 0 : -1}
      className={
        "-mb-px cursor-pointer border-b-2 px-4 py-2 text-sm font-medium focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-zinc-900 " +
        (selected
          ? "border-zinc-900 text-zinc-900"
          : "border-transparent text-zinc-500 hover:text-zinc-900") +
        (className ? " " + className : "")
      }
      {...props}
    />
  );
}

export function TabPanel({ selected, className, ...props }: TabPanelProps) {
  return (
    <div
      role="tabpanel"
      hidden={!selected}
      className={"p-4" + (className ? " " + className : "")}
      {...props}
    />
  );
}

export const manifest = {
  intent:
    "Stateless tabs: Tabs (tablist container), Tab (button), TabPanel (content). The caller owns the selected value. Arrow keys move focus and click the sibling; the caller's onClick updates state.",
  props: {
    "Tabs.*": "ComponentPropsWithRef<'div'>. The container's onKeyDown handles arrow-key focus navigation.",
    "Tab.selected": "Required boolean. Sets aria-selected and roving tabIndex.",
    "Tab.onClick": "The caller updates selection state here.",
    "Tab.*": "Every other native <button> attribute passes through (disabled, aria-controls, ...).",
    "TabPanel.selected": "Required boolean. Hides the panel via the native `hidden` attribute when false.",
    "TabPanel.*": "Every other native <div> attribute passes through (id, aria-labelledby, ...).",
    className:
      "Escape hatch on every primitive: Tailwind classes appended after the defaults. Both sets land in the generated CSS, so prefix with `!` (e.g. `!border-blue-500`, `!p-0`) when overriding a conflicting default utility.",
  },
  states: ["selected", "unselected", "focus-visible", "disabled (Tab)"],
  a11y: [
    "role=\"tablist\" / role=\"tab\" / role=\"tabpanel\" are wired automatically.",
    "Roving tabindex: only the selected Tab has tabIndex=0.",
    "Horizontal orientation only (arrow keys are Left/Right). No vertical variant in v0.",
    "Automatic activation: arrow keys move focus AND trigger the sibling Tab's onClick. If each tab's onClick does heavy work (e.g. loads a panel), arrowing across N tabs fires N onClicks — consider deferring that work.",
    "Pair each Tab with its TabPanel via aria-controls (on Tab) + id (on TabPanel), and each TabPanel to its Tab via aria-labelledby.",
  ],
  examples: [
    {
      title: "Controlled tabs (useState)",
      code: 'const [value, setValue] = useState("a");\n<>\n  <Tabs>\n    <Tab selected={value === "a"} onClick={() => setValue("a")} aria-controls="p-a" id="t-a">A</Tab>\n    <Tab selected={value === "b"} onClick={() => setValue("b")} aria-controls="p-b" id="t-b">B</Tab>\n  </Tabs>\n  <TabPanel selected={value === "a"} id="p-a" aria-labelledby="t-a">Panel A</TabPanel>\n  <TabPanel selected={value === "b"} id="p-b" aria-labelledby="t-b">Panel B</TabPanel>\n</>',
    },
  ],
} as const;
