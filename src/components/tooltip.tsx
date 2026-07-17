/**
 * Tooltip wrapper. Wraps its children in an inline-block trigger that
 * opens a role="tooltip" Popover on hover (150ms delay) or focus, and
 * closes on unhover, blur, or Escape (Escape via Popover). Content
 * associates back to the trigger via aria-describedby.
 */
import { useEffect, useId, useRef, useState, type ReactNode } from "react";
import { Popover } from "./popover";

export type TooltipProps = {
  content: ReactNode;
  children: ReactNode;
  /** Milliseconds to wait after mouseenter before opening. Default 150. */
  delay?: number;
  className?: string;
};

export function Tooltip({ content, children, delay = 150, className }: TooltipProps) {
  const anchor = useRef<HTMLSpanElement>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [open, setOpen] = useState(false);
  const id = useId();

  useEffect(() => () => { if (timer.current !== null) clearTimeout(timer.current); }, []);

  const scheduleOpen = () => {
    if (timer.current !== null) clearTimeout(timer.current);
    timer.current = setTimeout(() => setOpen(true), delay);
  };
  const closeNow = () => {
    if (timer.current !== null) { clearTimeout(timer.current); timer.current = null; }
    setOpen(false);
  };

  return (
    <>
      <span
        ref={anchor}
        aria-describedby={open ? id : undefined}
        onMouseEnter={scheduleOpen}
        onMouseLeave={closeNow}
        onFocus={() => setOpen(true)}
        onBlur={closeNow}
        className="inline-block"
      >
        {children}
      </span>
      <Popover
        id={id}
        role="tooltip"
        open={open}
        onOpenChange={setOpen}
        anchor={anchor}
        className={
          "max-w-xs bg-zinc-900 text-white shadow-md" +
          (className ? " " + className : "")
        }
      >
        {content}
      </Popover>
    </>
  );
}

export const manifest = {
  intent:
    'Tooltip that wraps a trigger element. Opens on hover (150ms delay) or focus, closes on unhover, blur, or Escape. Associates content back to the trigger via aria-describedby.',
  props: {
    content: "ReactNode. The tooltip body.",
    children: "ReactNode. The trigger element(s), wrapped in an inline <span>.",
    delay: "Optional number of milliseconds before opening on hover. Default 150. Focus opens immediately regardless.",
    className:
      "Escape hatch: appended to the tooltip content's default styling (dark background, white text, max-w-xs).",
  },
  states: ["closed", "opening (during hover delay)", "open"],
  a11y: [
    'role="tooltip" on the popover; aria-describedby on the trigger wrapper points to it while open.',
    "Focus opens immediately (no delay) — accessible for keyboard users.",
    "Escape closes the tooltip (Popover handles).",
    "Do not use for critical information — tooltips are hidden by default and inaccessible on touch devices.",
  ],
  examples: [
    {
      title: "Wrap a button",
      code: '<Tooltip content="Save the changes">\n  <Button onClick={save}>Save</Button>\n</Tooltip>',
    },
    {
      title: "Wrap an icon-only button (with aria-label)",
      code: '<Tooltip content="Delete">\n  <Button aria-label="Delete" onClick={remove}>🗑</Button>\n</Tooltip>',
    },
  ],
} as const;
