import type { Path } from "react-router";

/**
 * Navigation location state passed when redirecting to auth pages.
 */
export interface AuthLocationState {
  from?: string | Partial<Path>;
}

/**
 * Type predicate guard to safely check if an unknown value matches AuthLocationState.
 *
 * @param state - The unknown state from location.state.
 * @returns True if state conforms to AuthLocationState.
 */
export function isAuthLocationState(state: unknown): state is AuthLocationState {
  if (typeof state !== "object" || state === null) {
    return false;
  }
  const candidate = state as Record<string, unknown>;
  if (!("from" in candidate) || candidate.from === undefined) {
    return true;
  }
  const from = candidate.from;
  return typeof from === "string" || (typeof from === "object" && from !== null);
}

/**
 * Safely extracts the destination redirect path from an unknown location.state value,
 * falling back to the provided default path if unspecified or invalid.
 *
 * @param state - The unknown location.state value.
 * @param fallback - The fallback route path. Defaults to "/decks".
 * @returns The resolved redirection path.
 */
export function getRedirectPath(state: unknown, fallback = "/decks"): string {
  if (!isAuthLocationState(state) || !state.from) {
    return fallback;
  }
  if (typeof state.from === "string") {
    return state.from;
  }
  const { pathname = "", search = "", hash = "" } = state.from;
  return `${pathname}${search}${hash}` || fallback;
}
