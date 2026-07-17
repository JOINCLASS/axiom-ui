/**
 * Controlled wrapper around the native <div popover> element (Baseline
 * 2024). Renders in the browser's top layer — no z-index stacking, no
 * backdrop-click plumbing (Escape and outside-click close it via the
 * "auto" mode). Pass an `anchor` ref to position it below that
 * element; omit `anchor` for the browser's centered default.
 */
import { useEffect, useRef, type ComponentPropsWithRef, type RefObject } from "react";

export type PopoverProps = ComponentPropsWithRef<"div"> & {
  open: boolean;
  onOpenChange?: (open: boolean) => void;
  anchor?: RefObject<HTMLElement | null>;
};

export function Popover({ open, onOpenChange, anchor, className, ref: userRef, ...props }: PopoverProps) {
  const ref = useRef<HTMLDivElement>(null);
  const setRef = (node: HTMLDivElement | null) => {
    ref.current = node;
    if (typeof userRef === "function") userRef(node);
    else if (userRef) userRef.current = node;
  };

  useEffect(() => {
    const element = ref.current;
    if (!element || typeof element.showPopover !== "function") return;
    let isOpen = false;
    try { isOpen = element.matches(":popover-open"); } catch { /* pre-popover browser */ }
    if (open && !isOpen) element.showPopover();
    else if (!open && isOpen) element.hidePopover();
  }, [open]);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;
    if (!open || !anchor?.current) {
      element.style.position = element.style.top = element.style.left = element.style.margin = "";
      return;
    }
    const rect = anchor.current.getBoundingClientRect();
    element.style.position = "fixed";
    element.style.top = `${rect.bottom + 4}px`;
    element.style.left = `${rect.left}px`;
    element.style.margin = "0";
  }, [open, anchor]);

  useEffect(() => {
    const element = ref.current;
    if (!element || !onOpenChange) return;
    const handle = (event: Event) => {
      onOpenChange((event as ToggleEvent).newState === "open");
    };
    element.addEventListener("toggle", handle);
    return () => element.removeEventListener("toggle", handle);
  }, [onOpenChange]);

  return (
    <div
      ref={setRef}
      popover="auto"
      className={
        "rounded-md border border-zinc-200 bg-white p-2 text-sm text-zinc-900 shadow-lg" +
        (className ? " " + className : "")
      }
      {...props}
    />
  );
}

export const manifest = {
  intent:
    'Controlled top-layer popup using the native <div popover>. Provide an `anchor` ref to place it below that element, or omit it for the browser\'s centered default. "auto" mode: Escape and outside-click close it and fire onOpenChange(false).',
  props: {
    open: "Required boolean. The caller owns state — flip it to show/hide.",
    onOpenChange:
      "(open: boolean) => void. Fires when the browser opens or closes the popover, including via Escape or outside-click. Use to keep your `open` state in sync.",
    anchor:
      "Optional RefObject<HTMLElement>. When set, the popover positions itself just below the anchor's bounding rect. Omit for browser-centered.",
    "...native":
      "Every ComponentPropsWithRef<'div'> attribute passes through (children, aria-*, role, ...).",
    className:
      "Escape hatch: Tailwind classes appended after the defaults. Both sets land in the generated CSS, so prefix with `!` (e.g. `!p-0`, `!max-w-sm`) when overriding a conflicting default utility.",
  },
  states: ["closed", "open"],
  a11y: [
    'Rendered in the top layer via native popover="auto" — never trapped behind other stacking contexts.',
    "Escape closes the popover; the browser routes the event even when focus is inside.",
    "Clicking outside closes it (auto mode).",
    "Give the popover an accessible role (menu, dialog, tooltip, ...) via the `role` prop when using it as a base for another primitive.",
    "Requires the native Popover API (Chrome/Edge 114+, Safari 17.4+, Firefox 125+). On older browsers the element renders as a plain <div> — functional but not floating.",
    "Anchor positioning is naive (below + left edge of the anchor). No viewport-edge flipping in v0.2 — for menus near a screen edge, pass a `className` position override or wait for CSS anchor positioning support.",
  ],
  examples: [
    {
      title: "Anchored below a button",
      code: 'const anchor = useRef<HTMLButtonElement>(null);\nconst [open, setOpen] = useState(false);\n<>\n  <Button ref={anchor} onClick={() => setOpen(true)}>Open</Button>\n  <Popover open={open} onOpenChange={setOpen} anchor={anchor}>\n    Any content here.\n  </Popover>\n</>',
    },
    {
      title: "Centered (no anchor)",
      code: '<Popover open={open} onOpenChange={setOpen} className="max-w-sm">\n  Centered popover content.\n</Popover>',
    },
  ],
} as const;
