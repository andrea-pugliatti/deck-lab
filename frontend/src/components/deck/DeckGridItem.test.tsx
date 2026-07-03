import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router";
import { describe, expect, it } from "vitest";

import DeckGridItem from "./DeckGridItem";

describe("DeckGridItem component", () => {
  const defaultProps = {
    cardId: 501,
    name: "Dark Magician",
    type: "Spellcaster Monster",
    imageUrl: "images/dark_magician.jpg",
    quantity: 3,
  };

  it("renders card name, quantity, badge type, and image correctly", () => {
    render(
      <MemoryRouter>
        <DeckGridItem {...defaultProps} />
      </MemoryRouter>,
    );

    // Verify Link destination
    const linkElement = screen.getByRole("link");
    expect(linkElement).toHaveAttribute("href", "/cards/501");

    // Verify Name
    expect(screen.getByText("Dark Magician")).toBeInTheDocument();

    // Verify Quantity
    expect(screen.getByText("x3")).toBeInTheDocument();

    // Verify Badge (replacing " Monster" or " Card" from type string)
    // "Spellcaster Monster" becomes "Spellcaster"
    expect(screen.getByText("Spellcaster")).toBeInTheDocument();

    // Verify Image
    const img = screen.getByAltText("Dark Magician");
    expect(img).toBeInTheDocument();
    expect(img).toHaveAttribute("src", "/api/images/dark_magician.jpg");
  });

  it("renders fallback text if imageUrl is not provided", () => {
    render(
      <MemoryRouter>
        <DeckGridItem {...defaultProps} imageUrl={undefined} />
      </MemoryRouter>,
    );

    // No image tag should render
    expect(screen.queryByRole("img")).not.toBeInTheDocument();

    // Renders substring of name (first 3 chars): "Dar"
    expect(screen.getByText("[ Dar ]")).toBeInTheDocument();
  });

  it("handles missing type gracefully", () => {
    render(
      <MemoryRouter>
        <DeckGridItem cardId={502} name="Monster Reborn" quantity={1} />
      </MemoryRouter>,
    );

    // Badge should not be rendered
    expect(screen.queryByText(/Spellcaster/i)).not.toBeInTheDocument();
  });
});
