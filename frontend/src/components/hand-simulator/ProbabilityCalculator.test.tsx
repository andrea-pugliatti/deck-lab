import { fireEvent, render, screen } from "@testing-library/react";
import { beforeAll, describe, expect, it, vi } from "vitest";

import type { DeckCardItem } from "../../types";
import ProbabilityCalculator from "./ProbabilityCalculator";

describe("ProbabilityCalculator component", () => {
  beforeAll(() => {
    // Mock HTMLDialogElement APIs that JSDOM doesn't support completely
    HTMLDialogElement.prototype.showModal = vi.fn(function (this: HTMLDialogElement) {
      this.open = true;
      this.dispatchEvent(new Event("show"));
    });
    HTMLDialogElement.prototype.close = vi.fn(function (this: HTMLDialogElement) {
      this.open = false;
      this.dispatchEvent(new Event("close"));
    });
  });

  const mockCards: DeckCardItem[] = [
    {
      cardId: 101,
      name: "Blue-Eyes White Dragon",
      type: "Normal Monster",
      quantity: 3,
      section: "MAIN",
    },
    {
      cardId: 102,
      name: "Dark Magician",
      type: "Normal Monster",
      quantity: 3,
      section: "MAIN",
    },
    {
      cardId: 103,
      name: "Pot of Greed",
      type: "Spell Card",
      quantity: 1,
      section: "MAIN",
    },
    {
      cardId: 104,
      name: "Raigeki",
      type: "Spell Card",
      quantity: 1,
      section: "MAIN",
    },
    {
      cardId: 105,
      name: "Blue-Eyes Ultimate Dragon",
      type: "Fusion Monster",
      quantity: 1,
      section: "EXTRA", // Should be ignored in probability calculator as it's EXTRA
    },
  ];

  it("should open the dialog modal on mount", () => {
    const handleClose = vi.fn();
    render(<ProbabilityCalculator cards={mockCards} onClose={handleClose} />);

    const dialog = screen.getByRole("dialog", { hidden: true });
    expect(dialog).toHaveAttribute("open");
    expect(screen.getByText("CONSISTENCY ANALYTICS")).toBeInTheDocument();
  });

  it("should render error message if main deck has fewer cards than the selected hand size", () => {
    const smallDeck = mockCards.slice(0, 1); // Only 3 main deck cards
    render(<ProbabilityCalculator cards={smallDeck} onClose={vi.fn()} />);

    expect(
      screen.getByText("Please add at least 5 cards to the Main Deck to compute statistics."),
    ).toBeInTheDocument();
  });

  it("should calculate and render correct probabilities for main deck cards", () => {
    render(<ProbabilityCalculator cards={mockCards} onClose={vi.fn()} />);

    // Total main cards: 3 + 3 + 1 + 1 = 8 cards
    // Blue-Eyes (3 copies), Dark Magician (3 copies), Pot of Greed (1 copy), Raigeki (1 copy)
    // Extra deck card is ignored.
    expect(screen.getByText("Blue-Eyes White Dragon")).toBeInTheDocument();
    expect(screen.getByText("Dark Magician")).toBeInTheDocument();
    expect(screen.getByText("Pot of Greed")).toBeInTheDocument();
    expect(screen.getByText("Raigeki")).toBeInTheDocument();

    // Extra deck card should NOT be in the probability table
    expect(screen.queryByText("Blue-Eyes Ultimate Dragon")).not.toBeInTheDocument();

    // Check copies in deck column
    const copiesValues = screen.getAllByText("3");
    expect(copiesValues.length).toBeGreaterThan(0);

    // Let's verify some calculated probability is rendered.
    // Since there are 8 cards, drawing 1 copy of Pot of Greed in 5 cards:
    // hypergeometric K=1, N=8, n=5:
    // prob = 1 - choose(7,5)/choose(8,5) = 1 - 21/56 = 1 - 0.375 = 62.5%
    expect(screen.getAllByText("62.5%").length).toBe(2); // Pot of Greed and Raigeki
  });

  it("should toggle starting hand size between 5 and 6 and update probabilities", () => {
    render(<ProbabilityCalculator cards={mockCards} onClose={vi.fn()} />);

    // 5 cards is active by default
    const button6 = screen.getByRole("button", { name: "6 Cards (Go Second)" });
    fireEvent.click(button6);

    // Now hand size is 6. Drawing 1 copy of Pot of Greed in 6 cards from 8 card deck:
    // prob = 1 - choose(7,6)/choose(8,6) = 1 - 7/28 = 75.0%
    expect(screen.getAllByText("75.0%").length).toBe(2); // Pot of Greed and Raigeki
  });

  it("should call onClose when clicking close button (X)", () => {
    const handleClose = vi.fn();
    render(<ProbabilityCalculator cards={mockCards} onClose={handleClose} />);

    const buttons = screen.getAllByRole("button");
    const closeBtnWithX = buttons.find((b) => b.querySelector("svg"));
    expect(closeBtnWithX).toBeInTheDocument();

    fireEvent.click(closeBtnWithX!);

    expect(handleClose).toHaveBeenCalledTimes(1);
  });

  it("should call onClose when clicking backdrop", () => {
    const handleClose = vi.fn();
    render(<ProbabilityCalculator cards={mockCards} onClose={handleClose} />);

    const dialog = screen.getByRole("dialog", { hidden: true });
    fireEvent.click(dialog);

    expect(handleClose).toHaveBeenCalledTimes(1);
  });
});
