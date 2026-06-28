import type { Deck, SimulatorCardInstance } from "../types";

export interface SimulatorState {
  hand: SimulatorCardInstance[];
  field: SimulatorCardInstance[];
  graveyard: SimulatorCardInstance[];
  banished: SimulatorCardInstance[];
  remainingDeck: SimulatorCardInstance[];
}

export type SimulatorAction =
  | { type: "INIT"; deck: Deck; initialHandSize: number }
  | { type: "CLEAR" }
  | { type: "DRAW"; count: number }
  | { type: "SHUFFLE" }
  | {
      type: "MOVE_CARD";
      card: SimulatorCardInstance;
      toZone: "hand" | "field" | "graveyard" | "banished" | "deck-top" | "deck-bottom";
    };

export const initialSimulatorState: SimulatorState = {
  hand: [],
  field: [],
  graveyard: [],
  banished: [],
  remainingDeck: [],
};

function shuffle<T>(array: T[]): T[] {
  const copy = [...array];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

export function simulatorReducer(state: SimulatorState, action: SimulatorAction): SimulatorState {
  switch (action.type) {
    case "INIT": {
      const { deck, initialHandSize } = action;
      if (!deck || !deck.deckCards) {
        return initialSimulatorState;
      }

      const flatMainCards: SimulatorCardInstance[] = [];
      let cardIndex = 0;
      deck.deckCards.forEach((dc) => {
        if (dc.section === "MAIN" || !dc.section) {
          for (let i = 0; i < (dc.quantity || 0); i++) {
            flatMainCards.push({
              ...dc,
              uniqId: `${dc.cardId}-${i}-${cardIndex++}`,
            });
          }
        }
      });

      const shuffled = shuffle(flatMainCards);
      const hand = shuffled.slice(0, initialHandSize);
      const remainingDeck = shuffled.slice(initialHandSize);

      return {
        hand,
        remainingDeck,
        field: [],
        graveyard: [],
        banished: [],
      };
    }

    case "CLEAR":
      return initialSimulatorState;

    case "DRAW": {
      const { count } = action;
      if (state.remainingDeck.length === 0) return state;

      const countToDraw = Math.min(count, state.remainingDeck.length);
      const drawn = state.remainingDeck.slice(0, countToDraw);
      const newRemaining = state.remainingDeck.slice(countToDraw);

      return {
        ...state,
        hand: [...state.hand, ...drawn],
        remainingDeck: newRemaining,
      };
    }

    case "SHUFFLE":
      return {
        ...state,
        remainingDeck: shuffle(state.remainingDeck),
      };

    case "MOVE_CARD": {
      const { card, toZone } = action;
      const filterFn = (c: SimulatorCardInstance) => c.uniqId !== card.uniqId;

      // Filter out from all existing zones
      const hand = state.hand.filter(filterFn);
      const field = state.field.filter(filterFn);
      const graveyard = state.graveyard.filter(filterFn);
      const banished = state.banished.filter(filterFn);
      const remainingDeck = state.remainingDeck.filter(filterFn);

      switch (toZone) {
        case "hand":
          return { ...state, hand: [...hand, card], field, graveyard, banished, remainingDeck };
        case "field":
          return { ...state, hand, field: [...field, card], graveyard, banished, remainingDeck };
        case "graveyard":
          return {
            ...state,
            hand,
            field,
            graveyard: [...graveyard, card],
            banished,
            remainingDeck,
          };
        case "banished":
          return { ...state, hand, field, graveyard, banished: [...banished, card], remainingDeck };
        case "deck-top":
          return {
            ...state,
            hand,
            field,
            graveyard,
            banished,
            remainingDeck: [card, ...remainingDeck],
          };
        case "deck-bottom":
          return {
            ...state,
            hand,
            field,
            graveyard,
            banished,
            remainingDeck: [...remainingDeck, card],
          };
        default:
          return state;
      }
    }

    default:
      return state;
  }
}
