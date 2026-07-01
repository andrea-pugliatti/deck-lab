import { getCardsEndpoint } from "../services/card";
import type { Card, CardFiltersState, Page } from "../types";
import { useSearch } from "./useSearch";

/**
 * Options configuration for configuring the catalog search hooks.
 * Supports both controlled state parameters (passed down from parents/routing)
 * and initial uncontrolled fallbacks.
 */
export interface UseCatalogSearchOptions {
  page?: number;
  setPage?: (page: number) => void;
  filters?: CardFiltersState;
  setFilters?: (
    nextFilters: CardFiltersState | ((prev: CardFiltersState) => CardFiltersState),
  ) => void;
  searchQuery?: string;
  setSearchQuery?: (query: string) => void;

  initialPage?: number;
  initialFilters?: CardFiltersState;
  initialSearchQuery?: string;

  defaultPageSize?: number;
  debounceTime?: number;
  syncUrl?: boolean;
}

/**
 * Custom React hook that encapsulates searching, filtering, and paging the card catalog.
 * Manages query debouncing, local vs. controlled state sync, query param parsing,
 * and handles the fetch state lifecycle using useSearch.
 *
 * @param options - Hook configuration options.
 * @returns State parameters and action mutators for card library browsing.
 */
export function useCatalogSearch(options: UseCatalogSearchOptions = {}) {
  const {
    page,
    setPage,
    filters,
    setFilters,
    searchQuery,
    setSearchQuery,
    initialPage = 0,
    initialFilters = {
      type: "ALL",
      attribute: "ALL",
      race: "ALL",
      archetype: "ALL",
    },
    initialSearchQuery = "",
    defaultPageSize = 8,
    debounceTime = 300,
    syncUrl = false,
  } = options;

  const {
    page: searchPage,
    setPage: setSearchPage,
    searchQuery: activeSearchQuery,
    setSearchQuery: handleSetSearchQuery,
    filters: activeFilters,
    setFilters: handleSetFilters,
    debouncedQuery,
    data,
    loading: libraryLoading,
    error,
    refetch,
  } = useSearch<Page<Card>, CardFiltersState>(
    (query, p, f) => {
      const queryParams = new URLSearchParams();
      if (query.trim()) {
        queryParams.append("q", query.trim());
      }
      if (f.type !== "ALL") {
        queryParams.append("type", f.type);
      }
      if (f.attribute !== "ALL") {
        queryParams.append("attribute", f.attribute);
      }
      if (f.race !== "ALL") {
        queryParams.append("race", f.race);
      }
      if (f.archetype !== "ALL") {
        queryParams.append("archetype", f.archetype);
      }
      queryParams.append("page", p.toString());
      queryParams.append("size", defaultPageSize.toString());

      return getCardsEndpoint(queryParams);
    },
    {
      page,
      setPage,
      searchQuery,
      setSearchQuery,
      filters,
      setFilters,
      initialPage,
      initialSearchQuery,
      initialFilters,
      debounceTime,
      syncUrl,
      urlConfig: {
        parse: (params) => ({
          type: params.get("type") || "ALL",
          attribute: params.get("attribute") || "ALL",
          race: params.get("race") || "ALL",
          archetype: params.get("archetype") || "ALL",
        }),
        serialize: (params, f) => {
          if (f.type !== "ALL") params.set("type", f.type);
          else params.delete("type");

          if (f.attribute !== "ALL") params.set("attribute", f.attribute);
          else params.delete("attribute");

          if (f.race !== "ALL") params.set("race", f.race);
          else params.delete("race");

          if (f.archetype !== "ALL") params.set("archetype", f.archetype);
          else params.delete("archetype");
        },
      },
    },
  );

  const libraryCards = data?.content || [];
  const totalSearchPages = data?.page?.totalPages || 0;
  const totalElements = data?.page?.totalElements || 0;

  return {
    searchPage,
    setSearchPage,
    searchQuery: activeSearchQuery,
    setSearchQuery: handleSetSearchQuery,
    filters: activeFilters,
    setFilters: handleSetFilters,
    debouncedQuery,
    libraryCards,
    libraryLoading,
    totalSearchPages,
    totalElements,
    error,
    refetch,
  };
}
