import type { Card, CardSection, DeckCardItem } from "../types";

/**
 * Rules and sizing limitations enforced by a specific Yu-Gi-Oh! game format.
 */
export interface FormatRules {
  minMainSize: number;
  maxMainSize: number;
  maxExtraSize: number;
  maxSideSize: number;
  maxCopiesPerCard: number;
}

/**
 * Standard default format rules applied to TCG/OCG.
 */
export const DEFAULT_RULES: FormatRules = {
  minMainSize: 40,
  maxMainSize: 60,
  maxExtraSize: 15,
  maxSideSize: 15,
  maxCopiesPerCard: 3,
};

/**
 * Mapped collection of game formats and their respective deck size limits.
 */
export const FORMAT_RULES_MAP: Record<string, FormatRules> = {
  TCG: DEFAULT_RULES,
  OCG: DEFAULT_RULES,
  Goat: {
    minMainSize: 40,
    maxMainSize: 100,
    maxExtraSize: 15,
    maxSideSize: 15,
    maxCopiesPerCard: 3,
  },
  "Speed Duel": {
    minMainSize: 20,
    maxMainSize: 30,
    maxExtraSize: 5,
    maxSideSize: 6,
    maxCopiesPerCard: 3,
  },
};

/**
 * Resolves the deck size limits and copy restrictions for a selected format name.
 *
 * @param formatName - The identifier of the deck format (e.g. "Goat", "Speed Duel").
 * @returns The resolved FormatRules settings.
 */
export function getFormatRules(formatName: string): FormatRules {
  return FORMAT_RULES_MAP[formatName] || DEFAULT_RULES;
}

/**
 * Checks if a card's type classification places it in the Extra Deck.
 * Extra Deck cards include Fusion, Synchro, Xyz, and Link monsters.
 *
 * @param cardType - The type classification text of the card.
 * @returns True if it is an Extra Deck monster, otherwise false.
 */
export function isExtraDeckCard(cardType: string | undefined): boolean {
  if (!cardType) return false;
  const lower = cardType.toLowerCase();
  return (
    lower.includes("fusion") ||
    lower.includes("synchro") ||
    lower.includes("xyz") ||
    lower.includes("link")
  );
}

/**
 * Validates whether a card can be added to a specific deck section under copy limits
 * and placement restrictions.
 *
 * @param card - The Card schema to add.
 * @param section - The target deck section (MAIN, EXTRA, or SIDE).
 * @param currentCards - The current deck items.
 * @param formatName - The name of the game format ruleset to check.
 * @returns An object containing validation status (ok) and optional error message.
 */
export function canAddCard(
  card: Card,
  section: CardSection,
  currentCards: DeckCardItem[],
  formatName: string,
): { ok: boolean; error?: string } {
  const rules = getFormatRules(formatName);

  // Validate Placement rules
  const extraCard = isExtraDeckCard(card.type);
  if (section === "MAIN" && extraCard) {
    return {
      ok: false,
      error: `Extra Deck monster "${card.name}" must be placed in the EXTRA section.`,
    };
  }
  if (section === "EXTRA" && !extraCard) {
    return {
      ok: false,
      error: `Main Deck card "${card.name}" cannot be placed in the EXTRA section.`,
    };
  }

  // Validate copy limits across the entire deck (Main, Extra, and Side combined)
  const totalCopies = currentCards
    .filter((c) => c.cardId === card.id)
    .reduce((sum, c) => sum + c.quantity, 0);

  if (totalCopies >= rules.maxCopiesPerCard) {
    return {
      ok: false,
      error: `You cannot add more than ${rules.maxCopiesPerCard} copies of "${card.name}" across your entire deck.`,
    };
  }

  return { ok: true };
}

/**
 * Clamps quantity modifications to comply with format copy rules, taking copies
 * in other deck sections into account.
 *
 * @param cardId - The target card unique ID.
 * @param section - The section being modified.
 * @param newQty - The proposed new quantity for this section.
 * @param currentCards - The current deck card items list.
 * @param formatName - The name of the game format ruleset.
 * @returns The clamped quantity.
 */
export function clampQuantity(
  cardId: number,
  section: CardSection,
  newQty: number,
  currentCards: DeckCardItem[],
  formatName: string,
): number {
  const rules = getFormatRules(formatName);

  // Copies in OTHER sections (e.g. Side Deck copies of a Main Deck card)
  const copiesInOtherSections = currentCards
    .filter((c) => c.cardId === cardId && c.section !== section)
    .reduce((sum, c) => sum + c.quantity, 0);

  const allowedQty = rules.maxCopiesPerCard - copiesInOtherSections;
  return Math.max(0, Math.min(newQty, allowedQty));
}

/**
 * State representing the active deck configuration and loading/validation phases.
 */
export interface DeckState {
  name: string;
  description: string;
  formatName: string;
  deckCards: DeckCardItem[];
  validationErrors: string[];
  validationSuccess: boolean;
  isSaving: boolean;
  isValidating: boolean;
  submitError?: string;
}

/**
 * Actions that can be dispatched to mutate the Deck State.
 */
export type DeckAction =
  | { type: "SET_NAME"; name: string }
  | { type: "SET_DESCRIPTION"; description: string }
  | { type: "SET_FORMAT_NAME"; formatName: string }
  | { type: "SET_DECK_CARDS"; deckCards: DeckCardItem[] }
  | {
      type: "LOAD_DECK";
      name: string;
      description: string;
      formatName: string;
      deckCards: DeckCardItem[];
    }
  | { type: "ADD_CARD"; card: Card; section: CardSection }
  | { type: "UPDATE_QUANTITY"; cardId: number; section: CardSection; delta: number }
  | { type: "REMOVE_CARD"; cardId: number; section: CardSection }
  | { type: "START_VALIDATION" }
  | { type: "SET_VALIDATION_RESULT"; ok: boolean; errors: string[] }
  | { type: "START_SAVE" }
  | { type: "SET_SAVE_RESULT"; error?: string }
  | { type: "SET_SUBMIT_ERROR"; error?: string };

/**
 * Initial empty state configuration for the deck editor.
 */
export const initialState: DeckState = {
  name: "",
  description: "",
  formatName: "TCG",
  deckCards: [],
  validationErrors: [],
  validationSuccess: false,
  isSaving: false,
  isValidating: false,
  submitError: undefined,
};

/**
 * State reducer managing Yu-Gi-Oh! deck building edits, including card additions,
 * updates, removals, copy limit checks, and asynchronous status indicators.
 *
 * @param state - The current Deck editor state.
 * @param action - The action dispatched to mutate state.
 * @returns The mutated next state.
 */
export function deckReducer(state: DeckState, action: DeckAction): DeckState {
  switch (action.type) {
    case "SET_NAME":
      return { ...state, name: action.name };

    case "SET_DESCRIPTION":
      return { ...state, description: action.description };

    case "SET_FORMAT_NAME":
      return { ...state, formatName: action.formatName };

    case "SET_DECK_CARDS":
      return { ...state, deckCards: action.deckCards };

    case "LOAD_DECK":
      return {
        ...state,
        name: action.name,
        description: action.description,
        formatName: action.formatName,
        deckCards: action.deckCards,
      };

    case "ADD_CARD": {
      const { card, section } = action;
      const prevCards = state.deckCards;
      const formatName = state.formatName;
      const existingIndex = prevCards.findIndex(
        (c) => c.cardId === card.id && c.section === section,
      );

      if (existingIndex > -1) {
        const updated = [...prevCards];
        const newQty = clampQuantity(
          card.id,
          section,
          updated[existingIndex].quantity + 1,
          prevCards,
          formatName,
        );
        if (newQty === updated[existingIndex].quantity) {
          const rules = getFormatRules(formatName);
          return {
            ...state,
            validationSuccess: false,
            validationErrors: [
              `You cannot add more than ${rules.maxCopiesPerCard} copies of "${card.name}" across your entire deck.`,
            ],
          };
        }
        updated[existingIndex] = {
          ...updated[existingIndex],
          quantity: newQty,
        };
        return {
          ...state,
          validationSuccess: false,
          validationErrors: [],
          deckCards: updated,
        };
      } else {
        const check = canAddCard(card, section, prevCards, formatName);
        if (!check.ok) {
          return {
            ...state,
            validationSuccess: false,
            validationErrors: [check.error || "Validation check failed."],
          };
        }

        return {
          ...state,
          validationSuccess: false,
          validationErrors: [],
          deckCards: [
            ...prevCards,
            {
              cardId: card.id,
              name: card.name,
              quantity: 1,
              type: card.type,
              imageUrl: card.imageUrlCropped,
              section,
            },
          ],
        };
      }
    }

    case "UPDATE_QUANTITY": {
      const { cardId, section, delta } = action;
      const prevCards = state.deckCards;
      const formatName = state.formatName;
      const targetIndex = prevCards.findIndex((c) => c.cardId === cardId && c.section === section);
      if (targetIndex === -1) return state;

      const updated = [...prevCards];
      const targetQty = updated[targetIndex].quantity + delta;

      if (targetQty <= 0) {
        updated.splice(targetIndex, 1);
      } else {
        updated[targetIndex] = {
          ...updated[targetIndex],
          quantity: clampQuantity(cardId, section, targetQty, prevCards, formatName),
        };
      }
      return {
        ...state,
        validationSuccess: false,
        validationErrors: [],
        deckCards: updated,
      };
    }

    case "REMOVE_CARD": {
      const { cardId, section } = action;
      return {
        ...state,
        validationSuccess: false,
        validationErrors: [],
        deckCards: state.deckCards.filter((c) => !(c.cardId === cardId && c.section === section)),
      };
    }

    case "START_VALIDATION":
      return {
        ...state,
        isValidating: true,
        validationErrors: [],
        validationSuccess: false,
        submitError: undefined,
      };

    case "SET_VALIDATION_RESULT":
      return {
        ...state,
        isValidating: false,
        validationSuccess: action.ok,
        validationErrors: action.errors,
      };

    case "START_SAVE":
      return {
        ...state,
        isSaving: true,
        submitError: undefined,
      };

    case "SET_SAVE_RESULT":
      return {
        ...state,
        isSaving: false,
        submitError: action.error,
      };

    case "SET_SUBMIT_ERROR":
      return {
        ...state,
        submitError: action.error,
      };

    default:
      return state;
  }
}
