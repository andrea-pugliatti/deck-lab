import { MemoryRouter } from "react-router";
import { describe, expect, it, vi } from "vitest";

import { cardKeys, deckKeys } from "../../../services/queryKeys";
import { createTestQueryClient, renderWithClient, screen } from "../../../test/setup";
import Home from "./Home";

vi.mock("../../../features/cards", async (importOriginal) => {
  const actual = await importOriginal<typeof import("../../../features/cards")>();
  return {
    ...actual,
    getCards: vi.fn().mockImplementation(() => new Promise(() => {})),
  };
});

vi.mock("../../../features/decks", async (importOriginal) => {
  const actual = await importOriginal<typeof import("../../../features/decks")>();
  return {
    ...actual,
    getDecks: vi.fn().mockImplementation(() => new Promise(() => {})),
  };
});

vi.mock("../../../components/navigation/SearchBar", () => ({
  default: () => <div data-testid="searchbar">SearchBar</div>,
}));

vi.mock("../../../features/home/components/HeroCardShowcase", () => ({
  default: () => <div data-testid="showcase">HeroCardShowcase</div>,
}));

vi.mock("../../../features/decks/components/DeckGridCard", () => ({
  default: ({ name }: { name: string }) => <div data-testid="deck-grid-card">{name}</div>,
}));

vi.mock("../../../features/decks/components/DeckListCard", () => ({
  default: ({ name }: { name: string }) => <div data-testid="deck-list-card">{name}</div>,
}));

vi.mock("../../../features/cards/components/CardGridItem", () => ({
  default: ({ name }: { name: string }) => <div data-testid="card-grid-item">{name}</div>,
}));

vi.mock("../../../features/cards/components/CardListItem", () => ({
  default: ({ name }: { name: string }) => <div data-testid="card-list-item">{name}</div>,
}));

describe("Home page component", () => {
  it("should render hero headings, searchbar, and showcase", () => {
    const queryClient = createTestQueryClient();

    renderWithClient(
      <MemoryRouter>
        <Home />
      </MemoryRouter>,
      queryClient,
    );

    expect(screen.getByText("Step Into Your")).toBeInTheDocument();
    expect(screen.getByText("DeckLab")).toBeInTheDocument();
    expect(screen.getByTestId("searchbar")).toBeInTheDocument();
    expect(screen.getByTestId("showcase")).toBeInTheDocument();
  });

  it("should render trending decks when successfully fetched", () => {
    const queryClient = createTestQueryClient();
    queryClient.setQueryData(deckKeys.list({ size: "6" }), {
      content: [{ id: 1, name: "Spellcaster Power", deckCards: [], updatedAt: "" }],
    });
    queryClient.setQueryData(cardKeys.list({ size: "6" }), {
      content: [],
    });
    queryClient.setQueryData(cardKeys.list({ type: "Effect Monster", size: "3" }), {
      content: [],
    });

    renderWithClient(
      <MemoryRouter>
        <Home />
      </MemoryRouter>,
      queryClient,
    );

    expect(screen.getByTestId("deck-grid-card")).toHaveTextContent("Spellcaster Power");
  });
});
