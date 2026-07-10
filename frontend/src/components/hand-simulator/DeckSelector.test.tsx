import { useQuery } from "@tanstack/react-query";
import { fireEvent, render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { useAuth } from "../../context/AuthContext";
import { useDeckSearch } from "../../hooks/useDeckSearch";
import DeckSelector from "./DeckSelector";

vi.mock("../../context/AuthContext", () => ({
  useAuth: vi.fn(),
}));

vi.mock("@tanstack/react-query", () => ({
  useQuery: vi.fn(),
}));

vi.mock("../../hooks/useDeckSearch", () => ({
  useDeckSearch: vi.fn(),
}));

describe("DeckSelector component", () => {
  const mockOnSelect = vi.fn();
  const mockSetSearchQuery = vi.fn();
  const mockSetFormat = vi.fn();
  const mockSetPage = vi.fn();
  const mockRefetch = vi.fn();

  const mockDecks = [
    {
      id: 1,
      name: "Dark Magician Deck",
      description: "Yugi's signature deck",
      formatName: "TCG",
      deckCards: [{ cardId: 101, name: "Dark Magician", quantity: 3, section: "MAIN" }],
      updatedAt: "2026-06-30T12:00:00Z",
      creatorUsername: "yugi_mutou",
    },
    {
      id: 2,
      name: "Blue-Eyes Deck",
      description: "Kaiba's power deck",
      formatName: "TCG",
      deckCards: [{ cardId: 102, name: "Blue-Eyes White Dragon", quantity: 3, section: "MAIN" }],
      updatedAt: "2026-06-30T12:00:00Z",
      creatorUsername: "seto_kaiba",
    },
  ];

  beforeEach(() => {
    mockOnSelect.mockReset();
    mockSetSearchQuery.mockReset();
    mockSetFormat.mockReset();
    mockSetPage.mockReset();
    mockRefetch.mockReset();

    vi.mocked(useAuth).mockReturnValue({
      isAuthenticated: true,
      user: { username: "yugi_mutou", email: "yugi@games.com" },
      logout: vi.fn(),
      login: vi.fn(),
      register: vi.fn(),
      loading: false,
    });

    vi.mocked(useQuery).mockReturnValue({
      data: ["TCG", "OCG", "Goat"],
      isLoading: false,
      error: null,
      refetch: vi.fn(),
    } as any);

    vi.mocked(useDeckSearch).mockReturnValue({
      page: 0,
      setPage: mockSetPage,
      searchQuery: "",
      setSearchQuery: mockSetSearchQuery,
      format: "ALL",
      setFormat: mockSetFormat,
      decks: mockDecks,
      loading: false,
      error: null,
      totalPages: 1,
      totalElements: 2,
      refetch: mockRefetch,
    } as any);
  });

  it("should render tabs, search input, and format dropdown", () => {
    render(
      <MemoryRouter>
        <DeckSelector onSelect={mockOnSelect} />
      </MemoryRouter>,
    );

    expect(screen.getByText("My Decks")).toBeInTheDocument();
    expect(screen.getByText("Community Decks")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Search decks...")).toBeInTheDocument();
    expect(screen.getByRole("combobox")).toBeInTheDocument();
    expect(screen.getByText("Dark Magician Deck")).toBeInTheDocument();
    expect(screen.getByText("Blue-Eyes Deck")).toBeInTheDocument();
  });

  it("should handle tab switching when clicked", () => {
    render(
      <MemoryRouter>
        <DeckSelector onSelect={mockOnSelect} />
      </MemoryRouter>,
    );

    // Initial active tab should be 'community'
    const communityTabBtn = screen.getByRole("button", { name: /Community Decks/ });
    expect(communityTabBtn).toHaveClass("text-gold-accent");

    // Click My Decks
    const myDecksTabBtn = screen.getByRole("button", { name: /My Decks/ });
    fireEvent.click(myDecksTabBtn);

    expect(myDecksTabBtn).toHaveClass("text-gold-accent");
    expect(communityTabBtn).not.toHaveClass("text-gold-accent");
  });

  it("should call onSelect when select button is clicked on a deck card", () => {
    render(
      <MemoryRouter>
        <DeckSelector onSelect={mockOnSelect} />
      </MemoryRouter>,
    );

    const selectBtns = screen.getAllByRole("button", { name: "Select" });
    fireEvent.click(selectBtns[0]); // Select first deck

    expect(mockOnSelect).toHaveBeenCalledWith(1);
  });

  it("should call setSearchQuery when typing in the search input", () => {
    render(
      <MemoryRouter>
        <DeckSelector onSelect={mockOnSelect} />
      </MemoryRouter>,
    );

    const searchInput = screen.getByPlaceholderText("Search decks...");
    fireEvent.change(searchInput, { target: { value: "Exodia" } });

    expect(mockSetSearchQuery).toHaveBeenCalledWith("Exodia");
  });

  it("should call setFormat when changing the format select", () => {
    render(
      <MemoryRouter>
        <DeckSelector onSelect={mockOnSelect} />
      </MemoryRouter>,
    );

    const selectDropdown = screen.getByRole("combobox");
    fireEvent.change(selectDropdown, { target: { value: "Goat" } });

    expect(mockSetFormat).toHaveBeenCalledWith("Goat");
  });

  it("should trigger onSelect with a random deck when Random Deck is clicked", () => {
    render(
      <MemoryRouter>
        <DeckSelector onSelect={mockOnSelect} />
      </MemoryRouter>,
    );

    const randomBtn = screen.getByRole("button", { name: /Random Deck/ });
    fireEvent.click(randomBtn);

    expect(mockOnSelect).toHaveBeenCalled();
    const selectedId = mockOnSelect.mock.calls[0][0];
    expect([1, 2]).toContain(selectedId);
  });

  it("should show LoadingSpinner when hook isLoading is true", () => {
    vi.mocked(useDeckSearch).mockReturnValue({
      page: 0,
      setPage: mockSetPage,
      searchQuery: "",
      setSearchQuery: mockSetSearchQuery,
      format: "ALL",
      setFormat: mockSetFormat,
      decks: [],
      loading: true,
      error: null,
      totalPages: 1,
      totalElements: 0,
      refetch: mockRefetch,
    } as any);

    const { container } = render(
      <MemoryRouter>
        <DeckSelector onSelect={mockOnSelect} />
      </MemoryRouter>,
    );

    expect(container.querySelector(".animate-spin")).toBeInTheDocument();
  });

  it("should show ErrorAlert when hook error is present", () => {
    vi.mocked(useDeckSearch).mockReturnValue({
      page: 0,
      setPage: mockSetPage,
      searchQuery: "",
      setSearchQuery: mockSetSearchQuery,
      format: "ALL",
      setFormat: mockSetFormat,
      decks: [],
      loading: false,
      error: new Error("Network error"),
      totalPages: 1,
      totalElements: 0,
      refetch: mockRefetch,
    } as any);

    render(
      <MemoryRouter>
        <DeckSelector onSelect={mockOnSelect} />
      </MemoryRouter>,
    );

    expect(screen.getByText("Failed to load decks")).toBeInTheDocument();
    expect(screen.getByText("Network error")).toBeInTheDocument();

    // Click retry
    const retryBtn = screen.getByRole("button", { name: "Retry" });
    fireEvent.click(retryBtn);
    expect(mockRefetch).toHaveBeenCalled();
  });

  it("should show EmptyState when filtered decks is empty", () => {
    vi.mocked(useDeckSearch).mockReturnValue({
      page: 0,
      setPage: mockSetPage,
      searchQuery: "",
      setSearchQuery: mockSetSearchQuery,
      format: "ALL",
      setFormat: mockSetFormat,
      decks: [],
      loading: false,
      error: null,
      totalPages: 0,
      totalElements: 0,
      refetch: mockRefetch,
    } as any);

    render(
      <MemoryRouter>
        <DeckSelector onSelect={mockOnSelect} />
      </MemoryRouter>,
    );

    expect(screen.getByText("No decks found")).toBeInTheDocument();
  });
});
