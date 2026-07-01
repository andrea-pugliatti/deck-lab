import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router";

import { useDebounce } from "./useDebounce";
import { useFetch } from "./useFetch";

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
  const urlPage = useMemo(() => {
    if (!syncUrl) return 0;
    return parseInt(searchParams.get("page") || "0", 10);
  }, [syncUrl, searchParams]);

  const urlQuery = useMemo(() => {
    if (!syncUrl) return "";
    return searchParams.get("q") || "";
  }, [syncUrl, searchParams]);

  const urlFilters = useMemo(() => {
    if (!syncUrl || !urlConfig) return initialFilters as TFilters;
    return urlConfig.parse(searchParams);
  }, [syncUrl, urlConfig, searchParams, initialFilters]);

  // Uncontrolled State Fallbacks
  const [localPage, setLocalPage] = useState(initialPage);
  const [localFilters, setLocalFilters] = useState<TFilters>(initialFilters as TFilters);
  const [localSearchQuery, setLocalSearchQuery] = useState(initialSearchQuery);

  // Uncontrolled URL-sync local query (updates immediately on keystrokes)
  const [urlLocalQuery, setUrlLocalQuery] = useState(urlQuery);
  const [prevUrlQuery, setPrevUrlQuery] = useState(urlQuery);

  if (syncUrl && urlQuery !== prevUrlQuery) {
    setPrevUrlQuery(urlQuery);
    setUrlLocalQuery(urlQuery);
  }

  // Compute Active State Values
  const activePage = useMemo(() => {
    if (syncUrl) return urlPage;
    return controlledPage !== undefined ? controlledPage : localPage;
  }, [syncUrl, urlPage, controlledPage, localPage]);

  const activeFilters = useMemo(() => {
    if (syncUrl) return urlFilters;
    return controlledFilters !== undefined ? controlledFilters : localFilters;
  }, [syncUrl, urlFilters, controlledFilters, localFilters]);

  const activeSearchQuery = useMemo(() => {
    if (syncUrl) {
      return controlledSearchQuery !== undefined ? controlledSearchQuery : urlLocalQuery;
    }
    return controlledSearchQuery !== undefined ? controlledSearchQuery : localSearchQuery;
  }, [syncUrl, controlledSearchQuery, urlLocalQuery, localSearchQuery]);

  // Debouncing search queries
  const debouncedQuery = useDebounce(activeSearchQuery, debounceTime);

  // State Setters
  const setPage = (nextPage: number) => {
    if (syncUrl) {
      const params = new URLSearchParams(searchParams);
      if (nextPage > 0) {
        params.set("page", nextPage.toString());
      } else {
        params.delete("page");
      }
      setSearchParams(params);
    } else {
      if (controlledSetPage) {
        controlledSetPage(nextPage);
      } else {
        setLocalPage(nextPage);
      }
    }
  };

  const setSearchQuery = (nextQuery: string) => {
    if (syncUrl) {
      if (controlledSetSearchQuery) {
        controlledSetSearchQuery(nextQuery);
      } else {
        setUrlLocalQuery(nextQuery);
      }
    } else {
      if (controlledSetSearchQuery) {
        controlledSetSearchQuery(nextQuery);
      } else {
        setLocalSearchQuery(nextQuery);
      }
    }
  };

  const setFilters = (nextFilters: TFilters | ((prev: TFilters) => TFilters)) => {
    if (syncUrl) {
      const resolved =
        typeof nextFilters === "function"
          ? (nextFilters as (prev: TFilters) => TFilters)(urlFilters)
          : nextFilters;

      const params = new URLSearchParams(searchParams);
      if (urlConfig) {
        urlConfig.serialize(params, resolved);
      }
      params.delete("page"); // Reset page on filter changes
      setSearchParams(params);
    } else {
      if (controlledSetFilters) {
        controlledSetFilters(nextFilters);
      } else {
        setLocalFilters((prev) => {
          const resolved =
            typeof nextFilters === "function"
              ? (nextFilters as (prev: TFilters) => TFilters)(prev)
              : nextFilters;
          setLocalPage(0); // Reset page on filter changes
          return resolved;
        });
      }
    }
  };

  // Sync debounced query to URL
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

  // Reset page when debouncedQuery changes (in uncontrolled non-url-synced mode)
  const [prevDebouncedQuery, setPrevDebouncedQuery] = useState(debouncedQuery);
  if (debouncedQuery !== prevDebouncedQuery) {
    setPrevDebouncedQuery(debouncedQuery);
    if (!syncUrl && controlledPage === undefined) {
      setLocalPage(0);
    }
  }

  // Execute fetch
  const fetchUrl = endpointBuilder(debouncedQuery, activePage, activeFilters);
  const { data, loading, error, refetch } = useFetch<TData>(fetchUrl);

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
