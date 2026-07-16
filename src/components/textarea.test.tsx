import { afterEach, describe, expect, it, vi } from "vitest";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { Textarea } from "./textarea";

afterEach(cleanup);

describe("Textarea", () => {
  it("renders a native textarea", () => {
    render(<Textarea placeholder="write" />);
    expect(screen.getByPlaceholderText("write")).toBeInstanceOf(
      HTMLTextAreaElement,
    );
  });

  it("fires onChange", () => {
    const onChange = vi.fn();
    render(<Textarea onChange={onChange} />);
    fireEvent.change(screen.getByRole("textbox"), {
      target: { value: "hello" },
    });
    expect(onChange).toHaveBeenCalledTimes(1);
  });

  it("passes rows through", () => {
    render(<Textarea rows={5} />);
    expect(screen.getByRole("textbox").getAttribute("rows")).toBe("5");
  });

  it("appends className after defaults", () => {
    render(<Textarea className="min-h-40" />);
    const classes = screen.getByRole("textbox").className;
    expect(classes.endsWith("min-h-40")).toBe(true);
    expect(classes).toContain("rounded-md");
  });

  it("forwards ref", () => {
    let element: HTMLTextAreaElement | null = null;
    render(
      <Textarea
        ref={(node) => {
          element = node;
        }}
      />,
    );
    expect(element).toBeInstanceOf(HTMLTextAreaElement);
  });
});
