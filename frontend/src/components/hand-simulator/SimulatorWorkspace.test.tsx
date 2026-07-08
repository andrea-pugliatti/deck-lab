import { fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { useHandSimulator } from "../../hooks/useHandSimulator";
import type { Deck } from "../../types";
import SimulatorWorkspace from "./SimulatorWorkspace";

vi.mock("../../hooks/useHandSimulator", () => ({
  useHandSimulator: vi.fn(),
}));

vi.mock("./DeckExplorerModal", () => ({
  default: ({ deck, setShowDeckExplorer, handleActionFromExplorer }: any) => (
    <div data-testid="deck-explorer">
      <span>Explorer Card Count: {deck.length}</span>
      <button onClick={() => handleActionFromExplorer(deck[0], "hand")}>Action Hand</button>
      <button onClick={() => setShowDeckExplorer(false)}>Close Explorer</button>
    </div>
  ),
}));

vi.mock("./ProbabilityCalculator", () => ({
  default: ({ cards, onClose }: any) => (
    <div data-testid="probability-calculator">
      <span>Cards Count: {cards.length}</span>
      <button onClick={onClose}>Close Calc</button>
    </div>
  ),
}));

describe("SimulatorWorkspace component", () => {
  const mockDraw = vi.fn();
  const mockShuffle = vi.fn();
  const mockReset = vi.fn();
  const mockMoveCard = vi.fn();

  const mockDeck: Deck = {
    id: 12,
    name: "Standard Deck",
    description: "desc",
    formatName: "TCG",
    deckCards: [
      { cardId: 1, name: "Card 1", quantity: 3, section: "MAIN" },
      { cardId: 2, name: "Card 2", quantity: 3, section: "MAIN" },
    ],
  };

  beforeEach(() => {
    mockDraw.mockReset();
    mockShuffle.mockReset();
    mockReset.mockReset();
    mockMoveCard.mockReset();

    vi.mocked(useHandSimulator).mockReturnValue({
      hand: [
        {
          uniqId: "h1",
          cardId: 1,
          name: "Card in Hand 1",
          type: "Spell Card",
          quantity: 1,
          section: "MAIN",
        },
      ],
      field: [
        {
          uniqId: "f1",
          cardId: 3,
          name: "Card on Field 1",
          type: "Normal Monster",
          quantity: 1,
          section: "MAIN",
        },
      ],
      graveyard: [],
      banished: [],
      remainingDeck: [
        {
          uniqId: "d1",
          cardId: 2,
          name: "Card in Deck 1",
          type: "Normal Monster",
          quantity: 1,
          section: "MAIN",
        },
      ],
      draw: mockDraw,
      shuffleDeck: mockShuffle,
      reset: mockReset,
      moveCard: mockMoveCard,
    });
  });

  it("should render the workspace with initial hand and field cards", () => {
    render(<SimulatorWorkspace deck={mockDeck} />);

    // Inspector renders activeInspectedCard (hand[0] by default)
    expect(screen.getByText("Card Inspector")).toBeInTheDocument();
    expect(screen.getAllByText("Card in Hand 1").length).toBeGreaterThan(0);

    // Hand & Field zone counts (both show "1 Cards")
    expect(screen.getAllByText("1 Cards").length).toBe(2);

    // Cards in Hand and Field
    expect(screen.getAllByText("Card in Hand 1").length).toBe(2);
    expect(screen.getByText("Card on Field 1")).toBeInTheDocument();

    // Check zones headers
    expect(screen.getByText("HAND ZONE")).toBeInTheDocument();
    expect(screen.getByText("FIELD")).toBeInTheDocument();
    expect(screen.getByText("GRAVEYARD")).toBeInTheDocument();
    expect(screen.getByText("BANISHED ZONE")).toBeInTheDocument();
  });

  it("should handle config hand size updates when clicking buttons 5 and 6", () => {
    render(<SimulatorWorkspace deck={mockDeck} />);

    const button5 = screen.getByRole("button", { name: "5" });
    const button6 = screen.getByRole("button", { name: "6" });

    // Initial state: 5 should have active classes, 6 should not
    expect(button5).toHaveClass("bg-cyan-accent");
    expect(button6).not.toHaveClass("bg-cyan-accent");

    // Click 6
    fireEvent.click(button6);
    expect(button6).toHaveClass("bg-cyan-accent");
    expect(button5).not.toHaveClass("bg-cyan-accent");
  });

  it("should trigger draw, shuffle, reset simulator operations", () => {
    render(<SimulatorWorkspace deck={mockDeck} />);

    // Draw
    const drawBtn = screen.getByRole("button", { name: /Draw 1/ });
    fireEvent.click(drawBtn);
    expect(mockDraw).toHaveBeenCalledWith(1);

    // Shuffle
    const shuffleBtn = screen.getByRole("button", { name: /Shuffle/ });
    fireEvent.click(shuffleBtn);
    expect(mockShuffle).toHaveBeenCalled();

    // Reset & Redraw (with current config hand size, which is 5 by default)
    const resetBtn = screen.getByRole("button", { name: /Reset & Redraw/ });
    fireEvent.click(resetBtn);
    expect(mockReset).toHaveBeenCalledWith(5);
  });

  it("should open and close Deck Explorer modal", () => {
    render(<SimulatorWorkspace deck={mockDeck} />);

    expect(screen.queryByTestId("deck-explorer")).not.toBeInTheDocument();

    // Click Search Deck
    const searchBtn = screen.getByRole("button", { name: /Search Deck/ });
    fireEvent.click(searchBtn);

    expect(screen.getByTestId("deck-explorer")).toBeInTheDocument();
    expect(screen.getByText("Explorer Card Count: 1")).toBeInTheDocument();

    // Click action inside explorer triggers moveCard
    const actionBtn = screen.getByRole("button", { name: "Action Hand" });
    fireEvent.click(actionBtn);
    expect(mockMoveCard).toHaveBeenCalledWith(
      {
        uniqId: "d1",
        cardId: 2,
        name: "Card in Deck 1",
        type: "Normal Monster",
        quantity: 1,
        section: "MAIN",
      },
      "hand",
    );

    // Click close explorer
    const closeBtn = screen.getByRole("button", { name: "Close Explorer" });
    fireEvent.click(closeBtn);
    expect(screen.queryByTestId("deck-explorer")).not.toBeInTheDocument();
  });

  it("should open and close Consistency Calculator modal", () => {
    render(<SimulatorWorkspace deck={mockDeck} />);

    expect(screen.queryByTestId("probability-calculator")).not.toBeInTheDocument();

    // Click Consistency Calculator
    const calcBtn = screen.getByRole("button", { name: /Consistency Calculator/ });
    fireEvent.click(calcBtn);

    expect(screen.getByTestId("probability-calculator")).toBeInTheDocument();
    expect(screen.getByText("Cards Count: 2")).toBeInTheDocument(); // deck.deckCards has 2 card items

    // Close calculator
    const closeBtn = screen.getByRole("button", { name: "Close Calc" });
    fireEvent.click(closeBtn);
    expect(screen.queryByTestId("probability-calculator")).not.toBeInTheDocument();
  });

  it("should update inspectedCard in CardInspector when card in workspace is clicked", () => {
    render(<SimulatorWorkspace deck={mockDeck} />);

    // Initially, inspectedCard is hand[0] ("Card in Hand 1")
    expect(screen.getAllByText("Card in Hand 1").length).toBeGreaterThan(0);

    // Click field card "Card on Field 1"
    const fieldCard = screen.getByText("Card on Field 1");
    fireEvent.click(fieldCard);

    // CardInspector should render "Card on Field 1" details
    // Wait, since both CardInspector and the card list itself display the card name,
    // let's check the inspector header / description or that the inspector has it.
    // In CardInspector:
    // <h4>Card Name</h4>
    const heading = screen.getByRole("heading", { name: "Card on Field 1" });
    expect(heading).toBeInTheDocument();
  });
});
