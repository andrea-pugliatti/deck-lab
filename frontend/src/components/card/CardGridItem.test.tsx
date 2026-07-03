import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router";
import { describe, expect, it } from "vitest";

import type { Card } from "../../types";
import CardGridItem from "./CardGridItem";

describe("CardGridItem component", () => {
  const monsterCard: Card = {
    id: 101,
    name: "Blue-Eyes White Dragon",
    type: "Normal Monster",
    description: "This legendary dragon is a powerful engine of destruction.",
    race: "Dragon",
    attribute: "LIGHT",
    level: 8,
    atk: 3000,
    def: 2500,
    imageUrlCropped: "images/blue_eyes.jpg",
  };

  const spellCard: Card = {
    id: 201,
    name: "Monster Reborn",
    type: "Normal Spell Card",
    description: "Target 1 monster in either GY; Special Summon it.",
    race: "Normal",
    attribute: "SPELL",
  };

  it("renders a monster card correctly", () => {
    render(
      <MemoryRouter>
        <CardGridItem {...monsterCard} />
      </MemoryRouter>,
    );

    // Check link to correct path
    const linkElement = screen.getByRole("link");
    expect(linkElement).toHaveAttribute("href", "/cards/101");

    // Check name and type
    expect(screen.getByText("Blue-Eyes White Dragon")).toBeInTheDocument();
    expect(screen.getByText("Normal Monster")).toBeInTheDocument();
    expect(screen.getByText(/legendary dragon/i)).toBeInTheDocument();

    // Check attribute and level
    expect(screen.getByText("LIGHT")).toBeInTheDocument();
    expect(screen.getByText("8")).toBeInTheDocument();

    // Check ATK and DEF
    expect(screen.getByText("ATK: 3000")).toBeInTheDocument();
    expect(screen.getByText("DEF: 2500")).toBeInTheDocument();

    // Check image
    const img = screen.getByAltText("Blue-Eyes White Dragon");
    expect(img).toBeInTheDocument();
    expect(img).toHaveAttribute("src", "/api/images/blue_eyes.jpg");
  });

  it("renders a spell card correctly", () => {
    render(
      <MemoryRouter>
        <CardGridItem {...spellCard} />
      </MemoryRouter>,
    );

    // Check link to correct path
    const linkElement = screen.getByRole("link");
    expect(linkElement).toHaveAttribute("href", "/cards/201");

    // Check name and type
    expect(screen.getByText("Monster Reborn")).toBeInTheDocument();
    expect(screen.getByText("Normal Spell Card")).toBeInTheDocument();
    expect(screen.getByText(/Target 1 monster/i)).toBeInTheDocument();

    // Check that level and ATK/DEF are NOT rendered
    expect(screen.queryByText("ATK:")).not.toBeInTheDocument();
    expect(screen.queryByText("DEF:")).not.toBeInTheDocument();
    expect(screen.getByText("SPELL")).toBeInTheDocument();
  });

  it("renders fallback text if imageUrlCropped is not provided", () => {
    const cardWithoutImage: Card = {
      ...monsterCard,
      imageUrlCropped: undefined,
      archetype: "Blue-Eyes",
    };

    render(
      <MemoryRouter>
        <CardGridItem {...cardWithoutImage} />
      </MemoryRouter>,
    );

    // No image tag should be rendered
    expect(screen.queryByRole("img")).not.toBeInTheDocument();

    // Check fallback text which should use archetype
    expect(screen.getByText("[ Blue-Eyes ]")).toBeInTheDocument();
  });

  it("renders fallback text with race if archetype and imageUrlCropped are missing", () => {
    const cardWithoutImageOrArchetype: Card = {
      ...monsterCard,
      imageUrlCropped: undefined,
      archetype: undefined,
    };

    render(
      <MemoryRouter>
        <CardGridItem {...cardWithoutImageOrArchetype} />
      </MemoryRouter>,
    );

    expect(screen.getByText("[ Dragon ]")).toBeInTheDocument();
  });

  it("renders fallback text '[ Artwork ]' if image, archetype, and race are missing", () => {
    const cardMinimal: Card = {
      id: 999,
      name: "Mystery Card",
      type: "Unknown",
      description: "Something mysterious",
      race: "",
      attribute: "",
    };

    render(
      <MemoryRouter>
        <CardGridItem {...cardMinimal} />
      </MemoryRouter>,
    );

    expect(screen.getByText("[ Artwork ]")).toBeInTheDocument();
  });

  it("renders '?' for ATK or DEF if they are -1", () => {
    const questionCard: Card = {
      ...monsterCard,
      atk: -1,
      def: -1,
    };

    render(
      <MemoryRouter>
        <CardGridItem {...questionCard} />
      </MemoryRouter>,
    );

    expect(screen.getByText("ATK: ?")).toBeInTheDocument();
    expect(screen.getByText("DEF: ?")).toBeInTheDocument();
  });
});
