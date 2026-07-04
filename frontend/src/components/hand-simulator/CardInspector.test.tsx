import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import type { SimulatorCardInstance } from "../../types";
import CardInspector from "./CardInspector";

describe("CardInspector component", () => {
  it("should render the empty state when inspectedCard is undefined", () => {
    render(<CardInspector inspectedCard={undefined} />);
    expect(screen.getByText("No Card Inspected")).toBeInTheDocument();
    expect(
      screen.getByText("Hover over a card or click its detail icon to view descriptions."),
    ).toBeInTheDocument();
  });

  it("should render monster card details when inspectedCard is provided", () => {
    const mockCard: SimulatorCardInstance = {
      uniqId: "card-1",
      cardId: 101,
      name: "Blue-Eyes White Dragon",
      type: "Normal Monster",
      attribute: "LIGHT",
      atk: 3000,
      def: 2500,
      level: 8,
      description: "This legendary dragon is a powerful engine of destruction.",
      imageUrl: "blue_eyes.jpg",
      quantity: 3,
      section: "MAIN",
    };

    render(<CardInspector inspectedCard={mockCard} />);

    expect(screen.getByText("Blue-Eyes White Dragon")).toBeInTheDocument();
    expect(screen.getByText("Normal Monster")).toBeInTheDocument();
    expect(screen.getByText("LIGHT")).toBeInTheDocument();
    expect(screen.getByText("ATK: 3000")).toBeInTheDocument();
    expect(screen.getByText("DEF: 2500")).toBeInTheDocument();
    expect(screen.getByText("Level 8")).toBeInTheDocument();
    expect(
      screen.getByText("This legendary dragon is a powerful engine of destruction."),
    ).toBeInTheDocument();

    const img = screen.getByRole("img", { name: "Blue-Eyes White Dragon" });
    expect(img).toBeInTheDocument();
    expect(img).toHaveAttribute("src", "/api/blue_eyes.jpg");
  });

  it("should render '?' for ATK/DEF when value is -1", () => {
    const mockCard: SimulatorCardInstance = {
      uniqId: "card-2",
      cardId: 102,
      name: "Evil Dragon Ananta",
      type: "Effect Monster",
      attribute: "DARK",
      atk: -1,
      def: -1,
      level: 8,
      description: "Cannot be Normal Summoned...",
      quantity: 1,
      section: "MAIN",
    };

    render(<CardInspector inspectedCard={mockCard} />);
    expect(screen.getByText("ATK: ?")).toBeInTheDocument();
    expect(screen.getByText("DEF: ?")).toBeInTheDocument();
  });

  it("should render '[ No Art ]' when no imageUrl is provided", () => {
    const mockCard: SimulatorCardInstance = {
      uniqId: "card-3",
      cardId: 103,
      name: "Spell Card",
      type: "Spell Card",
      description: "Draw 2 cards.",
      quantity: 3,
      section: "MAIN",
    };

    render(<CardInspector inspectedCard={mockCard} />);
    expect(screen.getByText("[ No Art ]")).toBeInTheDocument();
  });

  it("should not render ATK/DEF/level for Spell cards", () => {
    const mockCard: SimulatorCardInstance = {
      uniqId: "card-3",
      cardId: 103,
      name: "Spell Card",
      type: "Spell Card",
      description: "Draw 2 cards.",
      quantity: 3,
      section: "MAIN",
      atk: 1000,
      def: 1000,
      level: 4,
    };

    render(<CardInspector inspectedCard={mockCard} />);
    expect(screen.queryByText(/ATK:/)).not.toBeInTheDocument();
    expect(screen.queryByText(/DEF:/)).not.toBeInTheDocument();
    expect(screen.queryByText(/Level/)).not.toBeInTheDocument();
  });
});
