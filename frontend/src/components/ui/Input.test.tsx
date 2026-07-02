import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import Input from "./Input";

describe("Input component", () => {
  it("should render plain input correctly", () => {
    render(<Input placeholder="Enter username" data-testid="input" />);
    const input = screen.getByTestId("input");
    expect(input).toBeInTheDocument();
    expect(input.tagName).toBe("INPUT");
  });

  it("should render with icon container when icon is provided", () => {
    const mockIcon = <span data-testid="mock-icon">🔍</span>;
    render(<Input placeholder="Search" icon={mockIcon} data-testid="input" />);

    expect(screen.getByTestId("mock-icon")).toBeInTheDocument();
    expect(screen.getByTestId("input")).toBeInTheDocument();
  });

  it("should handle user typing and trigger onChange", () => {
    const handleChange = vi.fn();
    render(<Input onChange={handleChange} data-testid="input" />);

    const input = screen.getByTestId("input") as HTMLInputElement;
    fireEvent.change(input, { target: { value: "Blue-Eyes" } });

    expect(handleChange).toHaveBeenCalled();
    expect(input.value).toBe("Blue-Eyes");
  });

  it("should disable the input if disabled is true", () => {
    render(<Input disabled placeholder="Disabled input" data-testid="input" />);
    const input = screen.getByTestId("input");
    expect(input).toBeDisabled();
  });
});
