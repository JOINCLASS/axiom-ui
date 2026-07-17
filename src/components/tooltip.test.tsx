import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { act, cleanup, fireEvent, render, screen } from "@testing-library/react";
import { Tooltip } from "./tooltip";

const opts = { hidden: true } as const;

beforeEach(() => {
  vi.useFakeTimers();
});
afterEach(() => {
  vi.useRealTimers();
  cleanup();
});

describe("Tooltip", () => {
  it("wraps children in an inline trigger", () => {
    render(
      <Tooltip content="tip">
        <button>Hover me</button>
      </Tooltip>,
    );
    expect(screen.getByText("Hover me").parentElement?.className).toContain("inline-block");
  });

  it("associates content via aria-describedby when open", () => {
    render(
      <Tooltip content="Save the changes">
        <button>Save</button>
      </Tooltip>,
    );
    const trigger = screen.getByText("Save").parentElement as HTMLElement;
    expect(trigger.getAttribute("aria-describedby")).toBeNull();
    fireEvent.focus(trigger);
    expect(trigger.getAttribute("aria-describedby")).not.toBeNull();
  });

  it("opens on focus immediately", () => {
    render(
      <Tooltip content="tip">
        <button>Save</button>
      </Tooltip>,
    );
    const trigger = screen.getByText("Save").parentElement as HTMLElement;
    fireEvent.focus(trigger);
    expect(screen.getByRole("tooltip", opts).textContent).toBe("tip");
  });

  it("opens on hover after the delay", () => {
    render(
      <Tooltip content="tip" delay={100}>
        <button>Save</button>
      </Tooltip>,
    );
    const trigger = screen.getByText("Save").parentElement as HTMLElement;
    fireEvent.mouseEnter(trigger);
    expect(trigger.getAttribute("aria-describedby")).toBeNull();
    act(() => { vi.advanceTimersByTime(100); });
    expect(trigger.getAttribute("aria-describedby")).not.toBeNull();
    expect(screen.getByRole("tooltip", opts).textContent).toBe("tip");
  });

  it("mouseleave cancels a pending open", () => {
    render(
      <Tooltip content="tip" delay={100}>
        <button>Save</button>
      </Tooltip>,
    );
    const trigger = screen.getByText("Save").parentElement as HTMLElement;
    fireEvent.mouseEnter(trigger);
    fireEvent.mouseLeave(trigger);
    act(() => { vi.advanceTimersByTime(200); });
    expect(trigger.getAttribute("aria-describedby")).toBeNull();
  });
});
