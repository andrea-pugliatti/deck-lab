import { useCallback, useEffect, useReducer, useRef } from "react";

import { simulatorReducer, initialSimulatorState } from "../reducers/simulatorReducer";
import type { Deck, SimulatorCardInstance } from "../types";

/**
 * Custom React hook that coordinates drawing simulations and card zoning.
 * Maps state changes to the simulatorReducer and uses refs to avoid redundant shuffles
 * when identical deck states are re-rendered.
 *
 * @param deck - The current Deck schema context.
 * @param initialHandSize - The starting hand card count (defaults to 5).
 * @returns State containers representing zones and action callbacks to trigger simulator moves.
 */
export function useHandSimulator(deck?: Deck, initialHandSize: number = 5) {
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
