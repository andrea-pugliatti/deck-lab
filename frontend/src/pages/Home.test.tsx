import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { useFetch } from "../hooks/useFetch";
import Home from "./Home";

vi.mock("../hooks/useFetch", () => ({
  useFetch: vi.fn(),
}));

vi.mock("../components/SearchBar", () => ({
  default: () => <div data-testid="searchbar">SearchBar</div>,
}));

vi.mock("../components/HeroCardShowcase", () => ({
  default: () => <div data-testid="showcase">HeroCardShowcase</div>,
}));

vi.mock("../components/deck/DeckCard", () => ({
  default: ({ name }: { name: string }) => <div data-testid="deck-card">{name}</div>,
}));

vi.mock("../components/card/CardGridItem", () => ({
  default: ({ card }: { card: any }) => <div data-testid="card-grid-item">{card.name}</div>,
}));

describe("Home page component", () => {
  beforeEach(() => {
    vi.mocked(useFetch).mockReset();
  });

  it("should render hero headings, searchbar, and showcase", () => {
    vi.mocked(useFetch).mockReturnValue({
      data: undefined,
      loading: true,
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
    vi.mocked(useFetch).mockImplementation((url?: string) => {
      if (url?.includes("decks")) {
        return {
          data: {
            content: [{ id: 1, name: "Spellcaster Power", deckCards: [], updatedAt: "" }],
          },
          loading: false,
        } as any;
      }
      return {
        data: { content: [] },
        loading: false,
      } as any;
    });

    render(
      <MemoryRouter>
        <Home />
      </MemoryRouter>,
    );

    expect(screen.getByTestId("deck-card")).toHaveTextContent("Spellcaster Power");
  });
});
