import { render, screen } from "@testing-library/react";
import { MemoryRouter, useSearchParams } from "react-router";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { useFetch } from "../hooks/useFetch";
import HandSimulator from "./HandSimulator";

vi.mock("../hooks/useFetch", () => ({
  useFetch: vi.fn(),
}));

vi.mock("react-router", async (importOriginal) => {
  const actual = await importOriginal<typeof import("react-router")>();
  return {
    ...actual,
    useSearchParams: vi.fn(),
  };
});

vi.mock("../components/hand-simulator/DeckSelector", () => ({
  default: () => <div data-testid="deck-selector">DeckSelector</div>,
}));

vi.mock("../components/hand-simulator/SimulatorWorkspace", () => ({
  default: () => <div data-testid="simulator-workspace">SimulatorWorkspace</div>,
}));

describe("HandSimulator page component", () => {
  const setSearchParamsMock = vi.fn();

  beforeEach(() => {
    setSearchParamsMock.mockReset();
    vi.mocked(useSearchParams).mockReturnValue([new URLSearchParams(), setSearchParamsMock]);
  });

  it("should render DeckSelector when no deckId query parameter exists", () => {
    vi.mocked(useFetch).mockReturnValue({
      data: undefined,
      loading: false,
    } as any);

    render(
      <MemoryRouter>
        <HandSimulator />
      </MemoryRouter>,
    );

    expect(screen.getByTestId("deck-selector")).toBeInTheDocument();
  });

  it("should render SimulatorWorkspace when a deckId parameter is present", () => {
    const params = new URLSearchParams({ deckId: "44" });
    vi.mocked(useSearchParams).mockReturnValue([params, setSearchParamsMock]);

    vi.mocked(useFetch).mockReturnValue({
      data: {
        id: 44,
        name: "Test Deck",
        creatorUsername: "admin",
        deckCards: [],
        updatedAt: "",
      },
      loading: false,
    } as any);

    render(
      <MemoryRouter>
        <HandSimulator />
      </MemoryRouter>,
    );

    expect(screen.getByTestId("simulator-workspace")).toBeInTheDocument();
    expect(screen.getByText("SIMULATING: Test Deck")).toBeInTheDocument();
  });
});
