import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router";

import { getCardsEndpoint } from "../services/card";
import type { Card, CardFiltersState, Page } from "../types";
import { useDebounce } from "./useDebounce";
import { useFetch } from "./useFetch";

export interface UseCatalogSearchStateOptions {
  syncWithUrl?: boolean;
  defaultPageSize?: number;
}

export function useCatalogSearchState(options: UseCatalogSearchStateOptions = {}) {
  const { syncWithUrl = false, defaultPageSize = 8 } = options;
  const [searchParams, setSearchParams] = useSearchParams();

  // Local states (used if syncWithUrl is false)
  const [localPage, setLocalPage] = useState(0);
  const [localFilters, setLocalFilters] = useState<CardFiltersState>({
    type: "ALL",
    attribute: "ALL",
    race: "ALL",
    archetype: "ALL",
  });

  // Search input state (always local for immediate input binding)
  const initialSearchQuery = syncWithUrl ? searchParams.get("q") || "" : "";
  const [searchQuery, setSearchQuery] = useState(initialSearchQuery);
  const debouncedQuery = useDebounce(searchQuery, syncWithUrl ? 400 : 300);

  const [prevSearchParams, setPrevSearchParams] = useState(searchParams);
  const [prevDebouncedQuery, setPrevDebouncedQuery] = useState(debouncedQuery);

  if (searchParams !== prevSearchParams) {
    setPrevSearchParams(searchParams);
    if (syncWithUrl) {
      const urlQuery = searchParams.get("q") || "";
      setSearchQuery((prev) => (prev !== urlQuery ? urlQuery : prev));
    }
  }

  if (debouncedQuery !== prevDebouncedQuery) {
    setPrevDebouncedQuery(debouncedQuery);
    if (!syncWithUrl) {
      setLocalPage(0);
    }
  }

  // Sync debounced query to URL params
  useEffect(() => {
    if (syncWithUrl) {
      const currentUrlQuery = searchParams.get("q") || "";
      if (debouncedQuery.trim() !== currentUrlQuery.trim()) {
        const params = new URLSearchParams(searchParams);
        if (debouncedQuery.trim()) {
          params.set("q", debouncedQuery.trim());
        } else {
          params.delete("q");
        }
        params.delete("page");
        setSearchParams(params);
      }
    }
  }, [debouncedQuery, syncWithUrl, setSearchParams, searchParams]);

  // Resolve filters and page index
  const searchPage = syncWithUrl ? parseInt(searchParams.get("page") || "0", 10) : localPage;

  const filters = useMemo(() => {
    if (syncWithUrl) {
      return {
        type: searchParams.get("type") || "ALL",
        attribute: searchParams.get("attribute") || "ALL",
        race: searchParams.get("race") || "ALL",
        archetype: searchParams.get("archetype") || "ALL",
      };
    }
    return localFilters;
  }, [syncWithUrl, searchParams, localFilters]);

  // Setters
  const setSearchPage = (page: number) => {
    if (syncWithUrl) {
      const params = new URLSearchParams(searchParams);
      if (page > 0) {
        params.set("page", page.toString());
      } else {
        params.delete("page");
      }
      setSearchParams(params);
    } else {
      setLocalPage(page);
    }
  };

  const setFilters = (
    nextFilters: CardFiltersState | ((prev: CardFiltersState) => CardFiltersState),
  ) => {
    if (syncWithUrl) {
      const resolved = typeof nextFilters === "function" ? nextFilters(filters) : nextFilters;
      const params = new URLSearchParams(searchParams);

      if (resolved.type !== "ALL") params.set("type", resolved.type);
      else params.delete("type");

      if (resolved.attribute !== "ALL") params.set("attribute", resolved.attribute);
      else params.delete("attribute");

      if (resolved.race !== "ALL") params.set("race", resolved.race);
      else params.delete("race");

      if (resolved.archetype !== "ALL") params.set("archetype", resolved.archetype);
      else params.delete("archetype");

      params.delete("page");
      setSearchParams(params);
    } else {
      setLocalFilters((prev) => {
        const resolved = typeof nextFilters === "function" ? nextFilters(prev) : nextFilters;
        setLocalPage(0); // Reset page on filter change
        return resolved;
      });
    }
  };

  // Build query parameter URL
  const queryParams = new URLSearchParams();
  const activeQuery = syncWithUrl ? searchParams.get("q") || "" : debouncedQuery;
  if (activeQuery.trim()) {
    queryParams.append("q", activeQuery.trim());
  }
  if (filters.type !== "ALL") {
    queryParams.append("type", filters.type);
  }
  if (filters.attribute !== "ALL") {
    queryParams.append("attribute", filters.attribute);
  }
  if (filters.race !== "ALL") {
    queryParams.append("race", filters.race);
  }
  if (filters.archetype !== "ALL") {
    queryParams.append("archetype", filters.archetype);
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
    searchQuery,
    setSearchQuery,
    filters,
    setFilters,
    libraryCards,
    libraryLoading,
    totalSearchPages,
    totalElements,
    error,
    refetch,
  };
}
