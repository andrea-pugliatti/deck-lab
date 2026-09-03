import { useMutation } from "@tanstack/react-query";

import type { AiGeneratedDeck, Format, Strategy } from "../../../types";
import { generateAiDeck } from "../../decks";

/**
 * Payload for AI deck generation requests.
 */
export interface GenerateAiDeckPayload {
  archetype: string;
  strategy: Strategy;
  formatName: Format;
  customPrompt?: string;
}

/**
 * Custom hook that wraps the AI deck generation API call in a TanStack
 * Mutation.  Components that use this hook get access to `mutate`,
 * `isPending`, and `error` without managing their own loading/error
 * state for the API call itself.
 *
 * @returns The TanStack Mutation result for AI deck generation.
 */
export function useGenerateAiDeck() {
  return useMutation<AiGeneratedDeck, Error, GenerateAiDeckPayload>({
    mutationFn: (payload) => generateAiDeck(payload),
  });
}
