import type { Card, Page } from "../types";
import { apiFetch, parseResponseError } from "./api";

/**
 * Generates the API endpoint URL for fetching a single card by its ID.
 *
 * @param id - The unique ID of the card.
 * @returns The resolved endpoint path.
 */
export function getCardEndpoint(id: string | number): string {
  return `/api/cards/${id}`;
}

/**
 * Generates the API endpoint URL for searching/paging cards.
 *
 * @param params - The URLSearchParams containing filtering, sorting, or pagination settings.
 * @returns The resolved endpoint path with query string.
 */
export function getCardsEndpoint(params: URLSearchParams): string {
  return `/api/cards?${params.toString()}`;
}

/**
 * Generates the API endpoint URL for quick auto-suggest searches.
 *
 * @param query - The text fragment of the card name.
 * @returns The resolved endpoint path for suggestions (capped at 5 items).
 */
export function getCardSuggestionsEndpoint(query: string): string {
  return `/api/cards?q=${encodeURIComponent(query)}&size=5`;
}

/**
 * Generates the API endpoint URL for querying distinct card metadata collections.
 *
 * @param type - The metadata category to retrieve.
 * @returns The resolved endpoint path.
 */
export function getCardMetadataEndpoint(
  type: "types" | "attributes" | "races" | "archetypes",
): string {
  return `/api/cards/${type}`;
}

/**
 * Generates the API endpoint URL for querying supported Yu-Gi-Oh! deck formats.
 *
 * @returns The resolved endpoint path.
 */
export function getDeckFormatsEndpoint(): string {
  return "/api/decks/formats";
}

/**
 * Fetches a single card detail from the backend.
 *
 * @param id - The unique ID of the card.
 * @returns A promise resolving to the Card payload.
 * @throws {Error} If the server request fails.
 */
export async function getCard(id: string | number, signal?: AbortSignal): Promise<Card> {
  const res = await apiFetch(`/api/cards/${id}`, { signal });
  if (!res.ok) {
    throw await parseResponseError(res);
  }
  return res.json() as Promise<Card>;
}

/**
 * Fetches a page of Card objects from a given endpoint URL.
 */
export async function getCards(fetchUrl: string, signal?: AbortSignal): Promise<Page<Card>> {
  const res = await apiFetch(fetchUrl, { signal });
  if (!res.ok) {
    throw await parseResponseError(res);
  }
  return res.json() as Promise<Page<Card>>;
}

/**
 * Fetches autocomplete search suggestions.
 */
export async function getSuggestions(
  fetchUrl: string,
  signal?: AbortSignal,
): Promise<{ content: { id: number; name: string; type: string }[] }> {
  const res = await apiFetch(fetchUrl, { signal });
  if (!res.ok) {
    throw await parseResponseError(res);
  }
  return res.json() as Promise<{ content: { id: number; name: string; type: string }[] }>;
}

/**
 * Fetches the list of values for a specific card metadata type.
 */
export async function getMetadata(
  type: "types" | "attributes" | "races" | "archetypes",
  signal?: AbortSignal,
): Promise<string[]> {
  const res = await apiFetch(`/api/cards/${type}`, { signal });
  if (!res.ok) {
    throw await parseResponseError(res);
  }
  return res.json() as Promise<string[]>;
}
