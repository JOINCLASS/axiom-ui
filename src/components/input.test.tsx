import { afterEach, describe, expect, it, vi } from "vitest";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { Input } from "./input";

afterEach(cleanup);

describe("Input", () => {
  it("renders a native input", () => {
    render(<Input placeholder="type here" />);
    expect(screen.getByPlaceholderText("type here")).toBeInstanceOf(
      HTMLInputElement,
    );
  });

  it("fires onChange", () => {
    const onChange = vi.fn();
    render(<Input onChange={onChange} />);
    fireEvent.change(screen.getByRole("textbox"), { target: { value: "hi" } });
    expect(onChange).toHaveBeenCalledTimes(1);
  });

  it("passes disabled through", () => {
    render(<Input disabled />);
    expect(screen.getByRole("textbox")).toHaveProperty("disabled", true);
  });

  it("forwards ref", () => {
    let element: HTMLInputElement | null = null;
    render(
      <Input
        ref={(node) => {
          element = node;
        }}
      />,
    );
    expect(element).toBeInstanceOf(HTMLInputElement);
  });

  it("appends className after defaults", () => {
    render(<Input className="border-red-500" />);
    const classes = screen.getByRole("textbox").className;
    expect(classes.endsWith("border-red-500")).toBe(true);
    expect(classes).toContain("rounded-md");
  });
});
