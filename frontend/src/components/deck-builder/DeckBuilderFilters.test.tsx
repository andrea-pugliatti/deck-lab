import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import type { CardFiltersState } from "../../types";
import DeckBuilderFilters from "./DeckBuilderFilters";

describe("DeckBuilderFilters component", () => {
  const defaultFilters: CardFiltersState = {
    type: "ALL",
    attribute: "ALL",
    race: "ALL",
    archetype: "ALL",
  };

  const mockSetSearchQuery = vi.fn();
  const mockSetFilters = vi.fn();

  const types = ["Monster", "Spell", "Trap"];
  const attributes = ["LIGHT", "DARK", "FIRE"];
  const races = ["Dragon", "Spellcaster", "Continuous", "Counter", "Quick-Play"];
  const archetypes = ["Blue-Eyes", "Dark Magician"];

  it("should render filter inputs and options correctly", () => {
    const { container } = render(
      <DeckBuilderFilters
        searchQuery=""
        setSearchQuery={mockSetSearchQuery}
        filters={defaultFilters}
        setFilters={mockSetFilters}
        types={types}
        attributes={attributes}
        races={races}
        archetypes={archetypes}
      />,
    );

    expect(screen.getByPlaceholderText("Search catalog by name...")).toBeInTheDocument();
    const selects = container.querySelectorAll("select");
    expect(selects.length).toBe(4);
  });

  it("should trigger setSearchQuery when typing in the search box", () => {
    mockSetSearchQuery.mockClear();
    render(
      <DeckBuilderFilters
        searchQuery=""
        setSearchQuery={mockSetSearchQuery}
        filters={defaultFilters}
        setFilters={mockSetFilters}
        types={types}
        attributes={attributes}
        races={races}
        archetypes={archetypes}
      />,
    );

    const searchInput = screen.getByPlaceholderText("Search catalog by name...");
    fireEvent.change(searchInput, { target: { value: "Blue-Eyes" } });

    expect(mockSetSearchQuery).toHaveBeenCalledWith("Blue-Eyes");
  });

  it("should call setFilters when attribute, race, or archetype filters change", () => {
    mockSetFilters.mockClear();
    const { container } = render(
      <DeckBuilderFilters
        searchQuery=""
        setSearchQuery={mockSetSearchQuery}
        filters={defaultFilters}
        setFilters={mockSetFilters}
        types={types}
        attributes={attributes}
        races={races}
        archetypes={archetypes}
      />,
    );

    const selects = container.querySelectorAll("select");

    // Change Attribute (index 1)
    fireEvent.change(selects[1], { target: { value: "LIGHT" } });
    expect(mockSetFilters).toHaveBeenCalledTimes(1);

    // Change Archetype (index 3)
    fireEvent.change(selects[3], { target: { value: "Blue-Eyes" } });
    expect(mockSetFilters).toHaveBeenCalledTimes(2);
  });

  it("should disable Attribute select and reset race when Type is Spell or Trap", () => {
    mockSetFilters.mockClear();
    const spellFilters: CardFiltersState = {
      ...defaultFilters,
      type: "Spell",
    };

    const { container, rerender } = render(
      <DeckBuilderFilters
        searchQuery=""
        setSearchQuery={mockSetSearchQuery}
        filters={spellFilters}
        setFilters={mockSetFilters}
        types={types}
        attributes={attributes}
        races={races}
        archetypes={archetypes}
      />,
    );

    // Attribute select (index 1) should be disabled for Spell
    expect(container.querySelectorAll("select")[1]).toBeDisabled();

    // Rerender with type = Monster
    const monsterFilters: CardFiltersState = {
      ...defaultFilters,
      type: "Monster",
    };
    rerender(
      <DeckBuilderFilters
        searchQuery=""
        setSearchQuery={mockSetSearchQuery}
        filters={monsterFilters}
        setFilters={mockSetFilters}
        types={types}
        attributes={attributes}
        races={races}
        archetypes={archetypes}
      />,
    );
    expect(container.querySelectorAll("select")[1]).not.toBeDisabled();
  });

  it("should filter races based on type (Spell, Trap, Monster)", () => {
    // When Type is Spell, race options should only contain Spell properties: Quick-Play, Continuous, Ritual, Normal, Field, Equip
    const spellFilters: CardFiltersState = {
      ...defaultFilters,
      type: "Spell",
    };

    const { rerender } = render(
      <DeckBuilderFilters
        searchQuery=""
        setSearchQuery={mockSetSearchQuery}
        filters={spellFilters}
        setFilters={mockSetFilters}
        types={types}
        attributes={attributes}
        races={races} // races: ["Dragon", "Spellcaster", "Continuous", "Counter", "Quick-Play"]
        archetypes={archetypes}
      />,
    );

    // Quick-Play, Continuous are spell properties in spellProperties.
    // Counter is a trap property. Dragon and Spellcaster are monster properties.
    expect(screen.queryByText("Dragon")).not.toBeInTheDocument();
    expect(screen.queryByText("Counter")).not.toBeInTheDocument();
    expect(screen.getByText("Continuous")).toBeInTheDocument();
    expect(screen.getByText("Quick-Play")).toBeInTheDocument();

    // When Type is Trap, it should only contain Trap properties (Counter, Continuous, Normal)
    const trapFilters: CardFiltersState = {
      ...defaultFilters,
      type: "Trap",
    };
    rerender(
      <DeckBuilderFilters
        searchQuery=""
        setSearchQuery={mockSetSearchQuery}
        filters={trapFilters}
        setFilters={mockSetFilters}
        types={types}
        attributes={attributes}
        races={races}
        archetypes={archetypes}
      />,
    );
    expect(screen.queryByText("Dragon")).not.toBeInTheDocument();
    expect(screen.queryByText("Quick-Play")).not.toBeInTheDocument();
    expect(screen.getByText("Counter")).toBeInTheDocument();
    expect(screen.getByText("Continuous")).toBeInTheDocument();

    // When Type is Monster, it should filter out spell/trap properties
    const monsterFilters: CardFiltersState = {
      ...defaultFilters,
      type: "Monster",
    };
    rerender(
      <DeckBuilderFilters
        searchQuery=""
        setSearchQuery={mockSetSearchQuery}
        filters={monsterFilters}
        setFilters={mockSetFilters}
        types={types}
        attributes={attributes}
        races={races}
        archetypes={archetypes}
      />,
    );
    expect(screen.getByText("Dragon")).toBeInTheDocument();
    expect(screen.getByText("Spellcaster")).toBeInTheDocument();
    expect(screen.queryByText("Quick-Play")).not.toBeInTheDocument();
    expect(screen.queryByText("Counter")).not.toBeInTheDocument();
  });

  it("should reset race filter to ALL when changing type", () => {
    let currentFilters = defaultFilters;
    const setFiltersMock = vi.fn((updater) => {
      if (typeof updater === "function") {
        currentFilters = updater(currentFilters);
      } else {
        currentFilters = updater;
      }
    });

    const { container } = render(
      <DeckBuilderFilters
        searchQuery=""
        setSearchQuery={mockSetSearchQuery}
        filters={currentFilters}
        setFilters={setFiltersMock}
        types={types}
        attributes={attributes}
        races={races}
        archetypes={archetypes}
      />,
    );

    fireEvent.change(container.querySelectorAll("select")[0], { target: { value: "Monster" } });

    // The setFilters updater function is called
    expect(setFiltersMock).toHaveBeenCalledTimes(1);
    expect(currentFilters).toEqual({
      type: "Monster",
      attribute: "ALL",
      race: "ALL",
      archetype: "ALL",
    });
  });
});
