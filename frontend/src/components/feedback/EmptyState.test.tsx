import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import EmptyState from "./EmptyState";

describe("EmptyState component", () => {
  it("should render title and description correctly", () => {
    render(<EmptyState title="No decks found" description="Create a new deck to get started" />);

    expect(screen.getByText("No decks found")).toBeInTheDocument();
    expect(screen.getByText("Create a new deck to get started")).toBeInTheDocument();
  });

  it("should render icon when provided", () => {
    const MockIcon = ({ className }: { className?: string }) => (
      <span data-testid="mock-icon" className={className}>
        Icon
      </span>
    );
    render(<EmptyState title="No results" icon={MockIcon} />);

    expect(screen.getByTestId("mock-icon")).toBeInTheDocument();
  });

  it("should render children elements", () => {
    render(
      <EmptyState title="Empty">
        <button data-testid="action-btn">Action</button>
      </EmptyState>,
    );

    expect(screen.getByTestId("action-btn")).toBeInTheDocument();
  });
});
