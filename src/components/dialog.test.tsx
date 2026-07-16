import { afterEach, describe, expect, it } from "vitest";
import { cleanup, render, screen } from "@testing-library/react";
import { createRef } from "react";
import { Dialog } from "./dialog";

afterEach(cleanup);

describe("Dialog", () => {
  it("renders a native <dialog>", () => {
    render(
      <Dialog aria-label="d" open>
        <p>content</p>
      </Dialog>,
    );
    // jsdom exposes it as HTMLDialogElement even without showModal support.
    const dialog = screen.getByRole("dialog");
    expect(dialog.tagName).toBe("DIALOG");
  });

  it("forwards ref to the dialog element", () => {
    const ref = createRef<HTMLDialogElement>();
    render(
      <Dialog ref={ref} open aria-label="d">
        <p>content</p>
      </Dialog>,
    );
    expect(ref.current).toBeInstanceOf(HTMLDialogElement);
  });

  it("appends className after defaults", () => {
    render(
      <Dialog open aria-label="d" className="max-w-lg">
        <p>content</p>
      </Dialog>,
    );
    const classes = screen.getByRole("dialog").className;
    expect(classes.endsWith("max-w-lg")).toBe(true);
    expect(classes).toContain("rounded-lg");
  });
});
