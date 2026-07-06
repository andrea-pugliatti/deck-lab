import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import type { Card, DeckCardItem } from "../../types";
import DeckBuilderCardList from "./DeckBuilderCardList";

describe("DeckBuilderCardList component", () => {
  const mockAddCard = vi.fn();
  const mockLibraryCards: Card[] = [
    {
      id: 1,
      name: "Blue-Eyes White Dragon",
      type: "Monster",
      description: "Legendary dragon",
      race: "Dragon",
      attribute: "LIGHT",
      imageUrlCropped: "blue_eyes.jpg",
    },
    {
      id: 2,
      name: "Dark Magician",
      type: "Monster",
      description: "Ultimate wizard",
      race: "Spellcaster",
      attribute: "DARK",
      imageUrlCropped: "dark_magician.jpg",
    },
  ];

  const mockDeckCards: DeckCardItem[] = [];

  it("should show loading spinner if libraryLoading is true and list is empty", () => {
    const { container } = render(
      <DeckBuilderCardList
        libraryLoading={true}
        libraryCards={[]}
        deckCards={mockDeckCards}
        addCard={mockAddCard}
      />,
    );

    expect(container.querySelector(".animate-spin")).toBeInTheDocument();
    expect(screen.queryByText("No cards match search criteria.")).not.toBeInTheDocument();
  });

  it("should render empty message if libraryCards is empty and not loading", () => {
    render(
      <DeckBuilderCardList
        libraryLoading={false}
        libraryCards={[]}
        deckCards={mockDeckCards}
        addCard={mockAddCard}
      />,
    );

    expect(screen.getByText("No cards match search criteria.")).toBeInTheDocument();
  });

  it("should render SearchCardItems when libraryCards is populated", () => {
    render(
      <DeckBuilderCardList
        libraryLoading={false}
        libraryCards={mockLibraryCards}
        deckCards={mockDeckCards}
        addCard={mockAddCard}
      />,
    );

    expect(screen.getByText("Blue-Eyes White Dragon")).toBeInTheDocument();
    expect(screen.getByText("Dark Magician")).toBeInTheDocument();
  });

  it("should apply pointer-events-none and opacity styling when loading but list is not empty", () => {
    const { container } = render(
      <DeckBuilderCardList
        libraryLoading={true}
        libraryCards={mockLibraryCards}
        deckCards={mockDeckCards}
        addCard={mockAddCard}
      />,
    );

    const listDiv = container.firstChild as HTMLElement;
    expect(listDiv.className).toContain("pointer-events-none");
    expect(listDiv.className).toContain("opacity-50");
  });
});
