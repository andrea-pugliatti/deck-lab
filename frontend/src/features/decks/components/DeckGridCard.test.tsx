import { fireEvent, render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router";
import { describe, expect, it, vi } from "vitest";

import type { Format } from "../../../types";
import DeckGridCard from "./DeckGridCard";

describe("DeckGridCard component", () => {
  const defaultProps = {
    id: 42,
    name: "Stardust Dragon Deck",
    description: "A deck centered around synchro summoning Stardust Dragon.",
    formatName: "TCG" as Format,
    cardCount: 40,
    creatorUsername: "yusei_fudo",
    updatedAt: new Date(Date.now() - 3600000).toISOString(), // 1 hour ago
  };

  it("renders basic deck details correctly", () => {
    render(
      <MemoryRouter>
        <DeckGridCard {...defaultProps} />
      </MemoryRouter>,
    );

    expect(screen.getByText("Stardust Dragon Deck")).toBeInTheDocument();
    expect(
      screen.getByText("A deck centered around synchro summoning Stardust Dragon."),
    ).toBeInTheDocument();
    expect(screen.getByText("TCG")).toBeInTheDocument();
    expect(screen.getByText("by yusei_fudo")).toBeInTheDocument();
    expect(screen.getByText("40 Cards")).toBeInTheDocument();
    expect(screen.getByText(/1 hour ago/)).toBeInTheDocument();
  });

  it("renders placeholder description and creator if not provided", () => {
    render(
      <MemoryRouter>
        <DeckGridCard id={12} name="Simple Deck" formatName="Speed Duel" cardCount={20} />
      </MemoryRouter>,
    );

    expect(screen.getByText("No description provided.")).toBeInTheDocument();
    expect(screen.getByText("by Community")).toBeInTheDocument();
  });

  it("renders as a Link to the deck detail page by default", () => {
    render(
      <MemoryRouter>
        <DeckGridCard {...defaultProps} />
      </MemoryRouter>,
    );

    const linkElement = screen.getByRole("link");
    expect(linkElement).toHaveAttribute("href", "/decks/42");
  });

  it("renders select button and calls onSelect when clicked", () => {
    const handleSelect = vi.fn();
    render(
      <MemoryRouter>
        <DeckGridCard {...defaultProps} onSelect={handleSelect} />
      </MemoryRouter>,
    );

    // No link element because onSelect is provided
    expect(screen.queryByRole("link")).not.toBeInTheDocument();

    const selectBtn = screen.getByRole("button", { name: "Select" });
    expect(selectBtn).toBeInTheDocument();

    fireEvent.click(selectBtn);
    expect(handleSelect).toHaveBeenCalledWith(42);
  });

  it("calls onSelect when the container div is clicked (when onSelect is provided)", () => {
    const handleSelect = vi.fn();
    render(
      <MemoryRouter>
        <DeckGridCard {...defaultProps} onSelect={handleSelect} />
      </MemoryRouter>,
    );

    const container = screen.getByText("Stardust Dragon Deck").closest("div.cursor-pointer")!;
    fireEvent.click(container);
    expect(handleSelect).toHaveBeenCalledWith(42);
  });

  it("calls onSelect when enter or space key is pressed (when onSelect is provided)", () => {
    const handleSelect = vi.fn();
    render(
      <MemoryRouter>
        <DeckGridCard {...defaultProps} onSelect={handleSelect} />
      </MemoryRouter>,
    );

    const container = screen.getByText("Stardust Dragon Deck").closest("div.cursor-pointer")!;

    // Press Space
    fireEvent.keyDown(container, { key: " " });
    expect(handleSelect).toHaveBeenCalledWith(42);

    // Press Enter
    handleSelect.mockClear();
    fireEvent.keyDown(container, { key: "Enter" });
    expect(handleSelect).toHaveBeenCalledWith(42);
  });

  it("renders deck title link and action buttons when showActions is true", () => {
    const handleDelete = vi.fn();
    render(
      <MemoryRouter>
        <DeckGridCard {...defaultProps} showActions={true} onDelete={handleDelete} />
      </MemoryRouter>,
    );

    // Deck title should be a native Link to deck details
    const deckLink = screen.getByRole("link", { name: "Stardust Dragon Deck" });
    expect(deckLink).toBeInTheDocument();
    expect(deckLink).toHaveAttribute("href", "/decks/42");

    // Edit link should be present
    const editLink = screen.getByTitle("Edit Deck");
    expect(editLink).toBeInTheDocument();
    expect(editLink).toHaveAttribute("href", "/decks/42/edit");

    // Delete button should be present and functional
    const deleteBtn = screen.getByTitle("Delete Deck");
    expect(deleteBtn).toBeInTheDocument();

    fireEvent.click(deleteBtn);
    expect(handleDelete).toHaveBeenCalledWith(42);
  });
});
