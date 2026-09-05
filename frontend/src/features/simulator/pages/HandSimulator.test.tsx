import { fireEvent } from "@testing-library/react";
import { MemoryRouter, useSearchParams } from "react-router";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { deckKeys } from "../../../services/queryKeys";
import { createTestQueryClient, renderWithClient, screen } from "../../../test/setup";
import HandSimulator from "./HandSimulator";

vi.mock("react-router", async (importOriginal) => {
  const actual = await importOriginal<typeof import("react-router")>();
  return {
    ...actual,
    useSearchParams: vi.fn(),
  };
});

vi.mock("../../../features/simulator/components/DeckSelector", () => ({
  default: ({ onSelect }: { onSelect: (id: number) => void }) => (
    <button data-testid="deck-selector" onClick={() => onSelect(99)}>
      DeckSelector
    </button>
  ),
}));

vi.mock("../../../features/simulator/components/SimulatorWorkspace", () => ({
  default: () => <div data-testid="simulator-workspace">SimulatorWorkspace</div>,
}));

describe("HandSimulator page component", () => {
  const setSearchParamsMock = vi.fn();
  let queryClient = createTestQueryClient();

  beforeEach(() => {
    setSearchParamsMock.mockReset();
    vi.mocked(useSearchParams).mockReturnValue([new URLSearchParams(), setSearchParamsMock]);
    queryClient = createTestQueryClient();
  });

  it("should render DeckSelector when no deckId query parameter exists", () => {
    renderWithClient(
      <MemoryRouter>
        <HandSimulator />
      </MemoryRouter>,
      queryClient,
    );

    expect(screen.getByTestId("deck-selector")).toBeInTheDocument();
  });

  it("should update searchParams when a deck is selected from DeckSelector", () => {
    renderWithClient(
      <MemoryRouter>
        <HandSimulator />
      </MemoryRouter>,
      queryClient,
    );

    const selectorBtn = screen.getByTestId("deck-selector");
    fireEvent.click(selectorBtn);

    expect(setSearchParamsMock).toHaveBeenCalled();
    const updater = setSearchParamsMock.mock.calls[0]![0];
    const initialParams = new URLSearchParams();
    const updated = typeof updater === "function" ? updater(initialParams) : updater;
    expect(updated.get("deckId")).toBe("99");
  });

  it("should render SimulatorWorkspace and details link when a deckId parameter is present", () => {
    const params = new URLSearchParams({ deckId: "44" });
    vi.mocked(useSearchParams).mockReturnValue([params, setSearchParamsMock]);

    queryClient.setQueryData(deckKeys.detail("44"), {
      id: 44,
      name: "Test Deck",
      creatorUsername: "admin",
      deckCards: [],
      updatedAt: "",
    });

    renderWithClient(
      <MemoryRouter>
        <HandSimulator />
      </MemoryRouter>,
      queryClient,
    );

    expect(screen.getByTestId("simulator-workspace")).toBeInTheDocument();
    expect(screen.getByText("SIMULATING: Test Deck")).toBeInTheDocument();

    const detailLink = screen.getByRole("link", { name: /Back to Deck Detail/i });
    expect(detailLink).toHaveAttribute("href", "/decks/44");
  });

  it("should render semantic Link to /simulator to select another deck", () => {
    const params = new URLSearchParams({ deckId: "44" });
    vi.mocked(useSearchParams).mockReturnValue([params, setSearchParamsMock]);

    queryClient.setQueryData(deckKeys.detail("44"), {
      id: 44,
      name: "Test Deck",
      creatorUsername: "admin",
      deckCards: [],
      updatedAt: "",
    });

    renderWithClient(
      <MemoryRouter>
        <HandSimulator />
      </MemoryRouter>,
      queryClient,
    );

    const changeDeckLink = screen.getByRole("link", { name: /Select Another Deck/i });
    expect(changeDeckLink).toBeInTheDocument();
    expect(changeDeckLink).toHaveAttribute("href", "/simulator");
  });
});
