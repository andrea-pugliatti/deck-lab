import { fireEvent, render, screen } from "@testing-library/react";
import { beforeAll, describe, expect, it, vi } from "vitest";

import type { SimulatorCardInstance } from "../../types";
import DeckExplorerModal from "./DeckExplorerModal";

describe("DeckExplorerModal component", () => {
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

  const mockDeck: SimulatorCardInstance[] = [
    {
      uniqId: "card-1",
      cardId: 101,
      name: "Blue-Eyes White Dragon",
      type: "Normal Monster",
      attribute: "LIGHT",
      quantity: 1,
      section: "MAIN",
    },
    {
      uniqId: "card-2",
      cardId: 102,
      name: "Dark Magician",
      type: "Normal Monster",
      attribute: "DARK",
      quantity: 1,
      section: "MAIN",
    },
    {
      uniqId: "card-3",
      cardId: 103,
      name: "Pot of Greed",
      type: "Spell Card",
      quantity: 1,
      section: "MAIN",
    },
  ];

  it("should open the dialog modal on mount", () => {
    const setShowDeckExplorer = vi.fn();
    render(
      <DeckExplorerModal
        deck={mockDeck}
        setShowDeckExplorer={setShowDeckExplorer}
        handleActionFromExplorer={vi.fn()}
      />,
    );

    const dialog = screen.getByRole("dialog", { hidden: true });
    expect(dialog).toHaveAttribute("open");
    expect(screen.getByText("SEARCH DECK (3 CARDS REMAINING)")).toBeInTheDocument();
  });

  it("should render all cards in the remaining deck", () => {
    render(
      <DeckExplorerModal
        deck={mockDeck}
        setShowDeckExplorer={vi.fn()}
        handleActionFromExplorer={vi.fn()}
      />,
    );

    expect(screen.getByText("Blue-Eyes White Dragon")).toBeInTheDocument();
    expect(screen.getByText("Dark Magician")).toBeInTheDocument();
    expect(screen.getByText("Pot of Greed")).toBeInTheDocument();
  });

  it("should filter cards by search query", async () => {
    render(
      <DeckExplorerModal
        deck={mockDeck}
        setShowDeckExplorer={vi.fn()}
        handleActionFromExplorer={vi.fn()}
      />,
    );

    const input = screen.getByPlaceholderText("Search remaining deck cards...");
    fireEvent.change(input, { target: { value: "Dragon" } });

    expect(screen.getByText("Blue-Eyes White Dragon")).toBeInTheDocument();
    expect(screen.queryByText("Dark Magician")).not.toBeInTheDocument();
    expect(screen.queryByText("Pot of Greed")).not.toBeInTheDocument();
  });

  it("should show empty state if search matches nothing", () => {
    render(
      <DeckExplorerModal
        deck={mockDeck}
        setShowDeckExplorer={vi.fn()}
        handleActionFromExplorer={vi.fn()}
      />,
    );

    const input = screen.getByPlaceholderText("Search remaining deck cards...");
    fireEvent.change(input, { target: { value: "Exodia" } });

    expect(screen.getByText("No matching cards remaining in the deck.")).toBeInTheDocument();
  });

  it("should handle card actions (To Hand, To Field, To GY) and close modal", () => {
    const handleActionFromExplorer = vi.fn();
    const setShowDeckExplorer = vi.fn();

    render(
      <DeckExplorerModal
        deck={mockDeck}
        setShowDeckExplorer={setShowDeckExplorer}
        handleActionFromExplorer={handleActionFromExplorer}
      />,
    );

    // Get "To Hand" button for Blue-Eyes
    const toHandBtns = screen.getAllByRole("button", { name: "To Hand" });
    fireEvent.click(toHandBtns[0]); // Click first card (Blue-Eyes) to hand

    expect(handleActionFromExplorer).toHaveBeenCalledWith(mockDeck[0], "hand");
    expect(setShowDeckExplorer).toHaveBeenCalledWith(false);
  });

  it("should close dialog when clicking close button (X)", () => {
    const setShowDeckExplorer = vi.fn();
    render(
      <DeckExplorerModal
        deck={mockDeck}
        setShowDeckExplorer={setShowDeckExplorer}
        handleActionFromExplorer={vi.fn()}
      />,
    );

    const buttons = screen.getAllByRole("button");
    const closeBtnWithX = buttons.find((b) => b.querySelector("svg"));
    expect(closeBtnWithX).toBeInTheDocument();

    fireEvent.click(closeBtnWithX!);

    expect(setShowDeckExplorer).toHaveBeenCalledWith(false);
  });

  it("should close dialog when backdrop is clicked", () => {
    const setShowDeckExplorer = vi.fn();
    render(
      <DeckExplorerModal
        deck={mockDeck}
        setShowDeckExplorer={setShowDeckExplorer}
        handleActionFromExplorer={vi.fn()}
      />,
    );

    const dialog = screen.getByRole("dialog", { hidden: true });

    // Simulate backdrop click by clicking directly on the dialog element
    fireEvent.click(dialog);

    expect(setShowDeckExplorer).toHaveBeenCalledWith(false);
  });
});
