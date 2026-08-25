import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi, beforeEach } from "vitest";

import type { CardAttribute, CardFiltersState, CardRace, CardType } from "../../../types";
import DeckBuilderFilters from "./DeckBuilderFilters";

describe("DeckBuilderFilters component", () => {
  const mockSetSearchQuery = vi.fn();
  const mockSetFilters = vi.fn();

  const defaultFilters: CardFiltersState = {
    type: "ALL",
    attribute: "ALL",
    race: "ALL",
    archetype: "ALL",
  };

  const types: CardType[] = [
    "Normal Monster" as CardType,
    "Spell Card" as CardType,
    "Trap Card" as CardType,
  ];
  const attributes: CardAttribute[] = ["LIGHT" as CardAttribute, "DARK" as CardAttribute];
  const races: CardRace[] = [
    "Dragon" as CardRace,
    "Spellcaster" as CardRace,
    "Continuous" as CardRace,
    "Counter" as CardRace,
    "Quick-Play" as CardRace,
  ];
  const archetypes = ["Blue-Eyes", "Dark Magician"];

  beforeEach(() => {
    mockSetSearchQuery.mockReset();
    mockSetFilters.mockReset();
  });

  it("should render all select inputs and search field", () => {
    render(
      <DeckBuilderFilters
        searchQuery="dragon"
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
    expect(searchInput).toHaveValue("dragon");

    const selects = screen.getAllByRole("combobox");
    expect(selects).toHaveLength(4); // type, attribute, race, archetype
  });

  it("should handle search input change", () => {
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
    fireEvent.change(searchInput, { target: { value: "blue-eyes" } });
    expect(mockSetSearchQuery).toHaveBeenCalledWith("blue-eyes");
  });

  it("should handle filter select changes", () => {
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

    const selects = screen.getAllByRole("combobox");

    // Change type
    fireEvent.change(selects[0]!, { target: { value: "Spell Card" } });
    expect(mockSetFilters).toHaveBeenCalled();

    // Change archetype
    fireEvent.change(selects[3]!, { target: { value: "Blue-Eyes" } });
    expect(mockSetFilters).toHaveBeenCalledTimes(2);
  });

  it("should disable Attribute select and reset race when Type is Spell or Trap", () => {
    mockSetFilters.mockClear();
    const spellFilters: CardFiltersState = {
      ...defaultFilters,
      type: "Spell Card" as CardType,
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

    expect(container.querySelectorAll("select")[1]).toBeDisabled();

    // Rerender with type = Normal Monster
    const monsterFilters: CardFiltersState = {
      ...defaultFilters,
      type: "Normal Monster" as CardType,
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
    const spellFilters: CardFiltersState = {
      ...defaultFilters,
      type: "Spell Card" as CardType,
    };

    const { rerender } = render(
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

    expect(screen.queryByText("Dragon")).not.toBeInTheDocument();
    expect(screen.queryByText("Counter")).not.toBeInTheDocument();
    expect(screen.getByText("Continuous")).toBeInTheDocument();
    expect(screen.getByText("Quick-Play")).toBeInTheDocument();

    const trapFilters: CardFiltersState = {
      ...defaultFilters,
      type: "Trap Card" as CardType,
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

    const monsterFilters: CardFiltersState = {
      ...defaultFilters,
      type: "Normal Monster" as CardType,
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

    fireEvent.change(container.querySelectorAll("select")[0]!, {
      target: { value: "Normal Monster" },
    });

    // The setFilters updater function is called
    expect(setFiltersMock).toHaveBeenCalledTimes(1);
    expect(currentFilters).toEqual({
      type: "Normal Monster",
      attribute: "ALL",
      race: "ALL",
      archetype: "ALL",
    });
  });
});
