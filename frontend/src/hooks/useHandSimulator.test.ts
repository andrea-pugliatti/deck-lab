import { act, renderHook } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import type { Deck } from "../types";
import { useHandSimulator } from "./useHandSimulator";

describe("useHandSimulator hook", () => {
  const mockDeck: Deck = {
    id: 1,
    name: "Test Deck",
    description: "",
    formatName: "TCG",
    deckCards: [
      { cardId: 10, name: "Card 1", quantity: 3, section: "MAIN", type: "spell", imageUrl: "" },
      { cardId: 20, name: "Card 2", quantity: 2, section: "MAIN", type: "spell", imageUrl: "" },
    ],
    updatedAt: "2026-06-30T10:00:00Z",
  };

  it("should initialize empty state if deck is undefined", () => {
    const { result } = renderHook(() => useHandSimulator(undefined));

    expect(result.current.hand).toEqual([]);
    expect(result.current.remainingDeck).toEqual([]);
  });

  it("should initialize simulator zones on load", () => {
    const { result } = renderHook(() => useHandSimulator(mockDeck, 2));

    // Total 5 cards in main. Hand size = 2, remaining deck = 3
    expect(result.current.hand).toHaveLength(2);
    expect(result.current.remainingDeck).toHaveLength(3);
  });

  it("should support drawing cards", () => {
    const { result } = renderHook(() => useHandSimulator(mockDeck, 2));

    act(() => {
      result.current.draw(1);
    });

    expect(result.current.hand).toHaveLength(3);
    expect(result.current.remainingDeck).toHaveLength(2);
  });

  it("should support moving card to field and resetting", () => {
    const { result } = renderHook(() => useHandSimulator(mockDeck, 2));

    const card = result.current.hand[0];

    act(() => {
      result.current.moveCard(card, "field");
    });

    expect(result.current.hand).toHaveLength(1);
    expect(result.current.field).toEqual([card]);

    // reset simulator
    act(() => {
      result.current.reset(3);
    });

    expect(result.current.hand).toHaveLength(3);
    expect(result.current.field).toHaveLength(0);
  });

  it("should trigger shuffle dispatch", () => {
    const { result } = renderHook(() => useHandSimulator(mockDeck, 2));

    act(() => {
      result.current.shuffleDeck();
    });

    // Should retain the remaining count
    expect(result.current.remainingDeck).toHaveLength(3);
  });
});
