/**
 * @file queryKeys.ts
 * @description TanStack Query key factories.
 *
 * Provides structured, hierarchical query key factories for every entity
 * type used in the application. Keys are organized from general to specific
 * (entity -> modifier -> id -> filters) so that prefix-based cache invalidation
 * works via queryClient.invalidateQueries({ queryKey: entityKeys.all }).
 */

export const deckKeys = {
  all: ["decks"] as const,
  lists: () => [...deckKeys.all, "list"] as const,
  list: (filters?: Record<string, unknown>) => [...deckKeys.lists(), filters] as const,
  details: () => [...deckKeys.all, "detail"] as const,
  detail: (id?: string | number) => [...deckKeys.details(), id] as const,
};

export const cardKeys = {
  all: ["cards"] as const,
  lists: () => [...cardKeys.all, "list"] as const,
  list: (filters?: Record<string, unknown>) => [...cardKeys.lists(), filters] as const,
  details: () => [...cardKeys.all, "detail"] as const,
  detail: (id?: string | number) => [...cardKeys.details(), id] as const,
  suggestions: (query: string) => [...cardKeys.all, "suggestions", query] as const,
};

export const formatKeys = {
  all: ["formats"] as const,
};

export const metaKeys = {
  all: ["metadata"] as const,
  types: () => [...metaKeys.all, "types"] as const,
  attributes: () => [...metaKeys.all, "attributes"] as const,
  races: () => [...metaKeys.all, "races"] as const,
  archetypes: () => [...metaKeys.all, "archetypes"] as const,
};
