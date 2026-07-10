import { useQuery } from "@tanstack/react-query";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router";
import { beforeEach, describe, expect, it, vi } from "vitest";

import Home from "./Home";

vi.mock("../components/SearchBar", () => ({
  default: () => <div data-testid="searchbar">SearchBar</div>,
}));

vi.mock("../components/HeroCardShowcase", () => ({
  default: () => <div data-testid="showcase">HeroCardShowcase</div>,
}));

vi.mock("../components/deck/DeckGridCard", () => ({
  default: ({ name }: { name: string }) => <div data-testid="deck-grid-card">{name}</div>,
}));

vi.mock("../components/deck/DeckListCard", () => ({
  default: ({ name }: { name: string }) => <div data-testid="deck-list-card">{name}</div>,
}));

vi.mock("../components/card/CardGridItem", () => ({
  default: ({ name }: { name: string }) => <div data-testid="card-grid-item">{name}</div>,
}));

vi.mock("../components/card/CardListItem", () => ({
  default: ({ name }: { name: string }) => <div data-testid="card-list-item">{name}</div>,
}));

describe("Home page component", () => {
  beforeEach(() => {
    vi.mocked(useQuery).mockReset();
  });

  it("should render hero headings, searchbar, and showcase", () => {
    vi.mocked(useQuery).mockReturnValue({
      data: undefined,
      isLoading: true,
      error: undefined,
    } as any);

    render(
      <MemoryRouter>
        <Home />
      </MemoryRouter>,
    );

    expect(screen.getByText("Step Into Your")).toBeInTheDocument();
    expect(screen.getByText("Deck Lab")).toBeInTheDocument();
    expect(screen.getByTestId("searchbar")).toBeInTheDocument();
    expect(screen.getByTestId("showcase")).toBeInTheDocument();
  });

  it("should render trending decks when successfully fetched", () => {
    // Mock return values:
    // Call 1: Decks fetch
    // Call 2: Cards spotlight fetch
    // Call 3: Hero cards showcase fetch
    vi.mocked(useQuery).mockImplementation(() => {
      // Return value can be based on queryKey if needed, but since it returns mock values:
      return {
        data: {
          content: [{ id: 1, name: "Spellcaster Power", deckCards: [], updatedAt: "" }],
        },
        isLoading: false,
      } as any;
    });

    render(
      <MemoryRouter>
        <Home />
      </MemoryRouter>,
    );

    expect(screen.getByTestId("deck-grid-card")).toHaveTextContent("Spellcaster Power");
  });
});
