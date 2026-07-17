import { afterEach, describe, expect, it, vi } from "vitest";
import { cleanup, render, screen } from "@testing-library/react";
import { createRef } from "react";
import { Popover } from "./popover";

afterEach(cleanup);

describe("Popover", () => {
  it("renders a native popover element", () => {
    render(
      <Popover open aria-label="menu">
        <p>content</p>
      </Popover>,
    );
    const el = screen.getByText("content").parentElement as HTMLElement;
    expect(el.tagName).toBe("DIV");
    expect(el.getAttribute("popover")).toBe("auto");
  });

  it("appends className after defaults", () => {
    render(
      <Popover open aria-label="menu" className="min-w-64">
        <p>content</p>
      </Popover>,
    );
    const el = screen.getByText("content").parentElement as HTMLElement;
    expect(el.className.endsWith("min-w-64")).toBe(true);
    expect(el.className).toContain("rounded-md");
  });

  it("forwards ref", () => {
    const ref = createRef<HTMLDivElement>();
    render(
      <Popover open ref={ref} aria-label="menu">
        <p>content</p>
      </Popover>,
    );
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
  });

  it("passes through aria attributes", () => {
    render(
      <Popover open aria-labelledby="title" role="menu">
        <p>content</p>
      </Popover>,
    );
    const el = screen.getByText("content").parentElement as HTMLElement;
    expect(el.getAttribute("aria-labelledby")).toBe("title");
    expect(el.getAttribute("role")).toBe("menu");
  });

  it("calls onOpenChange when the browser toggles the popover", () => {
    const onOpenChange = vi.fn();
    render(
      <Popover open aria-label="menu" onOpenChange={onOpenChange}>
        <p>content</p>
      </Popover>,
    );
    const el = screen.getByText("content").parentElement as HTMLElement;
    el.dispatchEvent(new Event("toggle"));
    expect(onOpenChange).toHaveBeenCalledTimes(1);
  });
});
