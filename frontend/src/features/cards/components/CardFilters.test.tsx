import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import type { CardAttribute, CardFiltersState, CardRace, CardType } from "../../../types";
import CardFilters from "./CardFilters";

describe("CardFilters component", () => {
  const defaultFilters: CardFiltersState = {
    type: "ALL",
    attribute: "ALL",
    race: "ALL",
    archetype: "ALL",
  };

  const mockTypes: CardType[] = [
    "Normal Monster" as CardType,
    "Spell Card" as CardType,
    "Trap Card" as CardType,
  ];
  const mockAttributes: CardAttribute[] = [
    "LIGHT" as CardAttribute,
    "DARK" as CardAttribute,
    "FIRE" as CardAttribute,
    "WATER" as CardAttribute,
  ];
  const mockRaces: CardRace[] = [
    "Spellcaster" as CardRace,
    "Dragon" as CardRace,
    "Normal" as CardRace,
    "Continuous" as CardRace,
    "Counter" as CardRace,
    "Quick-Play" as CardRace,
  ];
  const mockArchetypes = ["Blue-Eyes", "Dark Magician", "Elemental HERO"];

  it("renders filter controls and headings", () => {
    const handleChange = vi.fn();
    render(
      <CardFilters
        filters={defaultFilters}
        onChange={handleChange}
        types={mockTypes}
        attributes={mockAttributes}
        races={mockRaces}
        archetypes={mockArchetypes}
      />,
    );

    expect(screen.getByText(/catalog filters/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/card type/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/monster attribute/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/type \/ property/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/archetype group/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /clear filters/i })).toBeInTheDocument();
  });

  it("hides monster attribute filter when type is Spell", () => {
    const handleChange = vi.fn();
    render(
      <CardFilters
        filters={{ ...defaultFilters, type: "Spell Card" as CardType }}
        onChange={handleChange}
        types={mockTypes}
        attributes={mockAttributes}
        races={mockRaces}
        archetypes={mockArchetypes}
      />,
    );

    expect(screen.queryByLabelText(/monster attribute/i)).not.toBeInTheDocument();
  });

  it("hides monster attribute filter when type is Trap", () => {
    const handleChange = vi.fn();
    render(
      <CardFilters
        filters={{ ...defaultFilters, type: "Trap Card" as CardType }}
        onChange={handleChange}
        types={mockTypes}
        attributes={mockAttributes}
        races={mockRaces}
        archetypes={mockArchetypes}
      />,
    );

    expect(screen.queryByLabelText(/monster attribute/i)).not.toBeInTheDocument();
  });

  it("calls onChange when Card Type selection changes and resets race to ALL", () => {
    const handleChange = vi.fn();
    render(
      <CardFilters
        filters={defaultFilters}
        onChange={handleChange}
        types={mockTypes}
        attributes={mockAttributes}
        races={mockRaces}
        archetypes={mockArchetypes}
      />,
    );

    const select = screen.getByLabelText(/card type/i);
    fireEvent.change(select, { target: { value: "Spell Card" } });

    expect(handleChange).toHaveBeenCalledWith({
      type: "Spell Card",
      attribute: "ALL",
      race: "ALL",
      archetype: "ALL",
    });
  });

  it("calls onChange when Monster Attribute selection changes", () => {
    const handleChange = vi.fn();
    render(
      <CardFilters
        filters={{ ...defaultFilters, type: "Normal Monster" as CardType }}
        onChange={handleChange}
        types={mockTypes}
        attributes={mockAttributes}
        races={mockRaces}
        archetypes={mockArchetypes}
      />,
    );

    const select = screen.getByLabelText(/monster attribute/i);
    fireEvent.change(select, { target: { value: "DARK" } });

    expect(handleChange).toHaveBeenCalledWith({
      type: "Normal Monster",
      attribute: "DARK",
      race: "ALL",
      archetype: "ALL",
    });
  });

  it("calls onChange when Type/Property selection changes", () => {
    const handleChange = vi.fn();
    render(
      <CardFilters
        filters={defaultFilters}
        onChange={handleChange}
        types={mockTypes}
        attributes={mockAttributes}
        races={mockRaces}
        archetypes={mockArchetypes}
      />,
    );

    const select = screen.getByLabelText(/type \/ property/i);
    fireEvent.change(select, { target: { value: "Dragon" } });

    expect(handleChange).toHaveBeenCalledWith({
      type: "ALL",
      attribute: "ALL",
      race: "Dragon",
      archetype: "ALL",
    });
  });

  it("calls onChange when Archetype selection changes", () => {
    const handleChange = vi.fn();
    render(
      <CardFilters
        filters={defaultFilters}
        onChange={handleChange}
        types={mockTypes}
        attributes={mockAttributes}
        races={mockRaces}
        archetypes={mockArchetypes}
      />,
    );

    const select = screen.getByLabelText(/archetype group/i);
    fireEvent.change(select, { target: { value: "Blue-Eyes" } });

    expect(handleChange).toHaveBeenCalledWith({
      type: "ALL",
      attribute: "ALL",
      race: "ALL",
      archetype: "Blue-Eyes",
    });
  });

  it("calls onChange with ALL values when Clear Filters button is clicked", () => {
    const handleChange = vi.fn();
    render(
      <CardFilters
        filters={{
          type: "Normal Monster" as CardType,
          attribute: "LIGHT" as CardAttribute,
          race: "Dragon" as CardRace,
          archetype: "Blue-Eyes",
        }}
        onChange={handleChange}
        types={mockTypes}
        attributes={mockAttributes}
        races={mockRaces}
        archetypes={mockArchetypes}
      />,
    );

    const button = screen.getByRole("button", { name: /clear filters/i });
    fireEvent.click(button);

    expect(handleChange).toHaveBeenCalledWith({
      type: "ALL",
      attribute: "ALL",
      race: "ALL",
      archetype: "ALL",
    });
  });

  it("filters races properly based on selectedType = Spell", () => {
    render(
      <CardFilters
        filters={{ ...defaultFilters, type: "Spell Card" as CardType }}
        onChange={vi.fn()}
        types={mockTypes}
        attributes={mockAttributes}
        races={[
          "Dragon" as CardRace,
          "Spellcaster" as CardRace,
          "Quick-Play" as CardRace,
          "Normal" as CardRace,
          "Continuous" as CardRace,
          "Counter" as CardRace,
        ]}
        archetypes={mockArchetypes}
      />,
    );

    // Spell properties: Normal, Field, Equip, Continuous, Quick-Play, Ritual
    // Of the ones provided: "Normal", "Continuous", "Quick-Play" are spells.
    // "Dragon", "Spellcaster", "Counter" should be filtered out.
    const select = screen.getByLabelText(/property/i);
    const options = Array.from(select.querySelectorAll("option")).map((opt) => opt.value);

    expect(options).toContain("ALL");
    expect(options).toContain("Normal");
    expect(options).toContain("Continuous");
    expect(options).toContain("Quick-Play");
    expect(options).not.toContain("Dragon");
    expect(options).not.toContain("Spellcaster");
    expect(options).not.toContain("Counter");
  });

  it("filters races properly based on selectedType = Trap", () => {
    render(
      <CardFilters
        filters={{ ...defaultFilters, type: "Trap Card" as CardType }}
        onChange={vi.fn()}
        types={mockTypes}
        attributes={mockAttributes}
        races={[
          "Dragon" as CardRace,
          "Spellcaster" as CardRace,
          "Quick-Play" as CardRace,
          "Normal" as CardRace,
          "Continuous" as CardRace,
          "Counter" as CardRace,
        ]}
        archetypes={mockArchetypes}
      />,
    );

    // Trap properties: Normal, Continuous, Counter
    // Of the ones provided: "Normal", "Continuous", "Counter" are traps.
    // "Dragon", "Spellcaster", "Quick-Play" should be filtered out.
    const select = screen.getByLabelText(/property/i);
    const options = Array.from(select.querySelectorAll("option")).map((opt) => opt.value);

    expect(options).toContain("ALL");
    expect(options).toContain("Normal");
    expect(options).toContain("Continuous");
    expect(options).toContain("Counter");
    expect(options).not.toContain("Dragon");
    expect(options).not.toContain("Spellcaster");
    expect(options).not.toContain("Quick-Play");
  });

  it("filters races properly based on selectedType = Monster", () => {
    render(
      <CardFilters
        filters={{ ...defaultFilters, type: "Normal Monster" as CardType }}
        onChange={vi.fn()}
        types={mockTypes}
        attributes={mockAttributes}
        races={["Dragon", "Spellcaster", "Quick-Play", "Normal", "Continuous", "Counter"]}
        archetypes={mockArchetypes}
      />,
    );

    // Monster races should exclude spell/trap properties
    // From: ["Dragon", "Spellcaster", "Quick-Play", "Normal", "Continuous", "Counter"]
    // Spell properties: "Normal", "Field", "Equip", "Continuous", "Quick-Play", "Ritual"
    // Trap properties: "Normal", "Continuous", "Counter"
    // Valid monster races: "Dragon", "Spellcaster"
    const select = screen.getByLabelText(/monster type \(race\)/i);
    const options = Array.from(select.querySelectorAll("option")).map((opt) => opt.value);

    expect(options).toContain("ALL");
    expect(options).toContain("Dragon");
    expect(options).toContain("Spellcaster");
    expect(options).not.toContain("Quick-Play");
    expect(options).not.toContain("Normal");
    expect(options).not.toContain("Continuous");
    expect(options).not.toContain("Counter");
  });
});
