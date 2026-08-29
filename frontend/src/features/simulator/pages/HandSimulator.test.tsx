import { useQuery } from "@tanstack/react-query";
import { fireEvent, render, screen } from "@testing-library/react";
import { MemoryRouter, useSearchParams } from "react-router";
import { beforeEach, describe, expect, it, vi } from "vitest";

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

  beforeEach(() => {
    setSearchParamsMock.mockReset();
    vi.mocked(useSearchParams).mockReturnValue([new URLSearchParams(), setSearchParamsMock]);
  });

  it("should render DeckSelector when no deckId query parameter exists", () => {
    vi.mocked(useQuery).mockReturnValue({
      data: undefined,
      isLoading: false,
    } as unknown as ReturnType<typeof useQuery>);

    render(
      <MemoryRouter>
        <HandSimulator />
      </MemoryRouter>,
    );

    expect(screen.getByTestId("deck-selector")).toBeInTheDocument();
  });

  it("should update searchParams when a deck is selected from DeckSelector", () => {
    vi.mocked(useQuery).mockReturnValue({
      data: undefined,
      isLoading: false,
    } as unknown as ReturnType<typeof useQuery>);

    render(
      <MemoryRouter>
        <HandSimulator />
      </MemoryRouter>,
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

    vi.mocked(useQuery).mockReturnValue({
      data: {
        id: 44,
        name: "Test Deck",
        creatorUsername: "admin",
        deckCards: [],
        updatedAt: "",
      },
      isLoading: false,
    } as unknown as ReturnType<typeof useQuery>);

    render(
      <MemoryRouter>
        <HandSimulator />
      </MemoryRouter>,
    );

    expect(screen.getByTestId("simulator-workspace")).toBeInTheDocument();
    expect(screen.getByText("SIMULATING: Test Deck")).toBeInTheDocument();

    const detailLink = screen.getByRole("link", { name: /Back to Deck Detail/i });
    expect(detailLink).toHaveAttribute("href", "/decks/44");
  });

  it("should clear deckId when Select Another Deck button is clicked", () => {
    const params = new URLSearchParams({ deckId: "44" });
    vi.mocked(useSearchParams).mockReturnValue([params, setSearchParamsMock]);

    vi.mocked(useQuery).mockReturnValue({
      data: {
        id: 44,
        name: "Test Deck",
        creatorUsername: "admin",
        deckCards: [],
        updatedAt: "",
      },
      isLoading: false,
    } as unknown as ReturnType<typeof useQuery>);

    render(
      <MemoryRouter>
        <HandSimulator />
      </MemoryRouter>,
    );

    const changeDeckBtn = screen.getByRole("button", { name: /Select Another Deck/i });
    fireEvent.click(changeDeckBtn);

    expect(setSearchParamsMock).toHaveBeenCalled();
    const updater = setSearchParamsMock.mock.calls[0]![0];
    const updated = typeof updater === "function" ? updater(params) : updater;
    expect(updated.get("deckId")).toBeNull();
  });
});
