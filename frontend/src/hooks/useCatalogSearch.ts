import { useState } from "react";

import { getCardsEndpoint } from "../services/card";
import type { Card, CardFiltersState, Page } from "../types";
import { useDebounce } from "./useDebounce";
import { useFetch } from "./useFetch";

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
}

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
  } = options;

  // Uncontrolled state fallbacks
  const [localPage, setLocalPage] = useState(initialPage);
  const [localFilters, setLocalFilters] = useState<CardFiltersState>(initialFilters);
  const [localSearchQuery, setLocalSearchQuery] = useState(initialSearchQuery);

  const searchPage = page !== undefined ? page : localPage;
  const activeFilters = filters !== undefined ? filters : localFilters;
  const activeSearchQuery = searchQuery !== undefined ? searchQuery : localSearchQuery;

  // Setters
  const setSearchPage = (nextPage: number) => {
    if (setPage) {
      setPage(nextPage);
    } else {
      setLocalPage(nextPage);
    }
  };

  const handleSetSearchQuery = (nextQuery: string) => {
    if (setSearchQuery) {
      setSearchQuery(nextQuery);
    } else {
      setLocalSearchQuery(nextQuery);
    }
  };

  const handleSetFilters = (
    nextFilters: CardFiltersState | ((prev: CardFiltersState) => CardFiltersState),
  ) => {
    if (setFilters) {
      setFilters(nextFilters);
    } else {
      setLocalFilters((prev) => {
        const resolved = typeof nextFilters === "function" ? nextFilters(prev) : nextFilters;
        setLocalPage(0); // Reset page on filter change in uncontrolled mode
        return resolved;
      });
    }
  };

  const debouncedQuery = useDebounce(activeSearchQuery, debounceTime);

  const [prevDebouncedQuery, setPrevDebouncedQuery] = useState(debouncedQuery);

  if (debouncedQuery !== prevDebouncedQuery) {
    setPrevDebouncedQuery(debouncedQuery);
    if (page === undefined) {
      setLocalPage(0);
    }
  }

  const queryParams = new URLSearchParams();
  const activeQuery = debouncedQuery;
  if (activeQuery.trim()) {
    queryParams.append("q", activeQuery.trim());
  }
  if (activeFilters.type !== "ALL") {
    queryParams.append("type", activeFilters.type);
  }
  if (activeFilters.attribute !== "ALL") {
    queryParams.append("attribute", activeFilters.attribute);
  }
  if (activeFilters.race !== "ALL") {
    queryParams.append("race", activeFilters.race);
  }
  if (activeFilters.archetype !== "ALL") {
    queryParams.append("archetype", activeFilters.archetype);
  }
  queryParams.append("page", searchPage.toString());
  queryParams.append("size", defaultPageSize.toString());

  // Fetch results
  const {
    data,
    loading: libraryLoading,
    error,
    refetch,
  } = useFetch<Page<Card>>(getCardsEndpoint(queryParams));

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
