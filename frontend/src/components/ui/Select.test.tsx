import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import Select from "./Select";

describe("Select component", () => {
  it("should render select options correctly", () => {
    render(
      <Select data-testid="select">
        <option value="1">Option A</option>
        <option value="2">Option B</option>
      </Select>,
    );

    const select = screen.getByTestId("select") as HTMLSelectElement;
    expect(select).toBeInTheDocument();
    expect(select.options).toHaveLength(2);
    expect(select.options[0].text).toBe("Option A");
  });

  it("should trigger onChange when changing selection", () => {
    const handleChange = vi.fn();
    render(
      <Select onChange={handleChange} data-testid="select">
        <option value="A">A</option>
        <option value="B">B</option>
      </Select>,
    );

    const select = screen.getByTestId("select") as HTMLSelectElement;
    fireEvent.change(select, { target: { value: "B" } });

    expect(handleChange).toHaveBeenCalled();
    expect(select.value).toBe("B");
  });
});
