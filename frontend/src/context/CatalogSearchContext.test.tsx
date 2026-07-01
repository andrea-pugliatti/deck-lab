import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { useCardMetadata } from "../hooks/useCardMetadata";
import { useCatalogSearch } from "../hooks/useCatalogSearch";
import { useFetch } from "../hooks/useFetch";
import { CatalogSearchProvider, useCatalogSearchContext } from "./CatalogSearchContext";

vi.mock("../hooks/useCatalogSearch", () => ({
  useCatalogSearch: vi.fn(),
}));

vi.mock("../hooks/useCardMetadata", () => ({
  useCardMetadata: vi.fn(),
}));

vi.mock("../hooks/useFetch", () => ({
  useFetch: vi.fn(),
}));

function ContextConsumer() {
  const context = useCatalogSearchContext();
  return (
    <div>
      <span data-testid="formats">{context.formats.join(",")}</span>
      <span data-testid="types">{context.types.join(",")}</span>
      <span data-testid="search-query">{context.searchQuery}</span>
    </div>
  );
}

describe("CatalogSearchContext", () => {
  it("should provide catalog search state and metadata to children", () => {
    vi.mocked(useCatalogSearch).mockReturnValue({
      searchPage: 0,
      setSearchPage: vi.fn(),
      searchQuery: "Exodia",
      setSearchQuery: vi.fn(),
      filters: { type: "ALL", attribute: "ALL", race: "ALL", archetype: "ALL" },
      setFilters: vi.fn(),
      debouncedQuery: "Exodia",
      libraryCards: [],
      libraryLoading: false,
      totalSearchPages: 1,
      totalElements: 1,
    } as any);

    vi.mocked(useCardMetadata).mockReturnValue({
      types: ["Monster", "Spell"],
      attributes: ["DARK"],
      races: [],
      archetypes: [],
    });

    vi.mocked(useFetch).mockReturnValue({
      data: ["TCG", "Goat"],
    } as any);

    render(
      <CatalogSearchProvider>
        <ContextConsumer />
      </CatalogSearchProvider>,
    );

    expect(screen.getByTestId("formats")).toHaveTextContent("TCG,Goat");
    expect(screen.getByTestId("types")).toHaveTextContent("Monster,Spell");
    expect(screen.getByTestId("search-query")).toHaveTextContent("Exodia");
  });

  it("should throw error if useCatalogSearchContext is used outside CatalogSearchProvider", () => {
    const errorSpy = vi.spyOn(console, "error").mockImplementation(() => {});
    expect(() => render(<ContextConsumer />)).toThrow(
      "useCatalogSearch must be used within a CatalogSearchProvider",
    );
    errorSpy.mockRestore();
  });
});
