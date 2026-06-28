import type { Deck, Suggestion } from "../types";
import { apiFetch, parseResponseError } from "./api";
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

export async function validateDeck(payload: any): Promise<{ ok: boolean; errors?: string[] }> {
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
      let errorsList: string[] = [];
      try {
        const contentType = res.headers.get("content-type");
        if (contentType && contentType.includes("application/json")) {
          const errorData = await res.json();
          if (errorData) {
            if (Array.isArray(errorData.errors)) {
              errorsList = errorData.errors.map((e: any) => {
                if (typeof e === "string") return e;
                if (!e) return "Unknown validation error";
                return e.defaultMessage || e.message || e.error || String(e);
              });
            } else if (typeof errorData.message === "string") {
              errorsList = [errorData.message];
            } else if (typeof errorData.error === "string") {
              errorsList = [errorData.error];
            }
          }
        } else {
          const text = await res.text();
          if (text) {
            errorsList = [text];
          }
        }
      } catch (parseErr) {
        console.error("Failed to parse validation error response:", parseErr);
      }

      if (errorsList.length === 0) {
        errorsList = [
          `Validation failed with status ${res.status}: ${res.statusText || "Bad Request"}`,
        ];
      }

      return { ok: false, errors: errorsList };
    }
  } catch (err: any) {
    return { ok: false, errors: [err.message || "Connection error during deck validation."] };
  }
}

export async function saveDeck(payload: any, id?: string): Promise<Deck> {
  const url = id ? `/api/decks/${id}` : "/api/decks";
  const method = id ? "PUT" : "POST";

  const res = await apiFetch(url, {
    method,
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    throw await parseResponseError(res);
  }

  return res.json();
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
  currentCards: { name: string; section: string; quantity: number }[],
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

  const data = await res.json();
  return data || [];
}

export async function generateAiDeck(payload: {
  archetype: string;
  strategy: string;
  formatName: string;
  customPrompt: string | null;
}): Promise<any> {
  const res = await apiFetch("/api/decks/ai/generate", {
    method: "POST",
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    throw await parseResponseError(res);
  }

  return res.json();
}
