import { screen } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router";
import { describe, expect, it, vi } from "vitest";

import { apiFetch } from "../../../services/api";
import { renderWithClient } from "../../../test/setup";
import DeckBuilder from "./DeckBuilder";

vi.mock("../../../services/api", async (importOriginal) => {
  const actual = await importOriginal<typeof import("../../../services/api")>();
  return {
    ...actual,
    apiFetch: vi.fn(),
  };
});

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
  it("should render page layout and builder blocks in creation mode", () => {
    vi.mocked(apiFetch).mockImplementation(
      async () =>
        ({
          ok: true,
          json: async () => [],
        }) as Response,
    );

    renderWithClient(
      <MemoryRouter>
        <DeckBuilder />
      </MemoryRouter>,
    );

    expect(screen.getByTestId("builder-filters")).toBeInTheDocument();
    expect(screen.getByTestId("card-list")).toBeInTheDocument();
    expect(screen.getAllByTestId("sections")[0]).toBeInTheDocument();

    const backLink = screen.getByRole("link", { name: /Back to Decks/i });
    expect(backLink).toBeInTheDocument();
    expect(backLink).toHaveAttribute("href", "/my-decks");
  });

  it("should render loading spinner when edit mode is loading", () => {
    vi.mocked(apiFetch).mockImplementation(() => new Promise(() => {}));

    const { container } = renderWithClient(
      <MemoryRouter initialEntries={["/deck-builder/42"]}>
        <Routes>
          <Route path="/deck-builder/:id" element={<DeckBuilder />} />
        </Routes>
      </MemoryRouter>,
    );

    expect(container.querySelector(".animate-spin")).toBeInTheDocument();
  });

  it("should render error alert when edit mode query fails", async () => {
    vi.mocked(apiFetch).mockResolvedValueOnce({
      ok: false,
      status: 404,
      json: async () => ({ message: "Deck not found" }),
      headers: new Headers({ "content-type": "application/json" }),
    } as Response);

    renderWithClient(
      <MemoryRouter initialEntries={["/deck-builder/999"]}>
        <Routes>
          <Route path="/deck-builder/:id" element={<DeckBuilder />} />
        </Routes>
      </MemoryRouter>,
    );

    expect(await screen.findByText("Failed to load deck for editing")).toBeInTheDocument();
    expect(screen.getByText("Deck not found")).toBeInTheDocument();
  });
});
