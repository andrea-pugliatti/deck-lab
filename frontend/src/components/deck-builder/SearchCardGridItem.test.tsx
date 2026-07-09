import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import type { Card } from "../../types";
import SearchCardGridItem from "./SearchCardGridItem";

describe("SearchCardGridItem component", () => {
  const mockAddCard = vi.fn();
  const mockCard: Card = {
    id: 101,
    name: "Dark Magician",
    type: "Spellcaster Monster",
    description: "Ultimate wizard",
    race: "Spellcaster",
    attribute: "DARK",
    imageUrlCropped: "dm.jpg",
  };

  it("should render card details correctly", () => {
    render(
      <SearchCardGridItem
        cardId={101}
        name="Dark Magician"
        type="Spellcaster Monster"
        imageUrl="dm.jpg"
        card={mockCard}
        deckCards={[]}
        addCard={mockAddCard}
      />,
    );

    expect(screen.getAllByText("Dark Magician")[0]).toBeInTheDocument();
    // Badge removes " Monster" and " Card"
    expect(screen.getByText("Spellcaster")).toBeInTheDocument();

    const img = screen.getByAltText("Dark Magician") as HTMLImageElement;
    expect(img).toBeInTheDocument();
    expect(img.src).toContain("/api/dm.jpg");
  });

  it("should render added quantity badge if card is in deck", () => {
    render(
      <SearchCardGridItem
        cardId={101}
        name="Dark Magician"
        type="Spellcaster Monster"
        imageUrl="dm.jpg"
        card={mockCard}
        deckCards={[{ cardId: 101, name: "Dark Magician", quantity: 2, section: "MAIN" }]}
        addCard={mockAddCard}
      />,
    );

    expect(screen.getByText("2 added")).toBeInTheDocument();
  });

  it("should call addCard when Main or Side buttons are clicked for a Main Deck card", () => {
    mockAddCard.mockClear();
    render(
      <SearchCardGridItem
        cardId={101}
        name="Dark Magician"
        type="Spellcaster Monster"
        imageUrl="dm.jpg"
        card={mockCard}
        deckCards={[]}
        addCard={mockAddCard}
      />,
    );

    // Overlay buttons might only appear on hover, but testing-library can find them in DOM
    const mainBtn = screen.getByRole("button", { name: "+ Main" });
    const extraBtn = screen.getByRole("button", { name: "+ Extra" });
    const sideBtn = screen.getByRole("button", { name: "+ Side" });

    expect(mainBtn).not.toBeDisabled();
    expect(extraBtn).toBeDisabled();
    expect(sideBtn).not.toBeDisabled();

    fireEvent.click(mainBtn);
    expect(mockAddCard).toHaveBeenCalledWith(mockCard, "MAIN");

    fireEvent.click(sideBtn);
    expect(mockAddCard).toHaveBeenCalledWith(mockCard, "SIDE");
  });

  it("should disable buttons when totalInDeck is 3 or more", () => {
    render(
      <SearchCardGridItem
        cardId={101}
        name="Dark Magician"
        type="Spellcaster Monster"
        imageUrl="dm.jpg"
        card={mockCard}
        deckCards={[{ cardId: 101, name: "Dark Magician", quantity: 3, section: "MAIN" }]}
        addCard={mockAddCard}
      />,
    );

    expect(screen.getByRole("button", { name: "+ Main" })).toBeDisabled();
    expect(screen.getByRole("button", { name: "+ Side" })).toBeDisabled();
  });

  it("should enable Extra button and disable Main button for Extra Deck monsters", () => {
    mockAddCard.mockClear();
    const fusionCard = { ...mockCard, type: "Fusion Monster" };

    render(
      <SearchCardGridItem
        cardId={101}
        name="Blue-Eyes Ultimate Dragon"
        type="Fusion Monster"
        imageUrl="ultimate.jpg"
        card={fusionCard}
        deckCards={[]}
        addCard={mockAddCard}
      />,
    );

    const mainBtn = screen.getByRole("button", { name: "+ Main" });
    const extraBtn = screen.getByRole("button", { name: "+ Extra" });
    const sideBtn = screen.getByRole("button", { name: "+ Side" });

    expect(mainBtn).toBeDisabled();
    expect(extraBtn).not.toBeDisabled();
    expect(sideBtn).not.toBeDisabled();

    fireEvent.click(extraBtn);
    expect(mockAddCard).toHaveBeenCalledWith(fusionCard, "EXTRA");
  });
});
