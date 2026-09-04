import { queryOptions } from "@tanstack/react-query";

import {
  getCard,
  getCards,
  getCardsEndpoint,
  getCardSuggestionsEndpoint,
  getMetadata,
  getSuggestions,
} from "../features/cards";
import { getDeck, getDecks, getDecksQueryEndpoint, getFormats } from "../features/decks";
import { cardKeys, deckKeys, formatKeys, metaKeys } from "./queryKeys";

export const metaQueries = {
  types: () =>
    queryOptions({
      queryKey: metaKeys.types(),
      queryFn: ({ signal }) => getMetadata("types", signal),
      staleTime: Infinity,
      gcTime: Infinity,
    }),
  attributes: () =>
    queryOptions({
      queryKey: metaKeys.attributes(),
      queryFn: ({ signal }) => getMetadata("attributes", signal),
      staleTime: Infinity,
      gcTime: Infinity,
    }),
  races: () =>
    queryOptions({
      queryKey: metaKeys.races(),
      queryFn: ({ signal }) => getMetadata("races", signal),
      staleTime: Infinity,
      gcTime: Infinity,
    }),
  archetypes: () =>
    queryOptions({
      queryKey: metaKeys.archetypes(),
      queryFn: ({ signal }) => getMetadata("archetypes", signal),
      staleTime: Infinity,
      gcTime: Infinity,
    }),
};

export const deckQueries = {
  formats: () =>
    queryOptions({
      queryKey: formatKeys.all,
      queryFn: ({ signal }) => getFormats(signal),
      staleTime: Infinity,
      gcTime: Infinity,
    }),
  detail: (id?: string | number | null) =>
    queryOptions({
      queryKey: deckKeys.detail(id),
      queryFn: ({ signal }) => getDeck(id!, signal),
      enabled: !!id,
    }),
  list: (params: Record<string, string>) =>
    queryOptions({
      queryKey: deckKeys.list(params),
      queryFn: ({ signal }) => getDecks(getDecksQueryEndpoint(new URLSearchParams(params)), signal),
    }),
};

export const cardQueries = {
  detail: (id?: string | number | null) =>
    queryOptions({
      queryKey: cardKeys.detail(id),
      queryFn: ({ signal }) => getCard(id!, signal),
      enabled: !!id,
    }),
  suggestions: (query: string) =>
    queryOptions({
      queryKey: cardKeys.suggestions(query.trim()),
      queryFn: ({ signal }) =>
        getSuggestions(getCardSuggestionsEndpoint(query.trim()), signal),
      enabled: query.trim().length >= 2,
      staleTime: 60 * 1000,
    }),
  list: (params: Record<string, string>) =>
    queryOptions({
      queryKey: cardKeys.list(params),
      queryFn: ({ signal }) => getCards(getCardsEndpoint(new URLSearchParams(params)), signal),
    }),
};
