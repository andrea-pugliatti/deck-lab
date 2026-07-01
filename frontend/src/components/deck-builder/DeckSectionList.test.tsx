import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import type { DeckCardItem } from "../../types";
import DeckSectionList from "./DeckSectionList";

describe("DeckSectionList component", () => {
  const mockUpdateQuantity = vi.fn();
  const mockRemoveCard = vi.fn();

  const mockDeckCards: DeckCardItem[] = [
    {
      cardId: 1,
      name: "Blue-Eyes White Dragon",
      type: "Monster Card",
      section: "MAIN",
      quantity: 3,
      imageUrl: "blue_eyes.jpg",
    },
    {
      cardId: 2,
      name: "Polymerization",
      type: "Spell Card",
      section: "MAIN",
      quantity: 1,
      imageUrl: "poly.jpg",
    },
    {
      cardId: 3,
      name: "Blue-Eyes Ultimate Dragon",
      type: "Fusion Monster",
      section: "EXTRA",
      quantity: 1,
      imageUrl: "ultimate.jpg",
    },
  ];

  it("should render Main Deck section with list of main deck cards and correct counter limit text", () => {
    render(
      <DeckSectionList
        section="MAIN"
        deckCards={mockDeckCards}
        formatName="TCG"
        updateQuantity={mockUpdateQuantity}
        removeCard={mockRemoveCard}
      />,
    );

    expect(screen.getByText("Main Deck")).toBeInTheDocument();
    // Count is 3 + 1 = 4. TCG limits are: max 60, min 40
    expect(screen.getByText("4 / 60 Cards (Min 40)")).toBeInTheDocument();

    expect(screen.getByText("Blue-Eyes White Dragon")).toBeInTheDocument();
    expect(screen.getByText("Polymerization")).toBeInTheDocument();
    expect(screen.queryByText("Blue-Eyes Ultimate Dragon")).not.toBeInTheDocument();
  });

  it("should render Extra Deck section with list of extra deck cards and correct counter limit text", () => {
    render(
      <DeckSectionList
        section="EXTRA"
        deckCards={mockDeckCards}
        formatName="TCG"
        updateQuantity={mockUpdateQuantity}
        removeCard={mockRemoveCard}
      />,
    );

    expect(screen.getByText("Extra Deck")).toBeInTheDocument();
    // Count is 1. TCG Extra limits: max 15
    expect(screen.getByText("1 / 15 Cards (Max 15)")).toBeInTheDocument();

    expect(screen.getByText("Blue-Eyes Ultimate Dragon")).toBeInTheDocument();
    expect(screen.queryByText("Blue-Eyes White Dragon")).not.toBeInTheDocument();
  });

  it("should render Side Deck empty state message when it has no cards", () => {
    render(
      <DeckSectionList
        section="SIDE"
        deckCards={mockDeckCards}
        formatName="TCG"
        updateQuantity={mockUpdateQuantity}
        removeCard={mockRemoveCard}
      />,
    );

    expect(screen.getByText("Side Deck")).toBeInTheDocument();
    expect(screen.getByText("0 / 15 Cards (Max 15)")).toBeInTheDocument();
    expect(screen.getByText(/Empty Side Deck/)).toBeInTheDocument();
  });

  it("should render Main Deck empty state message when it has no cards", () => {
    render(
      <DeckSectionList
        section="MAIN"
        deckCards={[]}
        formatName="TCG"
        updateQuantity={mockUpdateQuantity}
        removeCard={mockRemoveCard}
      />,
    );

    expect(screen.getByText(/Empty Main Deck/)).toBeInTheDocument();
  });

  it("should render Extra Deck empty state message when it has no cards", () => {
    render(
      <DeckSectionList
        section="EXTRA"
        deckCards={[]}
        formatName="TCG"
        updateQuantity={mockUpdateQuantity}
        removeCard={mockRemoveCard}
      />,
    );

    expect(screen.getByText(/Empty Extra Deck/)).toBeInTheDocument();
  });
});
