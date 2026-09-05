import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router";
import { describe, expect, it } from "vitest";

import InvalidIdState from "./InvalidIdState";

describe("InvalidIdState component", () => {
  it("should render default title, message, and back link for given resource", () => {
    render(
      <MemoryRouter>
        <InvalidIdState resourceName="Card" backTo="/cards" backLabel="Back to Catalog" />
      </MemoryRouter>,
    );

    expect(screen.getByText("Invalid Card ID")).toBeInTheDocument();
    expect(
      screen.getByText("The requested card ID must be a valid numeric identifier."),
    ).toBeInTheDocument();

    const link = screen.getByRole("link", { name: /Back to Catalog/i });
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute("href", "/cards");
  });

  it("should render custom title and message when provided", () => {
    render(
      <MemoryRouter>
        <InvalidIdState
          resourceName="Deck"
          backTo="/decks"
          backLabel="Back to Decks"
          title="Custom Deck Error"
          message="Custom error description"
        />
      </MemoryRouter>,
    );

    expect(screen.getByText("Custom Deck Error")).toBeInTheDocument();
    expect(screen.getByText("Custom error description")).toBeInTheDocument();

    const link = screen.getByRole("link", { name: /Back to Decks/i });
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute("href", "/decks");
  });
});
