import { useQuery } from "@tanstack/react-query";

import { metaQueries } from "../../../services/queryOptions";
import {
  isCardAttribute,
  isCardRace,
  isCardType,
  type CardAttribute,
  type CardRace,
  type CardType,
} from "../../../types";

export interface CardMetadata {
  types: CardType[];
  attributes: CardAttribute[];
  races: CardRace[];
  archetypes: string[];
}

const DEFAULT_TYPES: CardType[] = [
  "Normal Monster",
  "Effect Monster",
  "Spell Card",
  "Trap Card",
];

const DEFAULT_ATTRIBUTES: CardAttribute[] = [
  "LIGHT",
  "DARK",
  "FIRE",
  "WIND",
  "WATER",
  "EARTH",
  "DIVINE",
];

const DEFAULT_RACES: CardRace[] = [];
const DEFAULT_ARCHETYPES: string[] = [];

const selectCardTypes = (data: string[]): CardType[] => data.filter(isCardType);
const selectCardAttributes = (data: string[]): CardAttribute[] => data.filter(isCardAttribute);
const selectCardRaces = (data: string[]): CardRace[] => data.filter(isCardRace);

export function useCardMetadata(): CardMetadata {
  const { data: types = DEFAULT_TYPES } = useQuery({
    ...metaQueries.types(),
    select: selectCardTypes,
  });
  const { data: attributes = DEFAULT_ATTRIBUTES } = useQuery({
    ...metaQueries.attributes(),
    select: selectCardAttributes,
  });
  const { data: races = DEFAULT_RACES } = useQuery({
    ...metaQueries.races(),
    select: selectCardRaces,
  });
  const { data: archetypes = DEFAULT_ARCHETYPES } = useQuery(metaQueries.archetypes());

  return { types, attributes, races, archetypes };
}

