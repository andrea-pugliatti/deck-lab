import { useQuery } from "@tanstack/react-query";

import { formatKeys } from "../../../services/queryKeys";
import { getFormats } from "../api/deck";

/**
 * Custom hook that fetches and caches the list of supported Yu-Gi-Oh!
 * game formats.
 *
 * @returns An object containing the formats array, loading, and error state.
 */
export function useFormats() {
  const {
    data: formats,
    isLoading: loading,
    error,
  } = useQuery<string[]>({
    queryKey: formatKeys.all,
    queryFn: ({ signal }) => getFormats(signal),
  });

  return { formats, loading, error };
}
