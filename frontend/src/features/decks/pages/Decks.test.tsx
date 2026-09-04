import { MemoryRouter } from "react-router";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { useAuth } from "../../../features/auth";
import { deleteDeck } from "../../../features/decks";
import { useDeckSearch } from "../../../features/decks/hooks/useDeckSearch";
import { formatKeys } from "../../../services/queryKeys";
import { createTestQueryClient, renderWithClient, screen } from "../../../test/setup";
import Decks from "./Decks";

vi.mock("../../../features/decks/hooks/useDeckSearch", () => ({
  useDeckSearch: vi.fn(),
}));

vi.mock("../../../features/auth", () => ({
  useAuth: vi.fn(),
}));

vi.mock("../../../features/decks", async (importOriginal) => {
  const actual = await importOriginal<typeof import("../api/deck")>();
  return {
    ...actual,
    deleteDeck: vi.fn(),
  };
});

vi.mock("../hooks/useFetch", () => ({
  useFetch: vi.fn().mockReturnValue({ data: ["TCG", "Goat"] }),
}));

describe("Decks page component", () => {
  const mockRefetch = vi.fn();
  let queryClient = createTestQueryClient();

  beforeEach(() => {
    mockRefetch.mockReset();
    vi.mocked(deleteDeck).mockReset();
    queryClient = createTestQueryClient();
    queryClient.setQueryData(formatKeys.all, ["TCG", "Goat"]);
    vi.mocked(useAuth).mockReturnValue({
      isAuthenticated: true,
      user: { username: "yugi" },
    } as unknown as ReturnType<typeof useAuth>);

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
    } as unknown as ReturnType<typeof useDeckSearch>);
  });

  it("should render page headers, search filter input, and public decks", () => {
    renderWithClient(
      <MemoryRouter>
        <Decks initialTab="all" />
      </MemoryRouter>,
      queryClient,
    );

    expect(screen.getByText("Public Decks")).toBeInTheDocument();
    expect(screen.getByText("Dark Magician Deck")).toBeInTheDocument();
  });

  it("should render user blueprints headers when initialTab is user", () => {
    renderWithClient(
      <MemoryRouter>
        <Decks initialTab="user" />
      </MemoryRouter>,
      queryClient,
    );

    expect(screen.getByText("My Deck Blueprints")).toBeInTheDocument();
  });
});
