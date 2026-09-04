import { useMutation, useQueryClient } from "@tanstack/react-query";

import { deckKeys } from "../../../services/queryKeys";
import type { Deck, Page } from "../../../types";
import { deleteDeck } from "../api/deck";

interface DeleteDeckRollbackContext {
  previousLists: [unknown, unknown][];
  previousDetail?: Deck;
}

/**
 * Custom hook that encapsulates deck deletion as a TanStack Mutation with optimistic cache updates and rollback.
 *
 * @returns The TanStack Mutation result object for deck deletion.
 */
export function useDeleteDeck() {
  const queryClient = useQueryClient();

  return useMutation<void, Error, string | number, DeleteDeckRollbackContext>({
    mutationFn: (id: string | number) => deleteDeck(id),
    onMutate: async (id: string | number) => {
      await queryClient.cancelQueries({ queryKey: deckKeys.lists() });

      const previousLists = queryClient.getQueriesData({ queryKey: deckKeys.lists() }) as [
        unknown,
        unknown,
      ][];

      queryClient.setQueriesData({ queryKey: deckKeys.lists() }, (old: unknown) => {
        if (!old) return old;
        if (Array.isArray(old)) {
          return old.filter((d: { id?: number | string }) => String(d?.id) !== String(id));
        }
        if (
          typeof old === "object" &&
          "content" in old &&
          Array.isArray((old as Page<Deck>).content)
        ) {
          const pageData = old as Page<Deck>;
          const filtered = pageData.content.filter((d) => String(d.id) !== String(id));
          const removedCount = pageData.content.length - filtered.length;
          return {
            ...pageData,
            content: filtered,
            page: pageData.page
              ? {
                  ...pageData.page,
                  totalElements: Math.max(0, pageData.page.totalElements - removedCount),
                }
              : pageData.page,
          };
        }
        return old;
      });

      return { previousLists };
    },
    onError: (_err, _id, context) => {
      if (context?.previousLists) {
        for (const [queryKey, data] of context.previousLists) {
          queryClient.setQueryData(queryKey as string[], data);
        }
      }
    },
    onSuccess: (_, id) => {
      queryClient.removeQueries({ queryKey: deckKeys.detail(id) });
    },
    onSettled: () => {
      void queryClient.invalidateQueries({ queryKey: deckKeys.lists() });
    },
  });
}
