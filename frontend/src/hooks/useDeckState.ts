import { useCallback, useEffect, useReducer } from "react";

import { deckReducer, initialState } from "../reducers/deckReducer";
import { getDeck, saveDeck as saveDeckService, validateDeck } from "../services/deck";
import type { Card, CardSection, Deck, DeckCardItem } from "../types";

const buildDeckPayload = (
  name: string,
  description: string,
  formatName: string,
  deckCards: DeckCardItem[],
  defaultName: string = "",
) => ({
  name: name.trim() || defaultName,
  description: description.trim(),
  formatName,
  deckCards: deckCards.map((c) => ({
    cardId: c.cardId,
    quantity: c.quantity,
    section: c.section,
  })),
});

export function useDeckState(id?: string, onSaveSuccess?: (savedDeck: Deck) => void) {
  const isEditMode = !!id;

  const [state, dispatch] = useReducer(deckReducer, initialState);

  // Fetch Deck for Edit Mode
  useEffect(() => {
    if (isEditMode && id) {
      const fetchDeck = async () => {
        try {
          const deckData = await getDeck(id);
          dispatch({
            type: "LOAD_DECK",
            name: deckData.name,
            description: deckData.description || "",
            formatName: deckData.formatName,
            deckCards: (deckData.deckCards || []).map((dc) => ({
              cardId: dc.cardId,
              name: dc.name,
              quantity: dc.quantity,
              type: dc.type,
              imageUrl: dc.imageUrl,
              section: dc.section || "MAIN",
            })),
          });
        } catch (err) {
          console.error("Failed to load deck for editing:", err);
        }
      };
      fetchDeck();
    }
  }, [isEditMode, id]);

  const setName = useCallback((name: string) => {
    dispatch({ type: "SET_NAME", name });
  }, []);

  const setDescription = useCallback((description: string) => {
    dispatch({ type: "SET_DESCRIPTION", description });
  }, []);

  const setFormatName = useCallback((formatName: string) => {
    dispatch({ type: "SET_FORMAT_NAME", formatName });
  }, []);

  const setDeckCards = useCallback((deckCards: DeckCardItem[]) => {
    dispatch({ type: "SET_DECK_CARDS", deckCards });
  }, []);

  const addCard = useCallback((card: Card, section: CardSection) => {
    dispatch({ type: "ADD_CARD", card, section });
  }, []);

  const updateQuantity = useCallback((cardId: number, section: CardSection, delta: number) => {
    dispatch({ type: "UPDATE_QUANTITY", cardId, section, delta });
  }, []);

  const removeCard = useCallback((cardId: number, section: CardSection) => {
    dispatch({ type: "REMOVE_CARD", cardId, section });
  }, []);

  const validateDeckPayload = useCallback(async (): Promise<boolean> => {
    dispatch({ type: "START_VALIDATION" });

    const payload = buildDeckPayload(
      state.name,
      state.description,
      state.formatName,
      state.deckCards,
      "Draft Deck",
    );
    const result = await validateDeck(payload);

    if (result.ok) {
      dispatch({ type: "SET_VALIDATION_RESULT", ok: true, errors: [] });
      return true;
    } else {
      const errors = result.errors || ["Unknown validation error"];
      dispatch({ type: "SET_VALIDATION_RESULT", ok: false, errors });
      return false;
    }
  }, [state.name, state.description, state.formatName, state.deckCards]);

  const saveDeck = useCallback(async () => {
    if (!state.name.trim()) {
      dispatch({ type: "SET_SUBMIT_ERROR", error: "Deck name is required." });
      return;
    }

    dispatch({ type: "START_SAVE" });

    const isValid = await validateDeckPayload();
    if (!isValid) {
      dispatch({
        type: "SET_SAVE_RESULT",
      });
      return;
    }

    const payload = buildDeckPayload(
      state.name,
      state.description,
      state.formatName,
      state.deckCards,
    );

    try {
      const savedDeck = await saveDeckService(payload, id);
      dispatch({ type: "SET_SAVE_RESULT" });
      if (onSaveSuccess) {
        onSaveSuccess(savedDeck);
      }
    } catch (err) {
      dispatch({
        type: "SET_SAVE_RESULT",
        error: err instanceof Error ? err.message : "An error occurred while saving the deck.",
      });
    }
  }, [
    id,
    state.name,
    state.description,
    state.formatName,
    state.deckCards,
    validateDeckPayload,
    onSaveSuccess,
  ]);

  return {
    isEditMode,
    name: state.name,
    setName,
    description: state.description,
    setDescription,
    formatName: state.formatName,
    setFormatName,
    deckCards: state.deckCards,
    setDeckCards,
    validationErrors: state.validationErrors,
    validationSuccess: state.validationSuccess,
    isSaving: state.isSaving,
    isValidating: state.isValidating,
    submitError: state.submitError,
    addCard,
    updateQuantity,
    removeCard,
    validateDeckPayload,
    saveDeck,
  };
}
