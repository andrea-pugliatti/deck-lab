import type {
  AiGeneratedDeck,
  Deck,
  DeckCardItem,
  DeckPayload,
  ErrorPayload,
  Page,
  Suggestion,
} from "../types";
import { apiFetch, parseResponseError, parseResponseErrors } from "./api";

/**
 * Generates the API endpoint URL for fetching all supported deck formats.
 *
 * @returns The resolved formats endpoint path.
 */
export function getFormatsEndpoint(): string {
  return "/api/decks/formats";
}

/**
 * Generates the API endpoint URL for fetching a single deck by its ID.
 *
 * @param id - The unique identifier of the deck.
 * @returns The resolved deck endpoint path.
 */
export function getDeckEndpoint(id: string | number): string {
  return `/api/decks/${id}`;
}

/**
 * Generates the API endpoint URL for querying decks (optionally filtered by username).
 *
 * @param username - The optional username filter.
 * @returns The resolved decks search path.
 */
export function getDecksEndpoint(username?: string): string {
  if (username) {
    return `/api/decks?username=${encodeURIComponent(username)}`;
  }
  return "/api/decks";
}

/**
 * Generates the API endpoint URL with query parameters for search/paging decks.
 *
 * @param params - The URLSearchParams parameters.
 * @returns The resolved endpoint path with query parameters.
 */
export function getDecksQueryEndpoint(params: URLSearchParams): string {
  return `/api/decks?${params.toString()}`;
}

/**
 * Fetches a single deck detail from the backend.
 *
 * @param id - The unique ID string of the deck.
 * @returns A promise resolving to the Deck details.
 * @throws {Error} If the request fails.
 */
export async function getDeck(id: string | number, signal?: AbortSignal): Promise<Deck> {
  const res = await apiFetch(`/api/decks/${id}`, { signal });
  if (!res.ok) {
    throw await parseResponseError(res);
  }
  return res.json() as Promise<Deck>;
}

/**
 * Fetches all supported formats.
 */
export async function getFormats(signal?: AbortSignal): Promise<string[]> {
  const res = await apiFetch("/api/decks/formats", { signal });
  if (!res.ok) {
    throw await parseResponseError(res);
  }
  return res.json() as Promise<string[]>;
}

/**
 * Fetches a paginated page of Deck blueprints.
 */
export async function getDecks(fetchUrl: string, signal?: AbortSignal): Promise<Page<Deck>> {
  const res = await apiFetch(fetchUrl, { signal });
  if (!res.ok) {
    throw await parseResponseError(res);
  }
  return res.json() as Promise<Page<Deck>>;
}

/**
 * Validates a deck's card composition via server-side rules.
 *
 * @param payload - The deck representation to validate.
 * @returns A promise resolving to an ErrorPayload indicating success or errors.
 */
export async function validateDeck(payload: DeckPayload): Promise<ErrorPayload> {
  try {
    const res = await apiFetch("/api/decks/validate", {
      method: "POST",
      body: JSON.stringify(payload),
    });

    if (res.ok) {
      return { ok: true };
    } else {
      const errorsList = await parseResponseErrors(res);
      return { ok: false, errors: errorsList };
    }
  } catch (err) {
    return {
      ok: false,
      errors: [err instanceof Error ? err.message : "Connection error during deck validation."],
    };
  }
}

/**
 * Saves a new deck or updates an existing deck.
 *
 * @param payload - The deck data payload.
 * @param id - Optional deck ID. If provided, updates the existing deck; otherwise, creates a new one.
 * @returns A promise resolving to the saved Deck details.
 * @throws {Error} If saving fails.
 */
export async function saveDeck(payload: DeckPayload, id?: string): Promise<Deck> {
  const url = id ? `/api/decks/${id}` : "/api/decks";
  const method = id ? "PUT" : "POST";

  const res = await apiFetch(url, {
    method,
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    throw await parseResponseError(res);
  }

  return res.json() as Promise<Deck>;
}

/**
 * Deletes a deck by its unique ID.
 *
 * @param id - The ID of the deck to delete.
 * @returns A promise resolving when the deletion is complete.
 * @throws {Error} If deleting fails.
 */
export async function deleteDeck(id: string | number): Promise<void> {
  const res = await apiFetch(`/api/decks/${id}`, {
    method: "DELETE",
  });

  if (!res.ok) {
    throw await parseResponseError(res);
  }
}

/**
 * Requests AI-powered card suggestions based on the deck's active cards and format rules.
 *
 * @param formatName - The name of the selected game format (e.g. "GOAT").
 * @param currentCards - The current list of cards in the deck builder.
 * @returns A promise resolving to an array of Synergy Suggestions.
 * @throws {Error} If the suggestion request fails.
 */
export async function fetchAiSuggestions(
  formatName: string,
  currentCards: DeckCardItem[],
): Promise<Suggestion[]> {
  const res = await apiFetch("/api/decks/ai/suggest", {
    method: "POST",
    body: JSON.stringify({
      formatName,
      currentCards,
    }),
  });

  if (!res.ok) {
    throw await parseResponseError(res);
  }

  const data = (await res.json()) as Suggestion[];
  return data || [];
}

/**
 * Uses generative AI to design a fully valid deck based on an archetype and strategy.
 *
 * @param payload - Setup details including archetype name, strategy keyword, format, and custom requirements.
 * @returns A promise resolving to the AI-generated deck details.
 * @throws {Error} If generation fails.
 */
export async function generateAiDeck(payload: {
  archetype: string;
  strategy: string;
  formatName: string;
  customPrompt?: string;
}): Promise<AiGeneratedDeck> {
  const res = await apiFetch("/api/decks/ai/generate", {
    method: "POST",
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    throw await parseResponseError(res);
  }

  return res.json() as Promise<AiGeneratedDeck>;
}
