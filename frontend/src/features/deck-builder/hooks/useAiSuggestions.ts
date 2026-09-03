import { useMutation } from "@tanstack/react-query";

import type { DeckCardItem, Format, Suggestion } from "../../../types";
import { fetchAiSuggestions } from "../../decks";

/**
 * Variables passed to the AI suggestions mutation.
 */
export interface AiSuggestionsParams {
  formatName: Format;
  deckCards: DeckCardItem[];
}

/**
 * Custom hook that wraps the AI suggestions API call in a TanStack
 * Mutation.  The `formatName` and `deckCards` are supplied as mutation
 * variables so the component stays declarative.
 *
 * @returns The TanStack Mutation result for AI suggestions.
 */
export function useAiSuggestions() {
  return useMutation<Suggestion[], Error, AiSuggestionsParams>({
    mutationFn: ({ formatName, deckCards }) => fetchAiSuggestions(formatName, deckCards),
  });
}
