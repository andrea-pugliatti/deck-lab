import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import type { Card } from "../types";
import HeroCardShowcase from "./HeroCardShowcase";

describe("HeroCardShowcase component", () => {
  const mockCards: Card[] = [
    {
      id: 1,
      name: "Blue-Eyes White Dragon",
      type: "Normal Monster",
      description: "Legendary dragon",
      attribute: "LIGHT",
      race: "Dragon",
      level: 8,
      atk: 3000,
      def: 2500,
      imageUrl: "",
      imageUrlCropped: "",
    },
    {
      id: 2,
      name: "Raigeki",
      type: "Spell Card",
      description: "Destroy monsters",
      attribute: "SPELL",
      race: "Normal",
      imageUrl: "",
      imageUrlCropped: "",
    },
  ];

  it("should return null if loading is false and cards is empty", () => {
    const { container } = render(<HeroCardShowcase cards={[]} loading={false} />);
    expect(container.firstChild).toBeNull();
  });

  it("should render cards list with corresponding attributes and level stars", () => {
    render(<HeroCardShowcase cards={mockCards} loading={false} />);

    expect(screen.getByText("Blue-Eyes White Dragon")).toBeInTheDocument();
    expect(screen.getByText("LIGHT")).toBeInTheDocument();
    expect(screen.getByText("Raigeki")).toBeInTheDocument();
    expect(screen.getByText("Spell Card")).toBeInTheDocument();

    // Check stats
    expect(screen.getByText("ATK:")).toBeInTheDocument();
    expect(screen.getByText("3000")).toBeInTheDocument();
  });

  it("should apply mouse rotation styles when mouse moves over container", () => {
    const { container } = render(<HeroCardShowcase cards={mockCards} loading={false} />);
    const div = container.firstChild as HTMLDivElement;

    // Trigger mouseMove with specific offsets
    fireEvent.mouseMove(div, { clientX: 100, clientY: 100 });
    // Style check
    const innerContainer = div.firstChild as HTMLDivElement;
    expect(innerContainer.style.transform).toContain("rotateX");
    expect(innerContainer.style.transform).toContain("rotateY");

    // Mouse leave should reset rotation
    fireEvent.mouseLeave(div);
    expect(innerContainer.style.transform).toBe("rotateX(0deg) rotateY(0deg)");
  });
});
