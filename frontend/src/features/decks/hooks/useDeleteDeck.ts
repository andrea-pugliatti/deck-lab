import { useMutation, useQueryClient } from "@tanstack/react-query";

import { deckKeys } from "../../../services/queryKeys";
import { deleteDeck } from "../api/deck";

/**
 * Custom hook that encapsulates deck deletion as a TanStack Mutation.
 *
 * @returns The TanStack Mutation result object for deck deletion.
 */
export function useDeleteDeck() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string | number) => deleteDeck(id),
    onSuccess: (_, id) => {
      queryClient.removeQueries({ queryKey: deckKeys.detail(id) });
      void queryClient.invalidateQueries({ queryKey: deckKeys.all });
    },
  });
}
