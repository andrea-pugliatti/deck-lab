import type {
  AiGeneratedDeck,
  Deck,
  DeckCardItem,
  DeckPayload,
  DeckValidation,
  Format,
  Page,
  Strategy,
  Suggestion,
  YdkImportResponse,
} from "../types";
import { apiFetch, parseResponseError, parseResponseErrors } from "./api";

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
 * @param id - The ID of the deck to fetch.
 * @returns A promise resolving to the Deck details object.
 * @throws {Error} If the HTTP request fails.
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
export async function validateDeck(payload: DeckPayload): Promise<DeckValidation> {
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
  formatName: Format,
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
  strategy: Strategy;
  formatName: Format;
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

/**
 * Imports a .ydk file into a resolved deck DTO structure with warnings.
 *
 * @param file - The .ydk file to import.
 * @returns A promise resolving to YdkImportResponse.
 */
export async function importYdk(file: File): Promise<YdkImportResponse> {
  const formData = new FormData();
  formData.append("file", file);

  const res = await apiFetch("/api/decks/import/ydk", {
    method: "POST",
    body: formData,
  });

  if (!res.ok) {
    throw await parseResponseError(res);
  }

  return res.json() as Promise<YdkImportResponse>;
}

/**
 * Exports a deck by ID to standard .ydk text format and triggers a browser download.
 *
 * @param deckId - The ID of the deck to export.
 * @param deckName - Optional deck name for the downloaded file.
 */
export async function exportYdk(deckId: number | string, deckName?: string): Promise<void> {
  const res = await apiFetch(`/api/decks/${deckId}/export/ydk`);
  if (!res.ok) {
    throw await parseResponseError(res);
  }

  const text = await res.text();
  const blob = new Blob([text], { type: "text/plain;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  const fileName = deckName
    ? `${deckName.toLowerCase().replace(/[^a-z0-9]/g, "_")}.ydk`
    : `deck_${deckId}.ydk`;
  a.download = fileName;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
