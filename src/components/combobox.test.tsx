import { afterEach, describe, expect, it, vi } from "vitest";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { useState } from "react";
import { Combobox, type ComboboxOption } from "./combobox";

afterEach(cleanup);

const options: ComboboxOption[] = [
  { value: "apple", label: "Apple" },
  { value: "banana", label: "Banana" },
  { value: "cherry", label: "Cherry" },
];

function Harness() {
  const [value, setValue] = useState("");
  return <Combobox options={options} value={value} onChange={setValue} placeholder="pick" />;
}

describe("Combobox", () => {
  it("renders a role=combobox input", () => {
    render(<Harness />);
    expect(screen.getByRole("combobox")).toBeInstanceOf(HTMLInputElement);
  });

  it("opens the listbox on focus and shows all options", () => {
    render(<Harness />);
    fireEvent.focus(screen.getByRole("combobox"));
    expect(screen.getAllByRole("option")).toHaveLength(3);
  });

  it("filters options by substring on label (case-insensitive)", () => {
    render(<Harness />);
    fireEvent.focus(screen.getByRole("combobox"));
    fireEvent.change(screen.getByRole("combobox"), { target: { value: "AN" } });
    const opts = screen.getAllByRole("option").map((el) => el.textContent);
    expect(opts).toEqual(["Banana"]);
  });

  it("Enter selects the highlighted option and calls onChange", () => {
    const onChange = vi.fn();
    render(<Combobox options={options} value="" onChange={onChange} />);
    fireEvent.focus(screen.getByRole("combobox"));
    fireEvent.keyDown(screen.getByRole("combobox"), { key: "ArrowDown" });
    fireEvent.keyDown(screen.getByRole("combobox"), { key: "Enter" });
    expect(onChange).toHaveBeenCalledWith("banana");
  });

  it("ArrowDown moves aria-activedescendant", () => {
    render(<Harness />);
    const input = screen.getByRole("combobox");
    fireEvent.focus(input);
    fireEvent.keyDown(input, { key: "ArrowDown" });
    const active = input.getAttribute("aria-activedescendant");
    expect(active).toBeTruthy();
    expect(document.getElementById(active!)?.textContent).toBe("Banana");
  });

  it("Escape closes the listbox", () => {
    render(<Harness />);
    fireEvent.focus(screen.getByRole("combobox"));
    expect(screen.queryByRole("listbox")).not.toBeNull();
    fireEvent.keyDown(screen.getByRole("combobox"), { key: "Escape" });
    expect(screen.queryByRole("listbox")).toBeNull();
  });

  it("shows emptyMessage when no options match", () => {
    render(<Harness />);
    fireEvent.focus(screen.getByRole("combobox"));
    fireEvent.change(screen.getByRole("combobox"), { target: { value: "zzz" } });
    expect(screen.getByText("No results")).toBeInstanceOf(HTMLLIElement);
  });

  it("omits disabled options from the filtered list", () => {
    const opts: ComboboxOption[] = [
      { value: "a", label: "Alpha" },
      { value: "b", label: "Beta", disabled: true },
    ];
    render(<Combobox options={opts} value="" onChange={() => {}} />);
    fireEvent.focus(screen.getByRole("combobox"));
    const rendered = screen.getAllByRole("option").map((el) => el.textContent);
    expect(rendered).toEqual(["Alpha"]);
  });
});
