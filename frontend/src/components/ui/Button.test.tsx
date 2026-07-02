import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import Button from "./Button";

describe("Button component", () => {
  it("should render its children correctly", () => {
    render(<Button>Click me</Button>);
    expect(screen.getByRole("button", { name: "Click me" })).toBeInTheDocument();
  });

  it("should support loading state", () => {
    render(<Button isLoading>Click me</Button>);
    const button = screen.getByRole("button");
    expect(button).toBeDisabled();
    expect(button).toHaveTextContent("Loading...");
  });

  it("should support disabled state", () => {
    render(<Button disabled>Click me</Button>);
    const button = screen.getByRole("button", { name: "Click me" });
    expect(button).toBeDisabled();
  });

  it("should handle onClick events", () => {
    const handleClick = vi.fn();
    render(<Button onClick={handleClick}>Click me</Button>);

    fireEvent.click(screen.getByRole("button", { name: "Click me" }));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it("should not handle onClick events when disabled", () => {
    const handleClick = vi.fn();
    render(
      <Button onClick={handleClick} disabled>
        Click me
      </Button>,
    );

    fireEvent.click(screen.getByRole("button", { name: "Click me" }));
    expect(handleClick).not.toHaveBeenCalled();
  });

  it("should support various variants and sizes styling classes", () => {
    const { rerender } = render(
      <Button variant="ghost" size="sm">
        Ghost
      </Button>,
    );
    let button = screen.getByRole("button");
    expect(button.className).toContain("text-slate-400");
    expect(button.className).toContain("px-4 py-2");

    rerender(
      <Button variant="outline-red" size="lg">
        Red Outline
      </Button>,
    );
    button = screen.getByRole("button");
    expect(button.className).toContain("text-slate-400");
    expect(button.className).toContain("px-8 py-3");
  });
});
