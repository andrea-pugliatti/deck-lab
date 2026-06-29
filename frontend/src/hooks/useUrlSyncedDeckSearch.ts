import { useEffect, useState } from "react";
import { useSearchParams } from "react-router";

import { useDeckSearch } from "./useDeckSearch";

export function useUrlSyncedDeckSearch(
  options: { defaultPageSize?: number; username?: string; skip?: boolean } = {},
) {
  const { defaultPageSize = 9, username = "", skip } = options;
  const [searchParams, setSearchParams] = useSearchParams();

  const urlPage = parseInt(searchParams.get("page") || "0", 10);
  const urlQuery = searchParams.get("q") || "";
  const urlFormat = searchParams.get("format") || "ALL";

  const [searchQuery, setSearchQuery] = useState(urlQuery);
  const [prevUrlQuery, setPrevUrlQuery] = useState(urlQuery);

  if (urlQuery !== prevUrlQuery) {
    setPrevUrlQuery(urlQuery);
    setSearchQuery(urlQuery);
  }

  const setPage = (page: number) => {
    const params = new URLSearchParams(searchParams);
    if (page > 0) {
      params.set("page", page.toString());
    } else {
      params.delete("page");
    }
    setSearchParams(params);
  };

  const setFormat = (format: string) => {
    const params = new URLSearchParams(searchParams);
    if (format !== "ALL") {
      params.set("format", format);
    } else {
      params.delete("format");
    }
    params.delete("page"); // Reset page
    setSearchParams(params);
  };

  const searchState = useDeckSearch({
    page: urlPage,
    setPage,
    format: urlFormat,
    setFormat,
    username,
    searchQuery,
    setSearchQuery,
    pageSize: defaultPageSize,
    skip,
  });

  const { debouncedQuery } = searchState;

  useEffect(() => {
    if (debouncedQuery.trim() !== urlQuery.trim()) {
      const params = new URLSearchParams(searchParams);
      if (debouncedQuery.trim()) {
        params.set("q", debouncedQuery.trim());
      } else {
        params.delete("q");
      }
      params.delete("page"); // Reset page
      setSearchParams(params);
    }
  }, [debouncedQuery, urlQuery, searchParams, setSearchParams]);

  return searchState;
}
