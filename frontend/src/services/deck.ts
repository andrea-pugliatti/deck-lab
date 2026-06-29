import type {
  AiGeneratedDeck,
  Deck,
  DeckCardItem,
  DeckPayload,
  ErrorPayload,
  Suggestion,
} from "../types";
import { apiFetch, parseResponseError, parseResponseErrors } from "./api";
import { validateDeckSections } from "./validation";

export function getFormatsEndpoint(): string {
  return "/api/decks/formats";
}

export function getDeckEndpoint(id: string | number): string {
  return `/api/decks/${id}`;
}

export function getDecksEndpoint(username?: string): string {
  if (username) {
    return `/api/decks?username=${encodeURIComponent(username)}`;
  }
  return "/api/decks";
}

export function getDecksQueryEndpoint(params: URLSearchParams): string {
  return `/api/decks?${params.toString()}`;
}

export async function getDeck(id: string): Promise<Deck> {
  const res = await apiFetch(`/api/decks/${id}`);
  if (!res.ok) {
    throw new Error("Failed to load deck.");
  }
  return res.json();
}

export async function validateDeck(payload: DeckPayload): Promise<ErrorPayload> {
  // Local sections validation first
  const localErrors = validateDeckSections(payload.deckCards || [], payload.formatName);
  if (localErrors.length > 0) {
    return { ok: false, errors: localErrors };
  }

  // API validation
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

export async function deleteDeck(id: string | number): Promise<void> {
  const res = await apiFetch(`/api/decks/${id}`, {
    method: "DELETE",
  });

  if (!res.ok) {
    throw await parseResponseError(res);
  }
}

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
