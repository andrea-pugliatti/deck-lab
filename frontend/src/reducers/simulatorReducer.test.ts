import { describe, expect, it, vi } from "vitest";

import type { Deck, SimulatorCardInstance } from "../types";
import { initialSimulatorState, simulatorReducer, type SimulatorState } from "./simulatorReducer";

describe("simulatorReducer", () => {
  const mockDeck: Deck = {
    id: 1,
    name: "Test Deck",
    description: "A test deck",
    formatName: "TCG",
    deckCards: [
      { cardId: 101, name: "Card A", quantity: 3, section: "MAIN", type: "Monster", imageUrl: "" },
      { cardId: 102, name: "Card B", quantity: 2, section: "MAIN", type: "Spell", imageUrl: "" },
      { cardId: 103, name: "Card C", quantity: 1, section: "SIDE", type: "Trap", imageUrl: "" },
    ],
    updatedAt: "",
  };

  it("should return the state unchanged if action type is unknown", () => {
    // @ts-expect-error testing invalid action type
    const state = simulatorReducer(initialSimulatorState, { type: "UNKNOWN_ACTION" });
    expect(state).toEqual(initialSimulatorState);
  });

  it("should handle INIT (loads main deck cards and shuffles)", () => {
    // Mock Math.random to make shuffle deterministic
    const randomSpy = vi.spyOn(Math, "random").mockReturnValue(0.5);

    const state = simulatorReducer(initialSimulatorState, {
      type: "INIT",
      deck: mockDeck,
      initialHandSize: 2,
    });

    // Total main deck cards = 3 (Card A) + 2 (Card B) = 5 cards.
    // 2 should go to hand, 3 remaining in deck.
    expect(state.hand).toHaveLength(2);
    expect(state.remainingDeck).toHaveLength(3);
    expect(state.field).toHaveLength(0);
    expect(state.graveyard).toHaveLength(0);
    expect(state.banished).toHaveLength(0);

    // Each simulator card should have a uniqId
    state.hand.forEach((card) => {
      expect(card.uniqId).toBeDefined();
    });

    randomSpy.mockRestore();
  });

  it("should return initial state on INIT if deck is invalid", () => {
    const state = simulatorReducer(initialSimulatorState, {
      type: "INIT",
      deck: null,
      initialHandSize: 5,
    });
    expect(state).toEqual(initialSimulatorState);
  });

  it("should handle CLEAR", () => {
    const activeState: SimulatorState = {
      hand: [
        {
          cardId: 1,
          uniqId: "1-0-1",
          name: "Card",
          quantity: 1,
          type: "spell",
          imageUrl: "",
          section: "MAIN",
        },
      ],
      field: [],
      graveyard: [],
      banished: [],
      remainingDeck: [],
    };
    const state = simulatorReducer(activeState, { type: "CLEAR" });
    expect(state).toEqual(initialSimulatorState);
  });

  it("should handle DRAW", () => {
    const cardInstance: SimulatorCardInstance = {
      cardId: 1,
      uniqId: "1-0-1",
      name: "Card",
      quantity: 1,
      type: "spell",
      imageUrl: "",
      section: "MAIN",
    };
    const startState: SimulatorState = {
      ...initialSimulatorState,
      remainingDeck: [cardInstance],
    };

    const state = simulatorReducer(startState, { type: "DRAW", count: 1 });
    expect(state.hand).toEqual([cardInstance]);
    expect(state.remainingDeck).toHaveLength(0);
  });

  it("should handle DRAW when count > remaining cards", () => {
    const cardInstance: SimulatorCardInstance = {
      cardId: 1,
      uniqId: "1-0-1",
      name: "Card",
      quantity: 1,
      type: "spell",
      imageUrl: "",
      section: "MAIN",
    };
    const startState: SimulatorState = {
      ...initialSimulatorState,
      remainingDeck: [cardInstance],
    };

    const state = simulatorReducer(startState, { type: "DRAW", count: 5 });
    expect(state.hand).toEqual([cardInstance]);
    expect(state.remainingDeck).toHaveLength(0);
  });

  it("should not draw and return state if remainingDeck is empty", () => {
    const state = simulatorReducer(initialSimulatorState, { type: "DRAW", count: 1 });
    expect(state).toEqual(initialSimulatorState);
  });

  it("should handle SHUFFLE", () => {
    const startState: SimulatorState = {
      ...initialSimulatorState,
      remainingDeck: [
        { cardId: 1, uniqId: "1", name: "A", quantity: 1, type: "", imageUrl: "", section: "MAIN" },
        { cardId: 2, uniqId: "2", name: "B", quantity: 1, type: "", imageUrl: "", section: "MAIN" },
      ],
    };

    // Shuffle should retain the same number of cards in remainingDeck
    const state = simulatorReducer(startState, { type: "SHUFFLE" });
    expect(state.remainingDeck).toHaveLength(2);
    expect(state.remainingDeck.map((c) => c.cardId)).toContain(1);
    expect(state.remainingDeck.map((c) => c.cardId)).toContain(2);
  });

  it("should handle MOVE_CARD to different zones", () => {
    const card: SimulatorCardInstance = {
      cardId: 1,
      uniqId: "1-0-1",
      name: "Card",
      quantity: 1,
      type: "spell",
      imageUrl: "",
      section: "MAIN",
    };

    // Start with the card in hand
    let state: SimulatorState = {
      ...initialSimulatorState,
      hand: [card],
    };

    // Move to field
    state = simulatorReducer(state, { type: "MOVE_CARD", card, toZone: "field" });
    expect(state.hand).toHaveLength(0);
    expect(state.field).toEqual([card]);

    // Move to graveyard
    state = simulatorReducer(state, { type: "MOVE_CARD", card, toZone: "graveyard" });
    expect(state.field).toHaveLength(0);
    expect(state.graveyard).toEqual([card]);

    // Move to banished
    state = simulatorReducer(state, { type: "MOVE_CARD", card, toZone: "banished" });
    expect(state.graveyard).toHaveLength(0);
    expect(state.banished).toEqual([card]);

    // Move to deck top
    state = simulatorReducer(state, { type: "MOVE_CARD", card, toZone: "deck-top" });
    expect(state.banished).toHaveLength(0);
    expect(state.remainingDeck).toEqual([card]);

    // Move to deck bottom
    state = simulatorReducer(state, { type: "MOVE_CARD", card, toZone: "deck-bottom" });
    expect(state.remainingDeck).toEqual([card]);
  });
});
