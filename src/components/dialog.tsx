/**
 * Modal dialog built on the native <dialog> element. Focus trapping,
 * Escape-to-close, inert background, and the ::backdrop pseudo-element
 * come for free from the browser. Open and close by calling
 * showModal() and close() on the ref.
 */
import type { ComponentPropsWithRef } from "react";

export type DialogProps = ComponentPropsWithRef<"dialog">;

export function Dialog({ className, ...props }: DialogProps) {
  return (
    <dialog
      className={
        "m-auto w-full max-w-md rounded-lg border border-zinc-200 bg-white p-6 text-zinc-900 shadow-xl backdrop:bg-zinc-900/50" +
        (className ? " " + className : "")
      }
      {...props}
    />
  );
}

export const manifest = {
  intent:
    "Modal dialog on the native <dialog>. Control via ref.current.showModal() and ref.current.close(). The browser handles focus trap, Escape, backdrop click, and inert background.",
  props: {
    "...native":
      "Every ComponentPropsWithRef<'dialog'> attribute passes through unchanged (open, onClose, aria-*, ref, ...).",
    className:
      "Escape hatch: Tailwind classes appended after the defaults. The ::backdrop pseudo-element is styled via the `backdrop:` variant.",
  },
  states: ["closed", "open (non-modal)", "open (modal via showModal())"],
  a11y: [
    "Renders a native <dialog>: focus is trapped inside while modal, Escape closes it, background is inert, and screen readers announce modality.",
    "Open with ref.current.showModal() for modal semantics. Use open={true} only for non-modal (no backdrop, no focus trap).",
    'Give the dialog an accessible name via aria-label or aria-labelledby pointing at your heading.',
  ],
  examples: [
    {
      title: "Modal (open imperatively via ref)",
      code: 'const ref = useRef<HTMLDialogElement>(null);\n<>\n  <Button onClick={() => ref.current?.showModal()}>Open</Button>\n  <Dialog ref={ref} aria-labelledby="title">\n    <h2 id="title">Confirm</h2>\n    <p>Delete this item?</p>\n    <form method="dialog">\n      <Button type="submit">Cancel</Button>\n    </form>\n  </Dialog>\n</>',
    },
    {
      title: "Close on form submit (built-in)",
      code: '<form method="dialog"><Button type="submit">Close</Button></form>',
    },
  ],
} as const;
