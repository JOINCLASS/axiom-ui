import { afterEach, describe, expect, it, vi } from "vitest";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { Select } from "./select";

afterEach(cleanup);

describe("Select", () => {
  it("renders a native select with options", () => {
    render(
      <Select defaultValue="a">
        <option value="a">A</option>
        <option value="b">B</option>
      </Select>,
    );
    expect(screen.getByRole("combobox")).toBeInstanceOf(HTMLSelectElement);
  });

  it("fires onChange", () => {
    const onChange = vi.fn();
    render(
      <Select onChange={onChange} defaultValue="a">
        <option value="a">A</option>
        <option value="b">B</option>
      </Select>,
    );
    fireEvent.change(screen.getByRole("combobox"), { target: { value: "b" } });
    expect(onChange).toHaveBeenCalledTimes(1);
  });

  it("passes disabled through", () => {
    render(
      <Select disabled>
        <option>x</option>
      </Select>,
    );
    expect(screen.getByRole("combobox")).toHaveProperty("disabled", true);
  });

  it("forwards ref", () => {
    let element: HTMLSelectElement | null = null;
    render(
      <Select
        ref={(node) => {
          element = node;
        }}
      >
        <option>x</option>
      </Select>,
    );
    expect(element).toBeInstanceOf(HTMLSelectElement);
  });
});
