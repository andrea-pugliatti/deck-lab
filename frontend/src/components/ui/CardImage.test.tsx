import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import CardImage from "./CardImage";

describe("CardImage component", () => {
  it("renders image tag with normalized URL when src is provided", () => {
    render(<CardImage src="images/blue_eyes.jpg" alt="Blue-Eyes White Dragon" />);

    const img = screen.getByAltText("Blue-Eyes White Dragon");
    expect(img).toBeInTheDocument();
    expect(img).toHaveAttribute("src", "/api/images/blue_eyes.jpg");
    expect(img).toHaveClass("size-full object-cover");
  });

  it("handles external and prefixed URLs correctly", () => {
    const { rerender } = render(
      <CardImage src="https://images.ygoprodeck.com/card.jpg" alt="External Card" />,
    );
    expect(screen.getByAltText("External Card")).toHaveAttribute(
      "src",
      "https://images.ygoprodeck.com/card.jpg",
    );

    rerender(<CardImage src="/api/cards/1.jpg" alt="Prefixed Card" />);
    expect(screen.getByAltText("Prefixed Card")).toHaveAttribute("src", "/api/cards/1.jpg");

    rerender(<CardImage src="/cards/1.jpg" alt="Slash Card" />);
    expect(screen.getByAltText("Slash Card")).toHaveAttribute("src", "/api/cards/1.jpg");
  });

  it("renders standardized [ No Artwork ] fallback when src is absent or empty", () => {
    const { rerender } = render(<CardImage src={undefined} alt="Blue-Eyes White Dragon" />);

    expect(screen.queryByRole("img")).not.toBeInTheDocument();
    const fallbackText = screen.getByText("[ No Artwork ]");
    expect(fallbackText).toBeInTheDocument();
    expect(fallbackText).toHaveClass("sr-only", "@[72px]:not-sr-only", "whitespace-nowrap");
    expect(screen.getByTestId("card-fallback")).toBeInTheDocument();

    rerender(<CardImage src="" alt="Blue-Eyes White Dragon" />);
    expect(screen.getByText("[ No Artwork ]")).toBeInTheDocument();
  });

  it("switches to standardized fallback when image triggers an error", () => {
    const onError = vi.fn();
    render(<CardImage src="images/broken.jpg" alt="Dark Magician" onError={onError} />);

    const img = screen.getByAltText("Dark Magician");
    expect(img).toBeInTheDocument();

    fireEvent.error(img);

    expect(onError).toHaveBeenCalledTimes(1);
    expect(screen.queryByRole("img")).not.toBeInTheDocument();
    expect(screen.getByText("[ No Artwork ]")).toBeInTheDocument();
  });

  it("renders custom ReactNode fallback when provided", () => {
    render(
      <CardImage
        src={undefined}
        alt="Custom Card"
        fallback={<div data-testid="custom-fallback">Custom Artwork Placeholder</div>}
      />,
    );

    expect(screen.getByTestId("custom-fallback")).toBeInTheDocument();
    expect(screen.getByText("Custom Artwork Placeholder")).toBeInTheDocument();
  });

  it("resets error state when src changes", () => {
    const { rerender } = render(<CardImage src="images/bad.jpg" alt="Test Card" />);

    const img = screen.getByAltText("Test Card");
    fireEvent.error(img);
    expect(screen.getByText("[ No Artwork ]")).toBeInTheDocument();

    // Rerender with a new valid src
    rerender(<CardImage src="images/good.jpg" alt="Test Card" />);
    const newImg = screen.getByAltText("Test Card");
    expect(newImg).toBeInTheDocument();
    expect(newImg).toHaveAttribute("src", "/api/images/good.jpg");
  });

  it("forwards attributes like loading, decoding, and className", () => {
    render(
      <CardImage
        src="images/card.jpg"
        alt="Card"
        loading="lazy"
        decoding="sync"
        className="custom-img-class"
      />,
    );

    const img = screen.getByAltText("Card");
    expect(img).toHaveAttribute("loading", "lazy");
    expect(img).toHaveAttribute("decoding", "sync");
    expect(img).toHaveClass("custom-img-class");
  });
});
