import { getCardMetadataEndpoint } from "../services/card";
import { useFetch } from "./useFetch";

export function useCardMetadata() {
  const { data: typesData } = useFetch<string[]>(getCardMetadataEndpoint("types"));
  const { data: attributesData } = useFetch<string[]>(getCardMetadataEndpoint("attributes"));
  const { data: racesData } = useFetch<string[]>(getCardMetadataEndpoint("races"));
  const { data: archetypesData } = useFetch<string[]>(getCardMetadataEndpoint("archetypes"));

  return {
    types: typesData || ["Monster", "Spell", "Trap"],
    attributes: attributesData || ["LIGHT", "DARK", "FIRE", "WIND", "WATER", "EARTH", "DIVINE"],
    races: racesData || [],
    archetypes: archetypesData || [],
  };
}
