import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import DeckFormHeader from "./DeckFormHeader";

describe("DeckFormHeader component", () => {
  const mockSetName = vi.fn();
  const mockSetDescription = vi.fn();
  const mockSetFormatName = vi.fn();
  const formats = ["TCG", "OCG", "Goat", "Speed Duel"];

  it("should render form inputs with correct values", () => {
    const { container } = render(
      <DeckFormHeader
        name="My Awesome Deck"
        setName={mockSetName}
        description="A great strategy"
        setDescription={mockSetDescription}
        formatName="TCG"
        setFormatName={mockSetFormatName}
        formats={formats}
      />,
    );

    expect(screen.getByPlaceholderText("Enter deck name...")).toHaveValue("My Awesome Deck");
    expect(container.querySelector("select")).toHaveValue("TCG");
    expect(
      screen.getByPlaceholderText("Write notes about your deck build, key combos, or strategy..."),
    ).toHaveValue("A great strategy");

    // formats options
    formats.forEach((f) => {
      expect(screen.getByRole("option", { name: f })).toBeInTheDocument();
    });
  });

  it("should display the character counter with the correct length", () => {
    render(
      <DeckFormHeader
        name="Test Deck"
        setName={mockSetName}
        description="A great strategy"
        setDescription={mockSetDescription}
        formatName="TCG"
        setFormatName={mockSetFormatName}
        formats={formats}
      />,
    );

    expect(screen.getByText("16 / 255")).toBeInTheDocument();
  });

  it("should trigger callbacks when changing values", () => {
    mockSetName.mockClear();
    mockSetDescription.mockClear();
    mockSetFormatName.mockClear();

    const { container } = render(
      <DeckFormHeader
        name=""
        setName={mockSetName}
        description=""
        setDescription={mockSetDescription}
        formatName="TCG"
        setFormatName={mockSetFormatName}
        formats={formats}
      />,
    );

    // change name
    fireEvent.change(screen.getByPlaceholderText("Enter deck name..."), {
      target: { value: "New Deck Name" },
    });
    expect(mockSetName).toHaveBeenCalledWith("New Deck Name");

    // change description
    fireEvent.change(
      screen.getByPlaceholderText("Write notes about your deck build, key combos, or strategy..."),
      {
        target: { value: "New description" },
      },
    );
    expect(mockSetDescription).toHaveBeenCalledWith("New description");

    // change format
    fireEvent.change(container.querySelector("select")!, {
      target: { value: "Goat" },
    });
    expect(mockSetFormatName).toHaveBeenCalledWith("Goat");
  });
});
