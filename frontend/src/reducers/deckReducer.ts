import type { Card, CardSection, DeckCardItem } from "../types";
import { canAddCard, clampQuantity, getFormatRules } from "../services/validation";

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
      const targetIndex = prevCards.findIndex(
        (c) => c.cardId === cardId && c.section === section,
      );
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
