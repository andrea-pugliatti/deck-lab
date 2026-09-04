import { useQuery } from "@tanstack/react-query";

import { deckQueries } from "../../../services/queryOptions";

export function useFormats() {
  const { data: formats, isLoading: loading, error } = useQuery(deckQueries.formats());

  return { formats, loading, error };
}
