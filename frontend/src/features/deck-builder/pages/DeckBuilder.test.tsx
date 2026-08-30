import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router";
import { describe, expect, it, vi } from "vitest";

import DeckBuilder from "./DeckBuilder";

vi.mock("../../../services/api", () => ({
  apiFetch: vi.fn().mockImplementation(async (_url: string) => {
    return {
      ok: true,
      json: async () => [],
    } as Response;
  }),
}));

vi.mock("../../../features/deck-builder/components/DeckBuilderFilters", () => ({
  default: () => <div data-testid="builder-filters">BuilderFilters</div>,
}));

vi.mock("../../../features/deck-builder/components/DeckBuilderCardList", () => ({
  default: () => <div data-testid="card-list">CardList</div>,
}));

vi.mock("../../../features/deck-builder/components/DeckSectionList", () => ({
  default: () => <div data-testid="sections">Sections</div>,
}));

describe("DeckBuilder page component", () => {
  it("should render page layout and builder blocks", () => {
    render(
      <MemoryRouter>
        <DeckBuilder />
      </MemoryRouter>,
    );

    // Confirm core component grids/elements are present
    expect(screen.getByTestId("builder-filters")).toBeInTheDocument();
    expect(screen.getByTestId("card-list")).toBeInTheDocument();
    expect(screen.getAllByTestId("sections")[0]).toBeInTheDocument();

    const backLink = screen.getByRole("link", { name: /Back to Decks/i });
    expect(backLink).toBeInTheDocument();
    expect(backLink).toHaveAttribute("href", "/my-decks");
  });
});
