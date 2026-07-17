/**
 * Anchored menu built on top of Popover. Two primitives: Menu (the
 * role="menu" container) and MenuItem (a role="menuitem" button).
 * Selection state lives in the caller — flip `open` on click, react
 * to each MenuItem's onClick. Arrow keys / Home / End move focus
 * inside the menu; Escape closes it (Popover handles both).
 */
import { useEffect, useRef, type ComponentPropsWithRef, type KeyboardEvent, type RefObject } from "react";
import { Popover } from "./popover";

export type MenuProps = Omit<ComponentPropsWithRef<"div">, "ref"> & {
  open: boolean;
  onOpenChange?: (open: boolean) => void;
  anchor?: RefObject<HTMLElement | null>;
};

export type MenuItemProps = ComponentPropsWithRef<"button">;

export function Menu({ open, onOpenChange, anchor, className, onKeyDown, ...props }: MenuProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const first = ref.current?.querySelector<HTMLElement>('[role="menuitem"]:not([disabled])');
    first?.focus();
  }, [open]);

  return (
    <Popover
      ref={ref}
      open={open}
      onOpenChange={onOpenChange}
      anchor={anchor}
      role="menu"
      onKeyDown={(event: KeyboardEvent<HTMLDivElement>) => {
        onKeyDown?.(event);
        const { key } = event;
        if (key !== "ArrowDown" && key !== "ArrowUp" && key !== "Home" && key !== "End") return;
        const items = Array.from(
          event.currentTarget.querySelectorAll<HTMLElement>('[role="menuitem"]:not([disabled])'),
        );
        if (items.length === 0) return;
        event.preventDefault();
        const active = document.activeElement as HTMLElement | null;
        const index = active ? items.indexOf(active) : -1;
        let next: HTMLElement | undefined;
        if (key === "Home") next = items[0];
        else if (key === "End") next = items[items.length - 1];
        else if (key === "ArrowDown") next = items[(index + 1) % items.length];
        else next = items[(index - 1 + items.length) % items.length];
        next?.focus();
      }}
      className={"flex min-w-40 flex-col gap-0.5 p-1" + (className ? " " + className : "")}
      {...props}
    />
  );
}

export function MenuItem({ className, type = "button", ...props }: MenuItemProps) {
  return (
    <button
      type={type}
      role="menuitem"
      tabIndex={-1}
      className={
        "block w-full cursor-pointer rounded px-3 py-1.5 text-left text-sm hover:bg-zinc-100 focus-visible:bg-zinc-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-zinc-900 disabled:pointer-events-none disabled:opacity-50" +
        (className ? " " + className : "")
      }
      {...props}
    />
  );
}

export const manifest = {
  intent:
    "Anchored menu on top of Popover. Menu = role=menu container; MenuItem = role=menuitem button. Caller flips `open` on trigger; each MenuItem's onClick fires. Arrow keys navigate; Escape / outside-click close.",
  props: {
    "Menu.open": "Required boolean.",
    "Menu.onOpenChange": "(open: boolean) => void — Popover close callback.",
    "Menu.anchor": "Optional RefObject<HTMLElement> — positions menu below.",
    "Menu.*": "ComponentPropsWithRef<'div'> pass-through EXCEPT `ref`.",
    "MenuItem.*": "Native <button> pass-through. type defaults to 'button'.",
    className: "Escape hatch. Prefix `!` to override conflicting defaults.",
  },
  states: ["closed", "open"],
  a11y: [
    'role="menu" / role="menuitem" wired automatically.',
    "On open, focus moves to first enabled item.",
    "ArrowUp/Down wrap; Home/End jump; Enter/Space activate (native button).",
    "Escape / outside-click close (Popover auto mode).",
    "No submenu (nested) in v0.",
  ],
  examples: [
    {
      title: "Dropdown menu",
      code: 'const trigger = useRef<HTMLButtonElement>(null);\nconst [open, setOpen] = useState(false);\n<>\n  <Button ref={trigger} onClick={() => setOpen(o => !o)}>Actions</Button>\n  <Menu open={open} onOpenChange={setOpen} anchor={trigger}>\n    <MenuItem onClick={() => { rename(); setOpen(false); }}>Rename</MenuItem>\n    <MenuItem disabled>Archive</MenuItem>\n  </Menu>\n</>',
    },
  ],
} as const;
