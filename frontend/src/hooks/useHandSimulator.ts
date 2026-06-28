import { useCallback, useEffect, useReducer, useRef } from "react";

import { simulatorReducer, initialSimulatorState } from "../reducers/simulatorReducer";
import type { Deck, SimulatorCardInstance } from "../types";

export function useHandSimulator(deck: Deck | null, initialHandSize: number = 5) {
  const [state, dispatch] = useReducer(simulatorReducer, initialSimulatorState);
  const lastDeckKeyRef = useRef<string>("");

  useEffect(() => {
    if (!deck) {
      dispatch({ type: "CLEAR" });
      lastDeckKeyRef.current = "";
      return;
    }

    const cardsKey = JSON.stringify(
      (deck.deckCards || []).map((dc) => ({
        cardId: dc.cardId,
        quantity: dc.quantity,
        section: dc.section,
      })),
    );
    const currentKey = `${deck.id}-${deck.updatedAt || ""}-${initialHandSize}-${cardsKey}`;

    if (currentKey !== lastDeckKeyRef.current) {
      lastDeckKeyRef.current = currentKey;
      dispatch({ type: "INIT", deck, initialHandSize });
    }
  }, [deck, initialHandSize]);

  const draw = useCallback((count: number) => {
    dispatch({ type: "DRAW", count });
  }, []);

  const shuffleDeck = useCallback(() => {
    dispatch({ type: "SHUFFLE" });
  }, []);

  const reset = useCallback(
    (startingHandSize: number) => {
      if (deck) {
        const cardsKey = JSON.stringify(
          (deck.deckCards || []).map((dc) => ({
            cardId: dc.cardId,
            quantity: dc.quantity,
            section: dc.section,
          })),
        );
        lastDeckKeyRef.current = `${deck.id}-${deck.updatedAt || ""}-${startingHandSize}-${cardsKey}`;
        dispatch({ type: "INIT", deck, initialHandSize: startingHandSize });
      }
    },
    [deck],
  );

  const moveCard = useCallback(
    (
      card: SimulatorCardInstance,
      toZone: "hand" | "field" | "graveyard" | "banished" | "deck-top" | "deck-bottom",
    ) => {
      dispatch({ type: "MOVE_CARD", card, toZone });
    },
    [],
  );

  return {
    hand: state.hand,
    field: state.field,
    graveyard: state.graveyard,
    banished: state.banished,
    remainingDeck: state.remainingDeck,
    draw,
    shuffleDeck,
    reset,
    moveCard,
  };
}
