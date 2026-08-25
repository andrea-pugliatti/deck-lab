import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { useCardMetadata } from "../../../features/cards/hooks/useCardMetadata";
import { useCatalogSearch } from "../../../features/cards/hooks/useCatalogSearch";
import Cards from "./Cards";

vi.mock("../../../features/cards/hooks/useCatalogSearch", () => ({
  useCatalogSearch: vi.fn(),
}));

vi.mock("../../../features/cards/hooks/useCardMetadata", () => ({
  useCardMetadata: vi.fn(),
}));

vi.mock("../../../features/cards/components/CardFilters", () => ({
  default: () => <div data-testid="card-filters">CardFilters</div>,
}));

vi.mock("../../../features/cards/components/CardGridItem", () => ({
  default: ({ name }: { name: string }) => <div data-testid="card-grid-item">{name}</div>,
}));

vi.mock("../../../features/cards/components/CardListItem", () => ({
  default: ({ name }: { name: string }) => <div data-testid="card-list-item">{name}</div>,
}));

describe("Cards page component", () => {
  beforeEach(() => {
    vi.mocked(useCardMetadata).mockReturnValue({
      types: ["Monster", "Spell"],
      attributes: ["LIGHT"],
      races: [],
      archetypes: [],
    });

    vi.mocked(useCatalogSearch).mockReturnValue({
      searchPage: 0,
      setSearchPage: vi.fn(),
      searchQuery: "",
      setSearchQuery: vi.fn(),
      filters: { type: "ALL", attribute: "ALL", race: "ALL", archetype: "ALL" },
      setFilters: vi.fn(),
      libraryCards: [{ id: 1, name: "Blue-Eyes White Dragon" }],
      libraryLoading: false,
      totalSearchPages: 1,
      totalElements: 1,
      error: undefined,
      refetch: vi.fn(),
    } as unknown as ReturnType<typeof useCatalogSearch>);
  });

  it("should render page header, filters sidebar, search input, and card results", () => {
    render(
      <MemoryRouter>
        <Cards />
      </MemoryRouter>,
    );

    expect(screen.getByText("Card Database")).toBeInTheDocument();
    expect(screen.getByTestId("card-filters")).toBeInTheDocument();
    expect(screen.getByTestId("card-grid-item")).toHaveTextContent("Blue-Eyes White Dragon");
  });
});
