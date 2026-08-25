import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router";
import { describe, expect, it, vi } from "vitest";

import DeckBuilder from "./DeckBuilder";

vi.mock("../services/api", () => ({
  apiFetch: vi.fn().mockImplementation(async (_url: string) => {
    return {
      ok: true,
      json: async () => [],
    } as Response;
  }),
}));

vi.mock("../components/deck-builder/DeckBuilderFilters", () => ({
  default: () => <div data-testid="builder-filters">BuilderFilters</div>,
}));

vi.mock("../components/deck-builder/DeckBuilderCardList", () => ({
  default: () => <div data-testid="card-list">CardList</div>,
}));

vi.mock("../components/deck-builder/DeckSectionList", () => ({
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
  });
});
