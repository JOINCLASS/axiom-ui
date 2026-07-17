import { afterEach, describe, expect, it, vi } from "vitest";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { Menu, MenuItem } from "./menu";

afterEach(cleanup);

// jsdom lacks the native Popover API, so <div popover> is treated as hidden.
// Pass { hidden: true } to queries; in a real browser showPopover() makes it visible.
const opts = { hidden: true } as const;

describe("Menu", () => {
  it("wires role=menu and role=menuitem", () => {
    render(
      <Menu open aria-label="actions">
        <MenuItem>Rename</MenuItem>
        <MenuItem>Duplicate</MenuItem>
      </Menu>,
    );
    const menu = screen.getByRole("menu", opts);
    expect(menu).toBeInstanceOf(HTMLDivElement);
    expect(menu.getAttribute("aria-label")).toBe("actions");
    expect(screen.getAllByRole("menuitem", opts)).toHaveLength(2);
  });

  it("MenuItem is type=button by default", () => {
    render(
      <Menu open aria-label="m">
        <MenuItem>Rename</MenuItem>
      </Menu>,
    );
    expect(screen.getByRole("menuitem", opts).getAttribute("type")).toBe("button");
  });

  it("MenuItem fires onClick", () => {
    const onClick = vi.fn();
    render(
      <Menu open aria-label="m">
        <MenuItem onClick={onClick}>Rename</MenuItem>
      </Menu>,
    );
    fireEvent.click(screen.getByRole("menuitem", opts));
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it("ArrowDown moves focus to the next enabled item, skipping disabled", () => {
    render(
      <Menu open aria-label="m">
        <MenuItem>A</MenuItem>
        <MenuItem disabled>B</MenuItem>
        <MenuItem>C</MenuItem>
      </Menu>,
    );
    const items = screen.getAllByRole("menuitem", opts) as HTMLButtonElement[];
    items[0]!.focus();
    fireEvent.keyDown(screen.getByRole("menu", opts), { key: "ArrowDown" });
    expect(document.activeElement).toBe(items[2]);
  });

  it("End jumps to the last enabled item", () => {
    render(
      <Menu open aria-label="m">
        <MenuItem>A</MenuItem>
        <MenuItem>B</MenuItem>
        <MenuItem>C</MenuItem>
      </Menu>,
    );
    const items = screen.getAllByRole("menuitem", opts) as HTMLButtonElement[];
    items[0]!.focus();
    fireEvent.keyDown(screen.getByRole("menu", opts), { key: "End" });
    expect(document.activeElement).toBe(items[2]);
  });

  it("ArrowUp wraps from first to last", () => {
    render(
      <Menu open aria-label="m">
        <MenuItem>A</MenuItem>
        <MenuItem>B</MenuItem>
      </Menu>,
    );
    const items = screen.getAllByRole("menuitem", opts) as HTMLButtonElement[];
    items[0]!.focus();
    fireEvent.keyDown(screen.getByRole("menu", opts), { key: "ArrowUp" });
    expect(document.activeElement).toBe(items[1]);
  });
});
