import { useQueryClient, type QueryClient } from "@tanstack/react-query";
import { useCallback } from "react";

import { cardQueries, deckQueries } from "../services/queryOptions";

/**
 * Safely retrieves the ambient TanStack {@link QueryClient} instance.
 * Returns `null` if called outside a `QueryClientProvider` rather than throwing,
 * ensuring presentational components can be rendered in isolated test harnesses.
 *
 * @returns The active {@link QueryClient} or `null`.
 */
export function useOptionalQueryClient(): QueryClient | null {
  try {
    return useQueryClient();
  } catch {
    return null;
  }
}

/**
 * Custom hook providing a memoized prefetch callback for card details.
 * Prefetches the card query into the TanStack Query cache with a 60s stale time on user intent.
 *
 * @param id - The numeric or string identifier of the card to prefetch.
 * @returns A memoized callback that executes the prefetch when invoked.
 */
export function usePrefetchCard(id?: number | string | null): () => void {
  const queryClient = useOptionalQueryClient();

  return useCallback(() => {
    if (id && queryClient) {
      void queryClient.prefetchQuery({
        ...cardQueries.detail(id),
        staleTime: 60 * 1000,
      });
    }
  }, [id, queryClient]);
}

/**
 * Custom hook providing a memoized prefetch callback for deck details.
 * Prefetches the deck query into the TanStack Query cache with a 60s stale time on user intent.
 *
 * @param id - The numeric or string identifier of the deck to prefetch.
 * @returns A memoized callback that executes the prefetch when invoked.
 */
export function usePrefetchDeck(id?: number | string | null): () => void {
  const queryClient = useOptionalQueryClient();

  return useCallback(() => {
    if (id && queryClient) {
      void queryClient.prefetchQuery({
        ...deckQueries.detail(id),
        staleTime: 60 * 1000,
      });
    }
  }, [id, queryClient]);
}
