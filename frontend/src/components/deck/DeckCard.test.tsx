import { fireEvent, render, screen } from "@testing-library/react";
import { MemoryRouter, useNavigate } from "react-router";
import { beforeEach, describe, expect, it, vi } from "vitest";

import DeckCard from "./DeckCard";

// Mock useNavigate from react-router
vi.mock("react-router", async (importOriginal) => {
  const actual = await importOriginal<typeof import("react-router")>();
  return {
    ...actual,
    useNavigate: vi.fn(),
  };
});

describe("DeckCard component", () => {
  const navigateMock = vi.fn();

  beforeEach(() => {
    navigateMock.mockReset();
    vi.mocked(useNavigate).mockReturnValue(navigateMock);
  });

  const defaultProps = {
    id: 42,
    name: "Stardust Dragon Deck",
    description: "A deck centered around synchro summoning Stardust Dragon.",
    formatName: "TCG",
    cardCount: 40,
    creatorUsername: "yusei_fudo",
    updatedAt: new Date(Date.now() - 3600000).toISOString(), // 1 hour ago
  };

  it("renders basic deck details correctly", () => {
    render(
      <MemoryRouter>
        <DeckCard {...defaultProps} />
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
        <DeckCard id={12} name="Simple Deck" formatName="Speed Duel" cardCount={20} />
      </MemoryRouter>,
    );

    expect(screen.getByText("No description provided.")).toBeInTheDocument();
    expect(screen.getByText("by Community")).toBeInTheDocument();
  });

  it("renders as a Link to the deck detail page by default", () => {
    render(
      <MemoryRouter>
        <DeckCard {...defaultProps} />
      </MemoryRouter>,
    );

    const linkElement = screen.getByRole("link");
    expect(linkElement).toHaveAttribute("href", "/decks/42");
  });

  it("renders select button and calls onSelect when clicked", () => {
    const handleSelect = vi.fn();
    render(
      <MemoryRouter>
        <DeckCard {...defaultProps} onSelect={handleSelect} />
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
        <DeckCard {...defaultProps} onSelect={handleSelect} />
      </MemoryRouter>,
    );

    const container = screen.getByRole("button", { name: /stardust dragon deck/i });
    fireEvent.click(container);
    expect(handleSelect).toHaveBeenCalledWith(42);
  });

  it("navigates to deck page when container is clicked (when showActions is true)", () => {
    render(
      <MemoryRouter>
        <DeckCard {...defaultProps} showActions={true} />
      </MemoryRouter>,
    );

    const container = screen.getByRole("button", { name: /stardust dragon deck/i });
    fireEvent.click(container);

    expect(navigateMock).toHaveBeenCalledWith("/decks/42", { viewTransition: true });
  });

  it("navigates when enter or space key is pressed on container", () => {
    render(
      <MemoryRouter>
        <DeckCard {...defaultProps} showActions={true} />
      </MemoryRouter>,
    );

    const container = screen.getByRole("button", { name: /stardust dragon deck/i });

    // Press Space
    fireEvent.keyDown(container, { key: " " });
    expect(navigateMock).toHaveBeenCalledWith("/decks/42", { viewTransition: true });

    // Press Enter
    navigateMock.mockClear();
    fireEvent.keyDown(container, { key: "Enter" });
    expect(navigateMock).toHaveBeenCalledWith("/decks/42", { viewTransition: true });
  });

  it("renders action buttons and calls onDelete when delete button is clicked", () => {
    const handleDelete = vi.fn();
    render(
      <MemoryRouter>
        <DeckCard {...defaultProps} showActions={true} onDelete={handleDelete} />
      </MemoryRouter>,
    );

    // Edit link should be present
    const editLink = screen.getByTitle("Edit Deck");
    expect(editLink).toBeInTheDocument();
    expect(editLink).toHaveAttribute("href", "/decks/42/edit");

    // Delete button should be present
    const deleteBtn = screen.getByTitle("Delete Deck");
    expect(deleteBtn).toBeInTheDocument();

    fireEvent.click(deleteBtn);
    expect(handleDelete).toHaveBeenCalledWith(42);
    // Click on delete should stop propagation and not navigate
    expect(navigateMock).not.toHaveBeenCalled();
  });

  it("does not navigate when edit link is clicked", () => {
    render(
      <MemoryRouter>
        <DeckCard {...defaultProps} showActions={true} />
      </MemoryRouter>,
    );

    const editLink = screen.getByTitle("Edit Deck");
    fireEvent.click(editLink);

    // Click on edit should stop propagation and not navigate using useNavigate
    expect(navigateMock).not.toHaveBeenCalled();
  });
});
