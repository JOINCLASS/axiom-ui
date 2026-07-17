import { afterEach, describe, expect, it } from "vitest";
import { cleanup, render, screen } from "@testing-library/react";
import { createRef } from "react";
import { Toast } from "./toast";

afterEach(cleanup);

const opts = { hidden: true } as const;

describe("Toast", () => {
  it('defaults to role="status"', () => {
    render(<Toast open>Saved</Toast>);
    expect(screen.getByRole("status", opts).textContent).toBe("Saved");
  });

  it('accepts role="alert"', () => {
    render(
      <Toast open role="alert">
        Boom
      </Toast>,
    );
    expect(screen.getByRole("alert", opts).textContent).toBe("Boom");
  });

  it('renders as popover="manual"', () => {
    render(<Toast open>Saved</Toast>);
    expect(screen.getByRole("status", opts).getAttribute("popover")).toBe("manual");
  });

  it("appends className after defaults", () => {
    render(
      <Toast open className="border-red-300">
        Err
      </Toast>,
    );
    const el = screen.getByRole("status", opts);
    expect(el.className.endsWith("border-red-300")).toBe(true);
    expect(el.className).toContain("fixed");
  });

  it("forwards ref", () => {
    const ref = createRef<HTMLDivElement>();
    render(
      <Toast open ref={ref}>
        Saved
      </Toast>,
    );
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
  });
});
