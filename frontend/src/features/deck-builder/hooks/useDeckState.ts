import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useReducer, useState } from "react";

import { deckReducer, initialState } from "../../../features/deck-builder/reducers/deckReducer";
import { saveDeck as saveDeckService, validateDeck } from "../../../features/decks";
import { deckKeys } from "../../../services/queryKeys";
import { deckQueries } from "../../../services/queryOptions";
import type { Card, CardSection, Deck, DeckCardItem, Format, DeckPayload } from "../../../types";

/**
 * Helper function to map state components into a DeckPayload object for API calls.
 *
 * @param name - The deck name.
 * @param description - The deck description.
 * @param formatName - The format name.
 * @param deckCards - Current list of active cards.
 * @param defaultName - Fallback name if the deck name is empty.
 * @returns A structured DeckPayload object.
 */
const buildDeckPayload = (
  name: string,
  description: string,
  formatName: Format,
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

/**
 * Return interface for {@link useDeckState}.
 */
export interface UseDeckStateReturn {
  isEditMode: boolean;
  name: string;
  setName: (name: string) => void;
  description: string;
  setDescription: (description: string) => void;
  formatName: Format;
  setFormatName: (formatName: Format) => void;
  deckCards: DeckCardItem[];
  setDeckCards: (deckCards: DeckCardItem[]) => void;
  validationErrors: string[];
  validationSuccess: boolean;
  isSaving: boolean;
  isValidating: boolean;
  submitError: string | undefined;
  addCard: (card: Card, section: CardSection) => void;
  updateQuantity: (cardId: number, section: CardSection, delta: number) => void;
  removeCard: (cardId: number, section: CardSection) => void;
  validateDeckPayload: (overrideName?: string) => Promise<boolean>;
  saveDeck: (overrideName?: string) => void;
}

/**
 * Custom React hook that acts as the primary state manager for the Deck Builder.
 * Wraps useReducer logic with asynchronous triggers for fetching, saving, and
 * validating deck designs.
 *
 * @param id - The optional deck ID. If provided, fetches and loads existing deck on mount.
 * @param onSaveSuccess - Optional callback executed when save operation completes.
 * @returns State variables, dispatch wrappers, and save/validation handles.
 */
export function useDeckState(
  id?: string,
  onSaveSuccess?: (savedDeck: Deck) => void,
): UseDeckStateReturn {
  const isEditMode = !!id;

  const [state, dispatch] = useReducer(deckReducer, initialState);
  const [submitError, setSubmitError] = useState<string>();

  const queryClient = useQueryClient();

  // Fetch Deck for Edit Mode
  const { data: deckData } = useQuery(deckQueries.detail(id));

  useEffect(() => {
    if (deckData) {
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
    }
  }, [deckData]);

  const setName = (name: string) => {
    dispatch({ type: "SET_NAME", name });
  };

  const setDescription = (description: string) => {
    dispatch({ type: "SET_DESCRIPTION", description: description.slice(0, 255) });
  };

  const setFormatName = (formatName: Format) => {
    dispatch({ type: "SET_FORMAT_NAME", formatName });
  };

  const setDeckCards = (deckCards: DeckCardItem[]) => {
    dispatch({ type: "SET_DECK_CARDS", deckCards });
  };

  const addCard = (card: Card, section: CardSection) => {
    dispatch({ type: "ADD_CARD", card, section });
  };

  const updateQuantity = (cardId: number, section: CardSection, delta: number) => {
    dispatch({ type: "UPDATE_QUANTITY", cardId, section, delta });
  };

  const removeCard = (cardId: number, section: CardSection) => {
    dispatch({ type: "REMOVE_CARD", cardId, section });
  };

  const validateDeckPayload = async (): Promise<boolean> => {
    dispatch({ type: "START_VALIDATION" });
    setSubmitError(undefined);

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
  };

  const saveDeckMutation = useMutation({
    mutationFn: async (payload: DeckPayload) => {
      return saveDeckService(payload, id);
    },
    onSuccess: (savedDeck) => {
      const savedId = String(savedDeck.id);
      queryClient.setQueryData(deckKeys.detail(savedId), savedDeck);
      void queryClient.invalidateQueries({ queryKey: deckKeys.detail(savedId) });
      if (id && id !== savedId) {
        void queryClient.invalidateQueries({ queryKey: deckKeys.detail(id) });
      }
      void queryClient.invalidateQueries({ queryKey: deckKeys.lists() });
      setSubmitError(undefined);
      if (onSaveSuccess) {
        onSaveSuccess(savedDeck);
      }
    },
    onError: (err) => {
      setSubmitError(
        err instanceof Error ? err.message : "An error occurred while saving the deck.",
      );
    },
  });

  const saveDeck = async () => {
    if (!state.name.trim()) {
      setSubmitError("Deck name is required.");
      return;
    }

    if (state.description.length > 255) {
      setSubmitError("Strategy/notes must be 255 characters or less.");
      return;
    }

    setSubmitError(undefined);

    const isValid = await validateDeckPayload();
    if (!isValid) {
      return;
    }

    const payload = buildDeckPayload(
      state.name,
      state.description,
      state.formatName,
      state.deckCards,
    );

    saveDeckMutation.mutate(payload);
  };

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
    isSaving: saveDeckMutation.isPending,
    isValidating: state.isValidating,
    submitError,
    addCard,
    updateQuantity,
    removeCard,
    validateDeckPayload,
    saveDeck,
  };
}
