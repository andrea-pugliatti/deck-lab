import { describe, expect, it } from "vitest";

import type { Card } from "../types";
import {
  deckReducer,
  initialState,
  type DeckState,
  canAddCard,
  clampQuantity,
  isExtraDeckCard,
  getFormatRules,
  DEFAULT_RULES,
} from "./deckReducer";

describe("deckReducer", () => {
  it("should return the state unchanged if action type is unknown", () => {
    // @ts-expect-error testing invalid action type
    const state = deckReducer(initialState, { type: "UNKNOWN_ACTION" });
    expect(state).toEqual(initialState);
  });

  it("should handle SET_NAME", () => {
    const state = deckReducer(initialState, { type: "SET_NAME", name: "New Deck" });
    expect(state.name).toBe("New Deck");
  });

  it("should handle SET_DESCRIPTION", () => {
    const state = deckReducer(initialState, { type: "SET_DESCRIPTION", description: "Nice deck" });
    expect(state.description).toBe("Nice deck");
  });

  it("should handle SET_FORMAT_NAME", () => {
    const state = deckReducer(initialState, { type: "SET_FORMAT_NAME", formatName: "Speed Duel" });
    expect(state.formatName).toBe("Speed Duel");
  });

  it("should handle SET_DECK_CARDS", () => {
    const cards = [
      { cardId: 1, name: "Card A", quantity: 3, type: "spell", section: "MAIN" as const },
    ];
    const state = deckReducer(initialState, { type: "SET_DECK_CARDS", deckCards: cards });
    expect(state.deckCards).toEqual(cards);
  });

  it("should handle LOAD_DECK", () => {
    const cards = [
      { cardId: 1, name: "Card A", quantity: 3, type: "spell", section: "MAIN" as const },
    ];
    const state = deckReducer(initialState, {
      type: "LOAD_DECK",
      name: "Loaded Deck",
      description: "Desc",
      formatName: "Common Charity",
      deckCards: cards,
    });
    expect(state.name).toBe("Loaded Deck");
    expect(state.description).toBe("Desc");
    expect(state.formatName).toBe("Common Charity");
    expect(state.deckCards).toEqual(cards);
  });

  it("should handle ADD_CARD (new card)", () => {
    const card: Card = {
      id: 1,
      name: "Blue-Eyes White Dragon",
      type: "Normal Monster",
      description: "Blue eyes dragon",
      race: "Dragon",
      attribute: "LIGHT",
      imageUrl: "http://example.com/be.jpg",
      imageUrlCropped: "http://example.com/be_crop.jpg",
    };
    const state = deckReducer(initialState, { type: "ADD_CARD", card, section: "MAIN" });
    expect(state.deckCards).toHaveLength(1);
    expect(state.deckCards[0]).toEqual({
      cardId: 1,
      name: "Blue-Eyes White Dragon",
      quantity: 1,
      type: "Normal Monster",
      imageUrl: "http://example.com/be_crop.jpg",
      section: "MAIN",
    });
  });

  it("should handle ADD_CARD (increment quantity)", () => {
    const card: Card = {
      id: 1,
      name: "Blue-Eyes White Dragon",
      type: "Normal Monster",
      description: "Blue eyes dragon",
      race: "Dragon",
      attribute: "LIGHT",
      imageUrl: "http://example.com/be.jpg",
      imageUrlCropped: "http://example.com/be_crop.jpg",
    };
    let state = deckReducer(initialState, { type: "ADD_CARD", card, section: "MAIN" });
    state = deckReducer(state, { type: "ADD_CARD", card, section: "MAIN" });
    expect(state.deckCards).toHaveLength(1);
    expect(state.deckCards[0].quantity).toBe(2);
  });

  it("should clamp quantity and add validation error if adding too many copies of a card", () => {
    const card: Card = {
      id: 1,
      name: "Blue-Eyes White Dragon",
      type: "Normal Monster",
      description: "Blue eyes dragon",
      race: "Dragon",
      attribute: "LIGHT",
      imageUrl: "http://example.com/be.jpg",
      imageUrlCropped: "http://example.com/be_crop.jpg",
    };
    let state = deckReducer(initialState, { type: "ADD_CARD", card, section: "MAIN" });
    state = deckReducer(state, { type: "ADD_CARD", card, section: "MAIN" });
    state = deckReducer(state, { type: "ADD_CARD", card, section: "MAIN" });
    // Attempting to add 4th copy (TCG max is 3)
    state = deckReducer(state, { type: "ADD_CARD", card, section: "MAIN" });
    expect(state.deckCards[0].quantity).toBe(3);
    expect(state.validationErrors).toContain(
      'You cannot add more than 3 copies of "Blue-Eyes White Dragon" across your entire deck.',
    );
  });

  it("should handle UPDATE_QUANTITY (increment and decrement)", () => {
    const startState: DeckState = {
      ...initialState,
      deckCards: [
        { cardId: 1, name: "Card A", quantity: 2, type: "monster", section: "MAIN", imageUrl: "" },
      ],
    };

    // Increment
    let state = deckReducer(startState, {
      type: "UPDATE_QUANTITY",
      cardId: 1,
      section: "MAIN",
      delta: 1,
    });
    expect(state.deckCards[0].quantity).toBe(3);

    // Decrement
    state = deckReducer(state, {
      type: "UPDATE_QUANTITY",
      cardId: 1,
      section: "MAIN",
      delta: -1,
    });
    expect(state.deckCards[0].quantity).toBe(2);

    // Remove if quantity <= 0
    state = deckReducer(state, {
      type: "UPDATE_QUANTITY",
      cardId: 1,
      section: "MAIN",
      delta: -2,
    });
    expect(state.deckCards).toHaveLength(0);
  });

  it("should handle REMOVE_CARD", () => {
    const startState: DeckState = {
      ...initialState,
      deckCards: [
        { cardId: 1, name: "Card A", quantity: 1, type: "monster", section: "MAIN", imageUrl: "" },
      ],
    };
    const state = deckReducer(startState, { type: "REMOVE_CARD", cardId: 1, section: "MAIN" });
    expect(state.deckCards).toHaveLength(0);
  });

  it("should handle START_VALIDATION", () => {
    const state = deckReducer(initialState, { type: "START_VALIDATION" });
    expect(state.isValidating).toBe(true);
  });

  it("should handle SET_VALIDATION_RESULT", () => {
    const state = deckReducer(initialState, {
      type: "SET_VALIDATION_RESULT",
      ok: true,
      errors: [],
    });
    expect(state.isValidating).toBe(false);
    expect(state.validationSuccess).toBe(true);
    expect(state.validationErrors).toEqual([]);
  });

  it("should handle START_SAVE", () => {
    const state = deckReducer(initialState, { type: "START_SAVE" });
    expect(state.isSaving).toBe(true);
  });

  it("should handle SET_SAVE_RESULT", () => {
    const state = deckReducer(initialState, { type: "SET_SAVE_RESULT", error: "Save failed" });
    expect(state.isSaving).toBe(false);
    expect(state.submitError).toBe("Save failed");
  });

  it("should handle SET_SUBMIT_ERROR", () => {
    const state = deckReducer(initialState, { type: "SET_SUBMIT_ERROR", error: "Submit failed" });
    expect(state.submitError).toBe("Submit failed");
  });

  describe("getFormatRules", () => {
    it("should return correct rules for TCG and OCG", () => {
      expect(getFormatRules("TCG")).toEqual(DEFAULT_RULES);
      expect(getFormatRules("OCG")).toEqual(DEFAULT_RULES);
    });

    it("should return specific rules for Speed Duel", () => {
      const rules = getFormatRules("Speed Duel");
      expect(rules.minMainSize).toBe(20);
      expect(rules.maxMainSize).toBe(30);
      expect(rules.maxExtraSize).toBe(5);
      expect(rules.maxSideSize).toBe(6);
    });

    it("should fall back to DEFAULT_RULES if format is unknown", () => {
      expect(getFormatRules("Unknown Format")).toEqual(DEFAULT_RULES);
    });
  });

  describe("isExtraDeckCard", () => {
    it("should return false if card type is undefined", () => {
      expect(isExtraDeckCard(undefined)).toBe(false);
    });

    it("should identify fusion, synchro, xyz, and link cards as extra deck cards", () => {
      expect(isExtraDeckCard("Fusion Monster")).toBe(true);
      expect(isExtraDeckCard("Synchro Tuner Monster")).toBe(true);
      expect(isExtraDeckCard("XYZ Monster")).toBe(true);
      expect(isExtraDeckCard("Link Monster")).toBe(true);
    });

    it("should return false for regular monsters, spells, and traps", () => {
      expect(isExtraDeckCard("Normal Monster")).toBe(false);
      expect(isExtraDeckCard("Spell Card")).toBe(false);
      expect(isExtraDeckCard("Trap Card")).toBe(false);
    });
  });

  describe("canAddCard", () => {
    const spellCard: Card = {
      id: 1,
      name: "Raigeki",
      type: "Spell Card",
      description: "",
      imageUrl: "",
      race: "",
      attribute: "",
    };

    const linkCard: Card = {
      id: 2,
      name: "Accesscode Talker",
      type: "Link Monster",
      description: "",
      imageUrl: "",
      race: "",
      attribute: "",
    };

    it("should block non-extra deck cards from being placed in EXTRA section", () => {
      const result = canAddCard(spellCard, "EXTRA", [], "TCG");
      expect(result.ok).toBe(false);
      expect(result.error).toBe('Main Deck card "Raigeki" cannot be placed in the EXTRA section.');
    });

    it("should block extra deck cards from being placed in MAIN section", () => {
      const result = canAddCard(linkCard, "MAIN", [], "TCG");
      expect(result.ok).toBe(false);
      expect(result.error).toBe(
        'Extra Deck monster "Accesscode Talker" must be placed in the EXTRA section.',
      );
    });

    it("should allow placing extra deck card in EXTRA, and normal card in MAIN or SIDE", () => {
      expect(canAddCard(linkCard, "EXTRA", [], "TCG").ok).toBe(true);
      expect(canAddCard(spellCard, "MAIN", [], "TCG").ok).toBe(true);
      expect(canAddCard(spellCard, "SIDE", [], "TCG").ok).toBe(true);
      expect(canAddCard(linkCard, "SIDE", [], "TCG").ok).toBe(true);
    });

    it("should block adding more than maxCopiesPerCard copies of a card", () => {
      const currentCards = [
        {
          cardId: 1,
          name: "Raigeki",
          quantity: 3,
          section: "MAIN" as const,
          type: "Spell",
          imageUrl: "",
        },
      ];
      const result = canAddCard(spellCard, "MAIN", currentCards, "TCG");
      expect(result.ok).toBe(false);
      expect(result.error).toBe(
        'You cannot add more than 3 copies of "Raigeki" across your entire deck.',
      );
    });
  });

  describe("clampQuantity", () => {
    it("should clamp quantity to limit copies across all sections", () => {
      const currentCards = [
        {
          cardId: 1,
          name: "Raigeki",
          quantity: 1,
          section: "SIDE" as const,
          type: "Spell",
          imageUrl: "",
        },
      ];

      const clamped = clampQuantity(1, "MAIN", 3, currentCards, "TCG");
      expect(clamped).toBe(2);
    });

    it("should allow full quantity if card is not present in other sections", () => {
      const clamped = clampQuantity(1, "MAIN", 3, [], "TCG");
      expect(clamped).toBe(3);
    });

    it("should not allow negative quantities", () => {
      const clamped = clampQuantity(1, "MAIN", -1, [], "TCG");
      expect(clamped).toBe(0);
    });
  });
});
