import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import type { DeckCardItem, Suggestion } from "../../types";
import AiSuggestionItem from "./AiSuggestionItem";

describe("AiSuggestionItem component", () => {
  const mockCard: Suggestion = {
    cardId: 101,
    name: "Dark Magician",
    type: "Spellcaster / Normal Monster",
    section: "MAIN",
    imageUrl: "/images/dark_magician.jpg",
    synergyReason: "Classic synergy with Dark Magic Attack.",
  };

  const mockOnAdd = vi.fn();

  it("should render card information correctly", () => {
    render(<AiSuggestionItem card={mockCard} deckCards={[]} formatName="TCG" onAdd={mockOnAdd} />);

    expect(screen.getByText("Dark Magician")).toBeInTheDocument();
    expect(screen.getByText("MAIN")).toBeInTheDocument();
    expect(screen.getByText("Classic synergy with Dark Magic Attack.")).toBeInTheDocument();

    const img = screen.getByAltText("Dark Magician") as HTMLImageElement;
    expect(img).toBeInTheDocument();
    expect(img.src).toContain("/api/images/dark_magician.jpg");
  });

  it("should render smiley placeholder if no image URL is provided", () => {
    const cardWithoutImage = { ...mockCard, imageUrl: undefined };
    render(
      <AiSuggestionItem
        card={cardWithoutImage}
        deckCards={[]}
        formatName="TCG"
        onAdd={mockOnAdd}
      />,
    );

    expect(screen.queryByAltText("Dark Magician")).not.toBeInTheDocument();
    expect(screen.getByText(":)")).toBeInTheDocument();
  });

  it("should render smiley placeholder if image fails to load", () => {
    render(<AiSuggestionItem card={mockCard} deckCards={[]} formatName="TCG" onAdd={mockOnAdd} />);

    const img = screen.getByAltText("Dark Magician");
    fireEvent.error(img);

    expect(screen.queryByAltText("Dark Magician")).not.toBeInTheDocument();
    expect(screen.getByText(":)")).toBeInTheDocument();
  });

  it("should call onAdd when plus button is clicked", () => {
    mockOnAdd.mockClear();
    render(<AiSuggestionItem card={mockCard} deckCards={[]} formatName="TCG" onAdd={mockOnAdd} />);

    const button = screen.getByRole("button", { name: "Add to MAIN Deck" });
    fireEvent.click(button);

    expect(mockOnAdd).toHaveBeenCalledTimes(1);
    expect(mockOnAdd).toHaveBeenCalledWith(mockCard);
  });

  it("should disable add button when max copies are already in the deck", () => {
    const deckCards: DeckCardItem[] = [
      { cardId: 101, name: "Dark Magician", quantity: 3, section: "MAIN" },
    ];

    render(
      <AiSuggestionItem card={mockCard} deckCards={deckCards} formatName="TCG" onAdd={mockOnAdd} />,
    );

    const button = screen.getByRole("button");
    expect(button).toBeDisabled();
    expect(button.title).toBe("Max copies added");
  });

  it("should render different badge variants based on section", () => {
    const extraCard: Suggestion = {
      ...mockCard,
      section: "EXTRA",
    };
    const { rerender } = render(
      <AiSuggestionItem card={extraCard} deckCards={[]} formatName="TCG" onAdd={mockOnAdd} />,
    );
    expect(screen.getByText("EXTRA")).toBeInTheDocument();

    const sideCard: Suggestion = {
      ...mockCard,
      section: "SIDE",
    };
    rerender(
      <AiSuggestionItem card={sideCard} deckCards={[]} formatName="TCG" onAdd={mockOnAdd} />,
    );
    expect(screen.getByText("SIDE")).toBeInTheDocument();
  });
});
