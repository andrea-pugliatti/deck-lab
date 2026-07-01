import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { useAuth } from "../context/AuthContext";
import { useDeckSearch } from "../hooks/useDeckSearch";
import { deleteDeck } from "../services/deck";
import Decks from "./Decks";

vi.mock("../hooks/useDeckSearch", () => ({
  useDeckSearch: vi.fn(),
}));

vi.mock("../context/AuthContext", () => ({
  useAuth: vi.fn(),
}));

vi.mock("../services/deck", async (importOriginal) => {
  const actual = await importOriginal<typeof import("../services/deck")>();
  return {
    ...actual,
    deleteDeck: vi.fn(),
    getFormatsEndpoint: vi.fn().mockReturnValue("/api/formats"),
  };
});

vi.mock("../hooks/useFetch", () => ({
  useFetch: vi.fn().mockReturnValue({ data: ["TCG", "Goat"] }),
}));

describe("Decks page component", () => {
  const mockRefetch = vi.fn();

  beforeEach(() => {
    mockRefetch.mockReset();
    vi.mocked(deleteDeck).mockReset();
    vi.mocked(useAuth).mockReturnValue({
      isAuthenticated: true,
      user: { username: "yugi" },
    } as any);

    vi.mocked(useDeckSearch).mockReturnValue({
      page: 0,
      setPage: vi.fn(),
      searchQuery: "",
      setSearchQuery: vi.fn(),
      format: "ALL",
      setFormat: vi.fn(),
      decks: [{ id: 4, name: "Dark Magician Deck", formatName: "TCG", creatorUsername: "yugi" }],
      loading: false,
      totalPages: 1,
      totalElements: 1,
      refetch: mockRefetch,
    } as any);
  });

  it("should render page headers, search filter input, and public decks", () => {
    render(
      <MemoryRouter>
        <Decks initialTab="all" />
      </MemoryRouter>,
    );

    expect(screen.getByText("Public Decks")).toBeInTheDocument();
    expect(screen.getByText("Dark Magician Deck")).toBeInTheDocument();
  });

  it("should render user blueprints headers when initialTab is user", () => {
    render(
      <MemoryRouter>
        <Decks initialTab="user" />
      </MemoryRouter>,
    );

    expect(screen.getByText("My Deck Blueprints")).toBeInTheDocument();
  });
});
