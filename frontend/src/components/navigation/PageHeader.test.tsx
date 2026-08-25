import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import PageHeader from "./PageHeader";

describe("PageHeader component", () => {
  it("should render title and description", () => {
    render(<PageHeader title="My Decks" description="Manage your decks here" />);

    expect(screen.getByRole("heading", { name: "My Decks" })).toBeInTheDocument();
    expect(screen.getByText("Manage your decks here")).toBeInTheDocument();
  });

  it("should render child elements/actions when provided", () => {
    render(
      <PageHeader title="Title" description="Desc">
        <button data-testid="action-btn">Add New</button>
      </PageHeader>,
    );

    expect(screen.getByTestId("action-btn")).toBeInTheDocument();
  });
});
