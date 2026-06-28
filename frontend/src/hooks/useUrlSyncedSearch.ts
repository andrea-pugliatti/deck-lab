import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router";

import type { CardFiltersState } from "../types";
import { useCatalogSearch } from "./useCatalogSearch";

export interface UseUrlSyncedSearchOptions {
  defaultPageSize?: number;
}

export function useUrlSyncedSearch(options: UseUrlSyncedSearchOptions = {}) {
  const { defaultPageSize = 20 } = options;
  const [searchParams, setSearchParams] = useSearchParams();

  // 1. Resolve state directly from URL parameters
  const urlPage = parseInt(searchParams.get("page") || "0", 10);
  const urlQuery = searchParams.get("q") || "";
  const urlFilters = useMemo(
    (): CardFiltersState => ({
      type: searchParams.get("type") || "ALL",
      attribute: searchParams.get("attribute") || "ALL",
      race: searchParams.get("race") || "ALL",
      archetype: searchParams.get("archetype") || "ALL",
    }),
    [searchParams],
  );

  // 2. Manage immediate search query locally to avoid input lag
  const [searchQuery, setSearchQuery] = useState(urlQuery);
  const [prevUrlQuery, setPrevUrlQuery] = useState(urlQuery);

  if (urlQuery !== prevUrlQuery) {
    setPrevUrlQuery(urlQuery);
    setSearchQuery(urlQuery);
  }

  // 3. Define state setters that modify URL parameters directly (acting as the state store)
  const setPage = (page: number) => {
    const params = new URLSearchParams(searchParams);
    if (page > 0) {
      params.set("page", page.toString());
    } else {
      params.delete("page");
    }
    setSearchParams(params);
  };

  const setFilters = (
    nextFilters: CardFiltersState | ((prev: CardFiltersState) => CardFiltersState),
  ) => {
    const resolved = typeof nextFilters === "function" ? nextFilters(urlFilters) : nextFilters;
    const params = new URLSearchParams(searchParams);

    if (resolved.type !== "ALL") params.set("type", resolved.type);
    else params.delete("type");

    if (resolved.attribute !== "ALL") params.set("attribute", resolved.attribute);
    else params.delete("attribute");

    if (resolved.race !== "ALL") params.set("race", resolved.race);
    else params.delete("race");

    if (resolved.archetype !== "ALL") params.set("archetype", resolved.archetype);
    else params.delete("archetype");

    params.delete("page"); // reset page on filter change
    setSearchParams(params);
  };

  // 4. Instantiate the pure, in-memory hook under controlled mode
  // The debounce time is 400ms for URL syncing (matching original logic)
  const searchState = useCatalogSearch({
    page: urlPage,
    setPage,
    filters: urlFilters,
    setFilters,
    searchQuery,
    setSearchQuery,
    defaultPageSize,
    debounceTime: 400,
  });

  // 5. Synchronize the debounced query from the pure hook back to the URL
  const { debouncedQuery } = searchState;
  useEffect(() => {
    if (debouncedQuery.trim() !== urlQuery.trim()) {
      const params = new URLSearchParams(searchParams);
      if (debouncedQuery.trim()) {
        params.set("q", debouncedQuery.trim());
      } else {
        params.delete("q");
      }
      params.delete("page"); // reset page on query change
      setSearchParams(params);
    }
  }, [debouncedQuery, urlQuery, searchParams, setSearchParams]);

  return searchState;
}
