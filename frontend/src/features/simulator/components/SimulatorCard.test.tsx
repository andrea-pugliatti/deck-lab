import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import type { SimulatorCardInstance } from "../../types";
import SimulatorCard from "./SimulatorCard";

describe("SimulatorCard component", () => {
  const mockCard: SimulatorCardInstance = {
    uniqId: "card-123",
    cardId: 999,
    name: "Dark Magician",
    type: "Normal Monster",
    attribute: "DARK",
    quantity: 1,
    section: "MAIN",
    imageUrl: "dark_magician.jpg",
  };

  it("should render card image when imageUrl is present", () => {
    render(<SimulatorCard card={mockCard} currentZone="hand" onMove={vi.fn()} />);

    const img = screen.getByRole("img", { name: "Dark Magician" });
    expect(img).toBeInTheDocument();
    expect(img).toHaveAttribute("src", "/api/dark_magician.jpg");
  });

  it("should render card fallback text when imageUrl is absent", () => {
    const cardWithoutImage = { ...mockCard, imageUrl: undefined };
    render(<SimulatorCard card={cardWithoutImage} currentZone="hand" onMove={vi.fn()} />);

    expect(screen.getByText("Dark Magician")).toBeInTheDocument();
    expect(screen.getByText("[ No Art ]")).toBeInTheDocument();
  });

  it("should open move menu and call onViewDetails when clicked", () => {
    const onViewDetails = vi.fn();
    render(
      <SimulatorCard
        card={mockCard}
        currentZone="hand"
        onMove={vi.fn()}
        onViewDetails={onViewDetails}
      />,
    );

    const cardContainer = screen.getByRole("img", { name: "Dark Magician" }).parentElement;
    expect(cardContainer).toBeInTheDocument();

    // Initial state: menu is closed
    expect(screen.queryByText("Move Card")).not.toBeInTheDocument();

    // Click card container
    fireEvent.click(cardContainer!);

    expect(onViewDetails).toHaveBeenCalledWith(mockCard);
    expect(screen.getByText("Move Card")).toBeInTheDocument();
  });

  it("should render correct move options based on current zone", () => {
    const { rerender } = render(
      <SimulatorCard card={mockCard} currentZone="hand" onMove={vi.fn()} />,
    );

    // Click to open menu
    const cardContainer1 = screen.getByRole("img", { name: "Dark Magician" }).parentElement!;
    fireEvent.click(cardContainer1);

    // In hand: should show To Field, To Graveyard, To Banished, To Deck Top, To Deck Bottom, but NOT To Hand
    expect(screen.queryByRole("button", { name: "To Hand" })).not.toBeInTheDocument();
    expect(screen.getByRole("button", { name: "To Field (Summon)" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "To Graveyard (GY)" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "To Banished (Banish)" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "To Deck Top" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "To Deck Bottom" })).toBeInTheDocument();

    // Rerender as currentZone = field
    rerender(<SimulatorCard card={mockCard} currentZone="field" onMove={vi.fn()} />);
    // In field: should show To Hand but NOT To Field
    expect(screen.getByRole("button", { name: "To Hand" })).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "To Field (Summon)" })).not.toBeInTheDocument();

    // Rerender as currentZone = deck
    rerender(<SimulatorCard card={mockCard} currentZone="deck" onMove={vi.fn()} />);
    // In deck: should show To Hand but NOT deck top/bottom
    expect(screen.queryByRole("button", { name: "To Deck Top" })).not.toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "To Deck Bottom" })).not.toBeInTheDocument();
  });

  it("should call onMove with target zone and close menu when option is clicked", () => {
    const onMove = vi.fn();
    render(<SimulatorCard card={mockCard} currentZone="hand" onMove={onMove} />);

    // Click to open menu
    const cardContainer = screen.getByRole("img", { name: "Dark Magician" }).parentElement!;
    fireEvent.click(cardContainer);

    // Click To Field (Summon)
    const summonBtn = screen.getByRole("button", { name: "To Field (Summon)" });
    fireEvent.click(summonBtn);

    expect(onMove).toHaveBeenCalledWith(mockCard, "field");
    // Menu should be closed
    expect(screen.queryByText("Move Card")).not.toBeInTheDocument();
  });

  it("should close menu when clicking outside", () => {
    render(<SimulatorCard card={mockCard} currentZone="hand" onMove={vi.fn()} />);

    // Click to open menu
    const cardContainer = screen.getByRole("img", { name: "Dark Magician" }).parentElement!;
    fireEvent.click(cardContainer);

    expect(screen.getByText("Move Card")).toBeInTheDocument();

    // Simulate clicking outside
    fireEvent.mouseDown(document.body);

    expect(screen.queryByText("Move Card")).not.toBeInTheDocument();
  });
});
