import type { Card } from "../types";
import { apiFetch, parseResponseError } from "./api";

export function getCardEndpoint(id: string | number): string {
  return `/api/cards/${id}`;
}

export function getCardsEndpoint(params: URLSearchParams): string {
  return `/api/cards?${params.toString()}`;
}

export function getCardSuggestionsEndpoint(query: string): string {
  return `/api/cards?q=${encodeURIComponent(query)}&size=5`;
}

export function getCardMetadataEndpoint(
  type: "types" | "attributes" | "races" | "archetypes",
): string {
  return `/api/cards/${type}`;
}

export function getDeckFormatsEndpoint(): string {
  return "/api/decks/formats";
}

export async function getCard(id: string | number): Promise<Card> {
  const res = await apiFetch(`/api/cards/${id}`);
  if (!res.ok) {
    throw await parseResponseError(res);
  }
  return res.json();
}
