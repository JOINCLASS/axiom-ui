/**
 * Stateless toast notification. Renders in the browser's top layer
 * via <div popover="manual"> — no z-index stacking. Timing, queue,
 * and dismissal are the caller's responsibility (this is why the
 * library has no `toast()` global API; for that, use Sonner).
 * Set role="alert" for errors that must interrupt; the default
 * role="status" announces politely.
 */
import { useEffect, useRef, type ComponentPropsWithRef } from "react";

export type ToastProps = ComponentPropsWithRef<"div"> & {
  open: boolean;
};

export function Toast({ open, className, role = "status", ...props }: ToastProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = ref.current;
    if (!element || typeof element.showPopover !== "function") return;
    let isOpen = false;
    try { isOpen = element.matches(":popover-open"); } catch { /* pre-popover browser */ }
    if (open && !isOpen) element.showPopover();
    else if (!open && isOpen) element.hidePopover();
  }, [open]);

  return (
    <div
      ref={ref}
      popover="manual"
      role={role}
      className={
        "fixed right-4 bottom-4 max-w-sm rounded-md border border-zinc-200 bg-white p-4 text-sm text-zinc-900 shadow-lg" +
        (className ? " " + className : "")
      }
      {...props}
    />
  );
}

export const manifest = {
  intent:
    'Stateless toast in the top layer. Caller owns open state, timing, and dismissal (render a close Button in children, or set a timeout). For a queue + toast() sugar, use Sonner — the library intentionally does not ship an imperative API.',
  props: {
    open: "Required boolean. Flip to show/hide. The native popover=manual mode means only your code closes it — Escape / outside-click do NOT.",
    role: 'Optional. Default "status" (polite announcement). Use "alert" for errors that must interrupt the screen reader.',
    "...native":
      "Every ComponentPropsWithRef<'div'> attribute passes through (children, aria-*, ref, ...).",
    className:
      "Escape hatch: appended after the defaults (fixed bottom-right, max-w-sm, white card). Override position with `!top-4`, `!left-4`, etc.",
  },
  states: ["closed", "open"],
  a11y: [
    'role="status" implies aria-live="polite" — announced after the current speech.',
    'role="alert" implies aria-live="assertive" — interrupts. Reserve for errors.',
    "Manual mode: Escape does NOT close the toast. Provide a visible dismiss control (usually a close Button in children).",
    "Requires the native Popover API (Chrome/Edge 114+, Safari 17.4+, Firefox 125+). On older browsers renders as an inline <div> — still functional and announced.",
  ],
  examples: [
    {
      title: "Auto-dismiss after 4 seconds",
      code: 'const [open, setOpen] = useState(false);\nuseEffect(() => {\n  if (!open) return;\n  const id = setTimeout(() => setOpen(false), 4000);\n  return () => clearTimeout(id);\n}, [open]);\n<>\n  <Button onClick={() => setOpen(true)}>Save</Button>\n  <Toast open={open}>Changes saved.</Toast>\n</>',
    },
    {
      title: "Error toast with manual close",
      code: '<Toast open={error !== null} role="alert" className="border-red-300 bg-red-50">\n  <div className="flex items-start justify-between gap-4">\n    <p>{error}</p>\n    <Button onClick={() => setError(null)} className="!bg-transparent !text-zinc-500">✕</Button>\n  </div>\n</Toast>',
    },
  ],
} as const;
