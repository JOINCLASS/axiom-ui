import { afterEach, describe, expect, it, vi } from "vitest";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { Checkbox } from "./checkbox";

afterEach(cleanup);

describe("Checkbox", () => {
  it('is type="checkbox"', () => {
    render(<Checkbox aria-label="agree" />);
    expect(screen.getByRole("checkbox").getAttribute("type")).toBe("checkbox");
  });

  it("fires onChange", () => {
    const onChange = vi.fn();
    render(<Checkbox aria-label="agree" onChange={onChange} />);
    fireEvent.click(screen.getByRole("checkbox"));
    expect(onChange).toHaveBeenCalledTimes(1);
  });

  it('accepts role="switch" for the switch pattern', () => {
    render(<Checkbox role="switch" aria-label="wifi" />);
    expect(screen.getByRole("switch")).toBeInstanceOf(HTMLInputElement);
  });

  it("forwards ref", () => {
    let element: HTMLInputElement | null = null;
    render(
      <Checkbox
        aria-label="agree"
        ref={(node) => {
          element = node;
        }}
      />,
    );
    expect(element).toBeInstanceOf(HTMLInputElement);
  });
});
