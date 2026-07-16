import { afterEach, describe, expect, it, vi } from "vitest";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { Button } from "./button";

afterEach(cleanup);

describe("Button", () => {
  it("renders children", () => {
    render(<Button>Save</Button>);
    expect(screen.getByRole("button", { name: "Save" })).toBeDefined();
  });

  it("defaults type to button", () => {
    render(<Button>Save</Button>);
    expect(screen.getByRole("button").getAttribute("type")).toBe("button");
  });

  it("respects an explicit type", () => {
    render(<Button type="submit">Send</Button>);
    expect(screen.getByRole("button").getAttribute("type")).toBe("submit");
  });

  it("fires onClick", () => {
    const onClick = vi.fn();
    render(<Button onClick={onClick}>Save</Button>);
    fireEvent.click(screen.getByRole("button"));
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it("uses the native disabled attribute", () => {
    const onClick = vi.fn();
    render(
      <Button disabled onClick={onClick}>
        Save
      </Button>,
    );
    const button = screen.getByRole("button");
    expect(button.hasAttribute("disabled")).toBe(true);
    fireEvent.click(button);
    expect(onClick).not.toHaveBeenCalled();
  });

  it("forwards ref to the underlying button element", () => {
    let element: HTMLButtonElement | null = null;
    render(
      <Button
        ref={(node) => {
          element = node;
        }}
      >
        Save
      </Button>,
    );
    expect(element).toBeInstanceOf(HTMLButtonElement);
  });

  it("appends className after the defaults", () => {
    render(<Button className="w-full">Save</Button>);
    const classes = screen.getByRole("button").className;
    expect(classes.endsWith("w-full")).toBe(true);
    expect(classes).toContain("inline-flex");
  });
});
