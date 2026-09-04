import { useQuery } from "@tanstack/react-query";

import { metaQueries } from "../../../services/queryOptions";

type MetadataKey = "types" | "attributes" | "races" | "archetypes";

const DEFAULTS: Record<MetadataKey, string[]> = {
  types: ["Monster", "Spell", "Trap"],
  attributes: ["LIGHT", "DARK", "FIRE", "WIND", "WATER", "EARTH", "DIVINE"],
  races: [],
  archetypes: [],
};

export function useCardMetadata() {
  const { data: types = DEFAULTS.types } = useQuery(metaQueries.types());
  const { data: attributes = DEFAULTS.attributes } = useQuery(metaQueries.attributes());
  const { data: races = DEFAULTS.races } = useQuery(metaQueries.races());
  const { data: archetypes = DEFAULTS.archetypes } = useQuery(metaQueries.archetypes());

  return { types, attributes, races, archetypes };
}
