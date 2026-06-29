import { useState } from "react";

import { getDecksQueryEndpoint } from "../services/deck";
import type { Deck, Page } from "../types";
import { useDebounce } from "./useDebounce";
import { useFetch } from "./useFetch";

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
}

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
  } = options;

  const [localPage, setLocalPage] = useState(initialPage);
  const [localSearchQuery, setLocalSearchQuery] = useState(initialQuery);
  const [localFormat, setLocalFormat] = useState(initialFormat);
  const [localUsername, setLocalUsername] = useState(initialUsername);

  const activePage = page !== undefined ? page : localPage;
  const activeSearchQuery = searchQuery !== undefined ? searchQuery : localSearchQuery;
  const activeFormat = format !== undefined ? format : localFormat;
  const activeUsername = username !== undefined ? username : localUsername;

  const handleSetPage = (nextPage: number) => {
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
      setLocalPage(0);
    }
  };

  const handleSetFormat = (nextFormat: string) => {
    if (setFormat) {
      setFormat(nextFormat);
    } else {
      setLocalFormat(nextFormat);
      setLocalPage(0);
    }
  };

  const handleSetUsername = (nextUsername: string) => {
    if (setUsername) {
      setUsername(nextUsername);
    } else {
      setLocalUsername(nextUsername);
      setLocalPage(0);
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
  if (debouncedQuery.trim()) {
    queryParams.append("q", debouncedQuery.trim());
  }
  if (activeFormat !== "ALL") {
    queryParams.append("format", activeFormat);
  }
  if (activeUsername) {
    queryParams.append("username", activeUsername);
  }
  queryParams.append("page", activePage.toString());
  queryParams.append("size", pageSize.toString());

  const fetchUrl = skip ? undefined : getDecksQueryEndpoint(queryParams);

  const { data, loading, error, refetch } = useFetch<Page<Deck>>(fetchUrl);

  const decks = data?.content || [];
  const totalPages = data?.page?.totalPages || 0;
  const totalElements = data?.page?.totalElements || 0;

  return {
    page: activePage,
    setPage: handleSetPage,
    searchQuery: activeSearchQuery,
    setSearchQuery: handleSetSearchQuery,
    format: activeFormat,
    setFormat: handleSetFormat,
    username: activeUsername,
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
