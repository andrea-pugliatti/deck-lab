import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import type { SimulatorCardInstance } from "../../types";
import ZonePanel from "./ZonePanel";

describe("ZonePanel component", () => {
  const mockCards: SimulatorCardInstance[] = [
    {
      uniqId: "card-1",
      cardId: 101,
      name: "Blue-Eyes White Dragon",
      type: "Normal Monster",
      attribute: "LIGHT",
      quantity: 1,
      section: "MAIN",
      imageUrl: "blue_eyes.jpg",
    },
    {
      uniqId: "card-2",
      cardId: 102,
      name: "Dark Magician",
      type: "Normal Monster",
      attribute: "DARK",
      quantity: 1,
      section: "MAIN",
      imageUrl: undefined, // test fallback name render
    },
  ];

  it("should render cards list when cards are present", () => {
    const onMoveCard = vi.fn();
    const onViewDetails = vi.fn();

    render(
      <ZonePanel
        title="TEST ZONE"
        icon={<span data-testid="test-icon">icon</span>}
        cards={mockCards}
        currentZone="hand"
        onMoveCard={onMoveCard}
        onViewDetails={onViewDetails}
        emptyStateText="No cards here"
      />,
    );

    // Title & icon
    expect(screen.getByText("TEST ZONE")).toBeInTheDocument();
    expect(screen.getByTestId("test-icon")).toBeInTheDocument();

    // Cards count
    expect(screen.getByText("2 Cards")).toBeInTheDocument();

    // Card names (integrated check with SimulatorCard)
    expect(screen.getByRole("img", { name: "Blue-Eyes White Dragon" })).toBeInTheDocument();
    expect(screen.getByText("Dark Magician")).toBeInTheDocument();

    // Verify click triggers callback
    const cardImg = screen.getByRole("img", { name: "Blue-Eyes White Dragon" });
    fireEvent.click(cardImg);
    expect(onViewDetails).toHaveBeenCalledWith(mockCards[0]);
  });

  it("should render empty state message when cards array is empty", () => {
    render(
      <ZonePanel
        title="TEST ZONE"
        cards={[]}
        currentZone="hand"
        onMoveCard={vi.fn()}
        onViewDetails={vi.fn()}
        emptyStateText="No cards in this zone right now"
      />,
    );

    expect(screen.getByText("0 Cards")).toBeInTheDocument();
    expect(screen.getByText("No cards in this zone right now")).toBeInTheDocument();
    expect(screen.queryByRole("img")).not.toBeInTheDocument();
  });
});
