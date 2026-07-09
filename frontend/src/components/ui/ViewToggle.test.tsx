import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import ViewToggle from "./ViewToggle";

describe("ViewToggle component", () => {
  it("should render Grid and List toggle buttons", () => {
    render(<ViewToggle viewMode="grid" onViewModeChange={vi.fn()} />);

    expect(screen.getByTitle("Grid View")).toBeInTheDocument();
    expect(screen.getByTitle("List View")).toBeInTheDocument();
  });

  it("should call onViewModeChange with 'list' when List View is clicked", () => {
    const onViewModeChange = vi.fn();
    render(<ViewToggle viewMode="grid" onViewModeChange={onViewModeChange} />);

    fireEvent.click(screen.getByTitle("List View"));
    expect(onViewModeChange).toHaveBeenCalledWith("list");
  });

  it("should call onViewModeChange with 'grid' when Grid View is clicked", () => {
    const onViewModeChange = vi.fn();
    render(<ViewToggle viewMode="list" onViewModeChange={onViewModeChange} />);

    fireEvent.click(screen.getByTitle("Grid View"));
    expect(onViewModeChange).toHaveBeenCalledWith("grid");
  });
});
