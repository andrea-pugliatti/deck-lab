import { useMemo } from "react";

import { getDecksQueryEndpoint } from "../services/deck";
import type { Deck, Page } from "../types";
import { useSearch } from "./useSearch";

/**
 * Filter state representation for decks.
 */
export interface DeckFiltersState {
  format: string;
  username: string;
}

/**
 * Configuration options for searching decks.
 * Supports both controlled state variables and initial uncontrolled fallbacks.
 */
export interface UseDeckSearchOptions {
  page?: number;
  setPage?: (page: number) => void;
  searchQuery?: string;
  setSearchQuery?: (query: string) => void;
  format?: string;
  setFormat?: (format: string) => void;
  username?: string;
  setUsername?: (username: string) => void;

  initialPage?: number;
  initialQuery?: string;
  initialFormat?: string;
  initialUsername?: string;
  pageSize?: number;
  debounceTime?: number;
  skip?: boolean;
  syncUrl?: boolean;
}

/**
 * Custom React hook that handles searching, filtering, and pagination logic
 * for the user decks directory.
 * Connects database queries, input debouncing, and API pagination parameters.
 *
 * @param options - Deck search options and states.
 * @returns Deck search results, loading state, pagination details, and mutators.
 */
export function useDeckSearch(options: UseDeckSearchOptions = {}) {
  const {
    page,
    setPage,
    searchQuery,
    setSearchQuery,
    format,
    setFormat,
    username,
    setUsername,
    initialPage = 0,
    initialQuery = "",
    initialFormat = "ALL",
    initialUsername = "",
    pageSize = 6,
    debounceTime = 400,
    skip = false,
    syncUrl = false,
  } = options;

  // Map flat format/username options to structured DeckFiltersState for the generic hook
  const controlledFilters = useMemo(() => {
    if (format !== undefined || username !== undefined) {
      return {
        format: format !== undefined ? format : "ALL",
        username: username !== undefined ? username : "",
      };
    }
    return undefined;
  }, [format, username]);

  const controlledSetFilters = useMemo(() => {
    if (setFormat || setUsername) {
      return (nextFilters: DeckFiltersState | ((prev: DeckFiltersState) => DeckFiltersState)) => {
        const prev = {
          format: format !== undefined ? format : "ALL",
          username: username !== undefined ? username : "",
        };
        const resolved = typeof nextFilters === "function" ? nextFilters(prev) : nextFilters;
        if (setFormat && resolved.format !== prev.format) {
          setFormat(resolved.format);
        }
        if (setUsername && resolved.username !== prev.username) {
          setUsername(resolved.username);
        }
      };
    }
    return undefined;
  }, [setFormat, setUsername, format, username]);

  const {
    page: activePage,
    setPage: handleSetPage,
    searchQuery: activeSearchQuery,
    setSearchQuery: handleSetSearchQuery,
    filters: activeFilters,
    setFilters: handleSetFilters,
    debouncedQuery,
    data,
    loading,
    error,
    refetch,
  } = useSearch<Page<Deck>, DeckFiltersState>(
    (query, p, f) => {
      if (skip) return undefined;
      const queryParams = new URLSearchParams();
      if (query.trim()) {
        queryParams.append("q", query.trim());
      }
      if (f.format !== "ALL") {
        queryParams.append("format", f.format);
      }
      if (f.username) {
        queryParams.append("username", f.username);
      }
      queryParams.append("page", p.toString());
      queryParams.append("size", pageSize.toString());

      return getDecksQueryEndpoint(queryParams);
    },
    {
      page,
      setPage,
      searchQuery,
      setSearchQuery,
      filters: controlledFilters,
      setFilters: controlledSetFilters,
      initialPage,
      initialSearchQuery: initialQuery,
      initialFilters: {
        format: initialFormat,
        username: initialUsername,
      },
      debounceTime,
      syncUrl,
      urlConfig: {
        parse: (params) => ({
          format: params.get("format") || "ALL",
          username: username || "",
        }),
        serialize: (params, f) => {
          if (f.format !== "ALL") {
            params.set("format", f.format);
          } else {
            params.delete("format");
          }
          // Note: username is not synchronized to URL
        },
      },
    },
  );

  const decks = data?.content || [];
  const totalPages = data?.page?.totalPages || 0;
  const totalElements = data?.page?.totalElements || 0;

  const handleSetFormat = (nextFormat: string) => {
    handleSetFilters((prev) => ({ ...prev, format: nextFormat }));
  };

  const handleSetUsername = (nextUsername: string) => {
    handleSetFilters((prev) => ({ ...prev, username: nextUsername }));
  };

  return {
    page: activePage,
    setPage: handleSetPage,
    searchQuery: activeSearchQuery,
    setSearchQuery: handleSetSearchQuery,
    format: activeFilters.format,
    setFormat: handleSetFormat,
    username: activeFilters.username,
    setUsername: handleSetUsername,
    debouncedQuery,
    decks,
    loading,
    error,
    totalPages,
    totalElements,
    refetch,
  };
}
