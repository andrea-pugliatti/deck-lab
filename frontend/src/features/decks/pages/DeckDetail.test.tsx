import { act, fireEvent, waitFor } from "@testing-library/react";
import { MemoryRouter, useNavigate, useParams } from "react-router";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { useAuth } from "../../../features/auth";
import { deckKeys } from "../../../services/queryKeys";
import { createTestQueryClient, renderWithClient, screen } from "../../../test/setup";
import { deleteDeck, getDeck } from "../api/deck";
import DeckDetail from "./DeckDetail";

vi.mock("../api/deck", async (importOriginal) => {
  const actual = await importOriginal<typeof import("../api/deck")>();
  return {
    ...actual,
    deleteDeck: vi.fn(),
    getDeck: vi.fn(),
  };
});

vi.mock("../../../features/auth", async (importOriginal) => {
  const actual = await importOriginal<typeof import("../../../features/auth")>();
  return {
    ...actual,
    useAuth: vi.fn(),
  };
});

vi.mock("react-router", async (importOriginal) => {
  const actual = await importOriginal<typeof import("react-router")>();
  return {
    ...actual,
    useNavigate: vi.fn(),
    useParams: vi.fn(),
  };
});

describe("DeckDetail page component", () => {
  const navigateMock = vi.fn();

  beforeEach(() => {
    navigateMock.mockReset();
    vi.mocked(deleteDeck).mockReset();
    vi.mocked(getDeck).mockReset();
    vi.mocked(getDeck).mockResolvedValue({
      id: 1,
      name: "Yugi Ultimate Deck",
      description: "My deck description",
      creatorUsername: "yugi",
      formatName: "TCG",
      deckCards: [
        {
          cardId: 10,
          name: "Dark Magician",
          quantity: 3,
          section: "MAIN",
          type: "Normal Monster",
        },
        { cardId: 11, name: "Monster Reborn", quantity: 1, section: "MAIN", type: "Spell Card" },
      ],
    });
    vi.mocked(useNavigate).mockReturnValue(navigateMock);
    vi.mocked(useParams).mockReturnValue({ id: "1" });
    vi.mocked(useAuth).mockReturnValue({
      isAuthenticated: true,
      user: { username: "yugi" },
    } as unknown as ReturnType<typeof useAuth>);

    HTMLDialogElement.prototype.showModal = vi.fn(function (this: HTMLDialogElement) {
      this.open = true;
      this.dispatchEvent(new Event("show"));
    });
    HTMLDialogElement.prototype.close = vi.fn(function (this: HTMLDialogElement) {
      this.open = false;
      this.dispatchEvent(new Event("close"));
    });
  });

  it("should render mock deck and compute counts", () => {
    const queryClient = createTestQueryClient();
    queryClient.setQueryData(deckKeys.detail("1"), {
      id: 1,
      name: "Yugi Ultimate Deck",
      creatorUsername: "yugi",
      formatName: "TCG",
      deckCards: [
        {
          cardId: 10,
          name: "Dark Magician",
          quantity: 3,
          section: "MAIN",
          type: "Normal Monster",
        },
        { cardId: 11, name: "Monster Reborn", quantity: 1, section: "MAIN", type: "Spell Card" },
      ],
    });

    renderWithClient(
      <MemoryRouter>
        <DeckDetail />
      </MemoryRouter>,
      queryClient,
    );

    expect(screen.getByText("Yugi Ultimate Deck")).toBeInTheDocument();
    expect(screen.getByText("TCG")).toBeInTheDocument();

    // Stats calculations: 3 monsters + 1 spell = 4 main deck cards
    expect(screen.getAllByText("Main Deck")[0]).toBeInTheDocument();
    expect(screen.getByText("4 / 60")).toBeInTheDocument();

    const backLink = screen.getByRole("link", { name: /Back to Decks/i });
    expect(backLink).toBeInTheDocument();
    expect(backLink).toHaveAttribute("href", "/decks");
  });

  it("should keep confirmation modal open with loading state and navigate on success", async () => {
    let resolveDelete!: () => void;
    vi.mocked(deleteDeck).mockReturnValue(
      new Promise<void>((resolve) => {
        resolveDelete = resolve;
      }),
    );

    const queryClient = createTestQueryClient();
    queryClient.setQueryData(deckKeys.detail("1"), {
      id: 1,
      name: "Yugi Ultimate Deck",
      creatorUsername: "yugi",
      formatName: "TCG",
      deckCards: [],
    });

    renderWithClient(
      <MemoryRouter>
        <DeckDetail />
      </MemoryRouter>,
      queryClient,
    );

    const deleteButton = screen.getByRole("button", { name: /Delete Deck/i });
    fireEvent.click(deleteButton);

    expect(screen.getByText("Delete Deck Blueprint")).toBeInTheDocument();

    const confirmButtons = screen.getAllByRole("button", { name: /Delete Deck/i });
    const modalConfirmButton = confirmButtons[confirmButtons.length - 1];
    fireEvent.click(modalConfirmButton!);

    expect(screen.getByText("Delete Deck Blueprint")).toBeInTheDocument();

    await act(async () => {
      resolveDelete();
    });

    await waitFor(() => {
      expect(navigateMock).toHaveBeenCalledWith("/my-decks");
    });
  });

  it("should display error message inside modal if deletion fails", async () => {
    vi.mocked(deleteDeck).mockRejectedValueOnce(new Error("Unable to delete deck"));

    const queryClient = createTestQueryClient();
    queryClient.setQueryData(deckKeys.detail("1"), {
      id: 1,
      name: "Yugi Ultimate Deck",
      creatorUsername: "yugi",
      formatName: "TCG",
      deckCards: [],
    });

    renderWithClient(
      <MemoryRouter>
        <DeckDetail />
      </MemoryRouter>,
      queryClient,
    );

    const deleteButton = screen.getByRole("button", { name: /Delete Deck/i });
    fireEvent.click(deleteButton);

    expect(screen.getByText("Delete Deck Blueprint")).toBeInTheDocument();

    const confirmButtons = screen.getAllByRole("button", { name: /Delete Deck/i });
    const modalConfirmButton = confirmButtons[confirmButtons.length - 1];
    fireEvent.click(modalConfirmButton!);

    await waitFor(() => {
      expect(deleteDeck).toHaveBeenCalledWith("1");
      expect(screen.getByText("Unable to delete deck")).toBeInTheDocument();
    });
    expect(screen.getByText("Delete Deck Blueprint")).toBeInTheDocument();
    expect(navigateMock).not.toHaveBeenCalled();
  });

  it("should render invalid deck ID error and not call getDeck when id is non-numeric", () => {
    vi.mocked(useParams).mockReturnValue({ id: "invalid-deck-id" });
    const queryClient = createTestQueryClient();

    renderWithClient(
      <MemoryRouter>
        <DeckDetail />
      </MemoryRouter>,
      queryClient,
    );

    expect(screen.getByText("Invalid Deck ID")).toBeInTheDocument();
    expect(
      screen.getByText("The requested deck ID must be a valid numeric identifier."),
    ).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: /Retry/i })).not.toBeInTheDocument();
    expect(getDeck).not.toHaveBeenCalled();

    const backLink = screen.getByRole("link", { name: /Back to Decks/i });
    expect(backLink).toBeInTheDocument();
    expect(backLink).toHaveAttribute("href", "/decks");
  });

  it("should render deck details immediately from list cache via placeholderData", () => {
    vi.mocked(useParams).mockReturnValue({ id: "88" });
    const queryClient = createTestQueryClient();

    queryClient.setQueryData(deckKeys.lists(), {
      content: [
        {
          id: 88,
          name: "Instant Cache Deck",
          description: "Cached deck strategy description",
          formatName: "TCG",
          creatorUsername: "seto_kaiba",
          deckCards: [],
        },
      ],
      page: { totalPages: 1, totalElements: 1, size: 10, number: 0 },
    });

    renderWithClient(
      <MemoryRouter>
        <DeckDetail />
      </MemoryRouter>,
      queryClient,
    );

    expect(screen.getByText("Instant Cache Deck")).toBeInTheDocument();
    expect(screen.getByText("Cached deck strategy description")).toBeInTheDocument();
    expect(screen.getByText("by seto_kaiba")).toBeInTheDocument();
  });
});
