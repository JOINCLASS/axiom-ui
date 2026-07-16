import { afterEach, describe, expect, it, vi } from "vitest";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { Tab, TabPanel, Tabs } from "./tabs";

afterEach(cleanup);

describe("Tabs", () => {
  it("wires roles and roving tabindex", () => {
    render(
      <Tabs>
        <Tab selected>A</Tab>
        <Tab selected={false}>B</Tab>
      </Tabs>,
    );
    const tabs = screen.getAllByRole("tab");
    expect(tabs[0]?.getAttribute("aria-selected")).toBe("true");
    expect(tabs[0]?.tabIndex).toBe(0);
    expect(tabs[1]?.getAttribute("aria-selected")).toBe("false");
    expect(tabs[1]?.tabIndex).toBe(-1);
  });

  it("ArrowRight focuses and clicks the next tab", () => {
    const onClickA = vi.fn();
    const onClickB = vi.fn();
    render(
      <Tabs>
        <Tab selected onClick={onClickA}>A</Tab>
        <Tab selected={false} onClick={onClickB}>B</Tab>
      </Tabs>,
    );
    const [a, b] = screen.getAllByRole("tab") as HTMLButtonElement[];
    a!.focus();
    fireEvent.keyDown(a!, { key: "ArrowRight" });
    expect(document.activeElement).toBe(b);
    expect(onClickB).toHaveBeenCalledTimes(1);
  });

  it("ArrowLeft wraps around", () => {
    render(
      <Tabs>
        <Tab selected>A</Tab>
        <Tab selected={false}>B</Tab>
      </Tabs>,
    );
    const [a, b] = screen.getAllByRole("tab") as HTMLButtonElement[];
    a!.focus();
    fireEvent.keyDown(a!, { key: "ArrowLeft" });
    expect(document.activeElement).toBe(b);
  });

  it("TabPanel hides when not selected", () => {
    render(<TabPanel selected={false}>hidden</TabPanel>);
    expect(screen.getByText("hidden").hasAttribute("hidden")).toBe(true);
  });
});
