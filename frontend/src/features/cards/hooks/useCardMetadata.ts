import { useQuery } from "@tanstack/react-query";

import { getMetadata } from "../services/card";

type MetadataKey = "types" | "attributes" | "races" | "archetypes";

const DEFAULTS: Record<MetadataKey, string[]> = {
  types: ["Monster", "Spell", "Trap"],
  attributes: ["LIGHT", "DARK", "FIRE", "WIND", "WATER", "EARTH", "DIVINE"],
  races: [],
  archetypes: [],
};

/**
 * Custom React hook that fetches and exposes Yu-Gi-Oh! card filter metadata collections
 * (types, attributes, races, and archetypes) for catalog filter selections.
 * Utilizes TanStack Query for session caching and request deduplication.
 *
 * @returns An object containing arrays for types, attributes, races, and archetypes.
 */
export function useCardMetadata() {
  const { data: types = DEFAULTS.types } = useQuery<string[]>({
    queryKey: ["metadata", "types"],
    queryFn: ({ signal }) => getMetadata("types", signal),
    staleTime: Infinity,
  });

  const { data: attributes = DEFAULTS.attributes } = useQuery<string[]>({
    queryKey: ["metadata", "attributes"],
    queryFn: ({ signal }) => getMetadata("attributes", signal),
    staleTime: Infinity,
  });

  const { data: races = DEFAULTS.races } = useQuery<string[]>({
    queryKey: ["metadata", "races"],
    queryFn: ({ signal }) => getMetadata("races", signal),
    staleTime: Infinity,
  });

  const { data: archetypes = DEFAULTS.archetypes } = useQuery<string[]>({
    queryKey: ["metadata", "archetypes"],
    queryFn: ({ signal }) => getMetadata("archetypes", signal),
    staleTime: Infinity,
  });

  return { types, attributes, races, archetypes };
}
