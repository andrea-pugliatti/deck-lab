import { useCallback, useEffect, useState } from "react";

import { getDeck, saveDeck as saveDeckService, validateDeck } from "../services/deck";
import { canAddCard, clampQuantity, getFormatRules } from "../services/validation";
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

  // Deck State
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [formatName, setFormatName] = useState("TCG");
  const [deckCards, setDeckCards] = useState<DeckCardItem[]>([]);

  // Statuses
  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  const [validationSuccess, setValidationSuccess] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isValidating, setIsValidating] = useState(false);
  const [submitError, setSubmitError] = useState<string>();

  // Fetch Deck for Edit Mode
  useEffect(() => {
    if (isEditMode && id) {
      const fetchDeck = async () => {
        try {
          const deckData = await getDeck(id);
          setName(deckData.name);
          setDescription(deckData.description || "");
          setFormatName(deckData.formatName);
          setDeckCards(
            (deckData.deckCards || []).map((dc) => ({
              cardId: dc.cardId,
              name: dc.name,
              quantity: dc.quantity,
              type: dc.type,
              imageUrl: dc.imageUrl,
              section: dc.section || "MAIN",
            })),
          );
        } catch (err) {
          console.error("Failed to load deck for editing:", err);
        }
      };
      fetchDeck();
    }
  }, [isEditMode, id]);

  // Operations
  const addCard = useCallback(
    (card: Card, section: CardSection) => {
      setValidationSuccess(false);
      setValidationErrors([]);

      setDeckCards((prevCards) => {
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
            setValidationErrors([
              `You cannot add more than ${rules.maxCopiesPerCard} copies of "${card.name}" across your entire deck.`,
            ]);
            return prevCards;
          }
          updated[existingIndex].quantity = newQty;
          return updated;
        } else {
          const check = canAddCard(card, section, prevCards, formatName);
          if (!check.ok) {
            setValidationErrors([check.error || "Validation check failed."]);
            return prevCards;
          }

          return [
            ...prevCards,
            {
              cardId: card.id,
              name: card.name,
              quantity: 1,
              type: card.type,
              imageUrl: card.imageUrlCropped,
              section,
            },
          ];
        }
      });
    },
    [formatName],
  );

  const updateQuantity = useCallback(
    (cardId: number, section: CardSection, delta: number) => {
      setValidationSuccess(false);
      setValidationErrors([]);

      setDeckCards((prevCards) => {
        const targetIndex = prevCards.findIndex(
          (c) => c.cardId === cardId && c.section === section,
        );
        if (targetIndex === -1) return prevCards;

        const updated = [...prevCards];
        const targetQty = updated[targetIndex].quantity + delta;

        if (targetQty <= 0) {
          updated.splice(targetIndex, 1);
        } else {
          updated[targetIndex].quantity = clampQuantity(
            cardId,
            section,
            targetQty,
            prevCards,
            formatName,
          );
        }
        return updated;
      });
    },
    [formatName],
  );

  const removeCard = useCallback((cardId: number, section: CardSection) => {
    setValidationSuccess(false);
    setValidationErrors([]);
    setDeckCards((prevCards) =>
      prevCards.filter((c) => !(c.cardId === cardId && c.section === section)),
    );
  }, []);

  const validateDeckPayload = useCallback(async (): Promise<boolean> => {
    setIsValidating(true);
    setValidationErrors([]);
    setValidationSuccess(false);
    setSubmitError(undefined);

    const payload = buildDeckPayload(name, description, formatName, deckCards, "Draft Deck");
    const result = await validateDeck(payload);

    setIsValidating(false);
    if (result.ok) {
      setValidationSuccess(true);
      return true;
    } else {
      setValidationErrors(result.errors || ["Unknown validation error"]);
      return false;
    }
  }, [name, description, formatName, deckCards]);

  const saveDeck = useCallback(async () => {
    if (!name.trim()) {
      setSubmitError("Deck name is required.");
      return;
    }

    setIsSaving(true);
    setSubmitError(undefined);

    const isValid = await validateDeckPayload();
    if (!isValid) {
      setSubmitError("Please resolve validation errors before saving.");
      setIsSaving(false);
      return;
    }

    const payload = buildDeckPayload(name, description, formatName, deckCards);

    try {
      const savedDeck = await saveDeckService(payload, id);
      if (onSaveSuccess) {
        onSaveSuccess(savedDeck);
      }
    } catch (err: any) {
      setSubmitError(err.message || "An error occurred while saving the deck.");
    } finally {
      setIsSaving(false);
    }
  }, [id, name, description, formatName, deckCards, validateDeckPayload, onSaveSuccess]);

  return {
    isEditMode,
    name,
    setName,
    description,
    setDescription,
    formatName,
    setFormatName,
    deckCards,
    setDeckCards,
    validationErrors,
    validationSuccess,
    isSaving,
    isValidating,
    submitError,
    addCard,
    updateQuantity,
    removeCard,
    validateDeckPayload,
    saveDeck,
  };
}
