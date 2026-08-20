/**
 * @file useSearch.ts
 * @description Generic React hook that encapsulates searching, filtering, and paging.
 * Supports debouncing, local vs. controlled state, and optionally syncing with URL search parameters.
 */

import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router";

import { apiFetch, parseResponseError } from "../services/api";
import { useDebounce } from "./useDebounce";

/**
 * Configuration options for the generic useSearch hook.
 */
export interface UseSearchOptions<TFilters> {
  // Controlled state inputs
  page?: number;
  setPage?: (page: number) => void;
  searchQuery?: string;
  setSearchQuery?: (query: string) => void;
  filters?: TFilters;
  setFilters?: (nextFilters: TFilters | ((prev: TFilters) => TFilters)) => void;

  // Uncontrolled state fallbacks/defaults
  initialPage?: number;
  initialSearchQuery?: string;
  initialFilters?: TFilters;

  // Configuration settings
  debounceTime?: number;
  syncUrl?: boolean;
  urlConfig?: {
    parse: (params: URLSearchParams) => TFilters;
    serialize: (params: URLSearchParams, filters: TFilters) => void;
  };
}

/**
 * Generic React hook that encapsulates searching, filtering, and paging.
 * Supports debouncing, local vs. controlled state, and optionally syncing with URL search parameters.
 *
 * @param endpointBuilder - A function that constructs the fetch URL based on the current state.
 * @param options - Configuration options for the hook.
 */
export function useSearch<TData, TFilters>(
  endpointBuilder: (query: string, page: number, filters: TFilters) => string | undefined,
  options: UseSearchOptions<TFilters> = {},
) {
  const {
    page: controlledPage,
    setPage: controlledSetPage,
    searchQuery: controlledSearchQuery,
    setSearchQuery: controlledSetSearchQuery,
    filters: controlledFilters,
    setFilters: controlledSetFilters,
    initialPage = 0,
    initialSearchQuery = "",
    initialFilters,
    debounceTime = 300,
    syncUrl = false,
    urlConfig,
  } = options;

  const [searchParams, setSearchParams] = useSearchParams();

  // URL State Parsing (if syncUrl is enabled)
  const urlPage = !syncUrl
    ? initialPage
    : (() => {
        const pageParam = searchParams.get("page");
        return pageParam !== null ? parseInt(pageParam, 10) : initialPage;
      })();

  const urlQuery = !syncUrl
    ? initialSearchQuery
    : (() => {
        const qParam = searchParams.get("q");
        return qParam !== null ? qParam : initialSearchQuery;
      })();

  const urlFilters =
    !syncUrl || !urlConfig ? (initialFilters as TFilters) : urlConfig.parse(searchParams);

  // Uncontrolled State Fallbacks
  const [localPage, setLocalPage] = useState(initialPage);
  const [localFilters, setLocalFilters] = useState<TFilters>(initialFilters as TFilters);
  const [localSearchQuery, setLocalSearchQuery] = useState(initialSearchQuery);

  // Uncontrolled URL-sync local query (updates immediately on keystrokes)
  const [urlLocalQuery, setUrlLocalQuery] = useState(urlQuery);
  const [prevUrlQuery, setPrevUrlQuery] = useState(urlQuery);

  // Adjust during render — no effect, no extra commit
  if (syncUrl && urlQuery !== prevUrlQuery) {
    setPrevUrlQuery(urlQuery);
    setUrlLocalQuery(urlQuery);
  }

  // Compute Active State Values
  const activePage = syncUrl ? urlPage : controlledPage !== undefined ? controlledPage : localPage;

  const activeFilters = syncUrl
    ? urlFilters
    : controlledFilters !== undefined
      ? controlledFilters
      : localFilters;

  const activeSearchQuery =
    controlledSearchQuery !== undefined
      ? controlledSearchQuery
      : syncUrl
        ? urlLocalQuery
        : localSearchQuery;

  // Debouncing search queries
  const debouncedQuery = useDebounce(activeSearchQuery, debounceTime);

  // State Setters
  const setPage = (nextPage: number) => {
    if (syncUrl) {
      const params = new URLSearchParams(searchParams);
      if (nextPage === 0) {
        params.delete("page");
      } else {
        params.set("page", nextPage.toString());
      }
      setSearchParams(params);
    }
    if (controlledSetPage) {
      controlledSetPage(nextPage);
    } else {
      setLocalPage(nextPage);
    }
  };

  const setSearchQuery = (nextQuery: string) => {
    if (syncUrl) {
      setUrlLocalQuery(nextQuery);
    }
    if (controlledSetSearchQuery) {
      controlledSetSearchQuery(nextQuery);
    } else {
      setLocalSearchQuery(nextQuery);
      setLocalPage(0);
    }
  };

  const setFilters = (valueOrUpdater: TFilters | ((prev: TFilters) => TFilters)) => {
    const next =
      typeof valueOrUpdater === "function"
        ? (valueOrUpdater as (prev: TFilters) => TFilters)(activeFilters)
        : valueOrUpdater;

    if (syncUrl) {
      if (urlConfig) {
        const params = new URLSearchParams(searchParams);
        urlConfig.serialize(params, next);
        params.delete("page");
        setSearchParams(params);
      }
    }

    if (controlledSetFilters) {
      controlledSetFilters(next);
    } else {
      setLocalFilters(next);
      setLocalPage(0);
    }
  };

  // Sync debounced search queries to URL parameters (only when active query differs)
  useEffect(() => {
    if (syncUrl && debouncedQuery.trim() !== urlQuery.trim()) {
      const params = new URLSearchParams(searchParams);
      if (debouncedQuery.trim()) {
        params.set("q", debouncedQuery.trim());
      } else {
        params.delete("q");
      }
      params.delete("page"); // Reset page on query changes
      setSearchParams(params);
    }
  }, [syncUrl, debouncedQuery, urlQuery, searchParams, setSearchParams]);

  // Execute fetch
  const fetchUrl = endpointBuilder(debouncedQuery, activePage, activeFilters);
  const {
    data,
    isLoading: loading,
    error,
    refetch,
  } = useQuery<TData>({
    queryKey: [fetchUrl],
    queryFn: async ({ signal }) => {
      if (!fetchUrl) return undefined as unknown as TData;
      const res = await apiFetch(fetchUrl, { signal });
      if (!res.ok) {
        throw await parseResponseError(res);
      }
      if (res.status === 204) {
        return undefined as unknown as TData;
      }
      return res.json() as Promise<TData>;
    },
    enabled: !!fetchUrl,
  });

  return {
    page: activePage,
    setPage,
    searchQuery: activeSearchQuery,
    setSearchQuery,
    filters: activeFilters,
    setFilters,
    debouncedQuery,
    data,
    loading,
    error,
    refetch,
  };
}
