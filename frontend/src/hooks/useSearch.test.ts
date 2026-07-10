/**
 * @file useSearch.test.ts
 * @description Unit test suite for the useSearch hook.
 * Verifies uncontrolled and controlled states, URL parameter sync, debouncing integration,
 * and TanStack Query interactions.
 */

import { useQuery } from "@tanstack/react-query";
import { act, renderHook } from "@testing-library/react";
import { useSearchParams } from "react-router";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { useSearch } from "./useSearch";

vi.mock("react-router", () => ({
  useSearchParams: vi.fn(),
}));

vi.mock("@tanstack/react-query", () => ({
  useQuery: vi.fn(),
}));

vi.mock("./useDebounce", () => ({
  useDebounce: vi.fn((val) => val),
}));

describe("useSearch hook", () => {
  const setSearchParamsMock = vi.fn();
  let mockSearchParams: URLSearchParams;
  const mockEndpointBuilder = vi.fn((query, page, filters: any) => {
    return `/api/test?q=${query}&page=${page}&filter=${filters.type}`;
  });

  beforeEach(() => {
    vi.clearAllMocks();
    mockSearchParams = new URLSearchParams();
    vi.mocked(useSearchParams).mockReturnValue([mockSearchParams, setSearchParamsMock]);
    vi.mocked(useQuery).mockReturnValue({
      data: { results: [] },
      isLoading: false,
      error: null,
      refetch: vi.fn(),
    } as any);
  });

  describe("Uncontrolled Mode", () => {
    it("should initialize with default states", () => {
      const { result } = renderHook(() =>
        useSearch(mockEndpointBuilder, {
          initialPage: 1,
          initialSearchQuery: "hello",
          initialFilters: { type: "Monster" },
        }),
      );

      expect(result.current.page).toBe(1);
      expect(result.current.searchQuery).toBe("hello");
      expect(result.current.filters).toEqual({ type: "Monster" });
      expect(mockEndpointBuilder).toHaveBeenCalledWith("hello", 1, { type: "Monster" });
    });

    it("should update page state and rebuild endpoint", () => {
      const { result } = renderHook(() =>
        useSearch(mockEndpointBuilder, {
          initialPage: 0,
          initialFilters: { type: "Monster" },
        }),
      );

      act(() => {
        result.current.setPage(3);
      });

      expect(result.current.page).toBe(3);
      expect(mockEndpointBuilder).toHaveBeenLastCalledWith("", 3, { type: "Monster" });
    });

    it("should update search query state and reset page", () => {
      const { result, rerender } = renderHook(() =>
        useSearch(mockEndpointBuilder, {
          initialPage: 2,
          initialFilters: { type: "Monster" },
        }),
      );

      // Verify initial page is 2
      expect(result.current.page).toBe(2);

      act(() => {
        result.current.setSearchQuery("new query");
      });
      rerender();

      expect(result.current.searchQuery).toBe("new query");
      // Changing query should reset page to 0
      expect(result.current.page).toBe(0);
    });

    it("should update filters state (both direct value and functional setter) and reset page", () => {
      const { result, rerender } = renderHook(() =>
        useSearch(mockEndpointBuilder, {
          initialPage: 2,
          initialFilters: { type: "Monster" },
        }),
      );

      // Verify initial page is 2
      expect(result.current.page).toBe(2);

      act(() => {
        result.current.setFilters({ type: "Spell" });
      });
      rerender();

      expect(result.current.filters).toEqual({ type: "Spell" });
      expect(result.current.page).toBe(0);

      // Update functional
      act(() => {
        result.current.setFilters((prev) => ({ ...prev, type: "Trap" }));
      });
      rerender();

      expect(result.current.filters).toEqual({ type: "Trap" });
      expect(result.current.page).toBe(0);
    });
  });

  describe("Controlled Mode", () => {
    it("should use controlled value inputs instead of local state", () => {
      const setPageSpy = vi.fn();
      const setSearchQuerySpy = vi.fn();
      const setFiltersSpy = vi.fn();

      const { result } = renderHook(() =>
        useSearch(mockEndpointBuilder, {
          page: 5,
          setPage: setPageSpy,
          searchQuery: "controlled-query",
          setSearchQuery: setSearchQuerySpy,
          filters: { type: "Trap" },
          setFilters: setFiltersSpy,
        }),
      );

      expect(result.current.page).toBe(5);
      expect(result.current.searchQuery).toBe("controlled-query");
      expect(result.current.filters).toEqual({ type: "Trap" });

      act(() => {
        result.current.setPage(6);
      });
      expect(setPageSpy).toHaveBeenCalledWith(6);

      act(() => {
        result.current.setSearchQuery("changed");
      });
      expect(setSearchQuerySpy).toHaveBeenCalledWith("changed");

      act(() => {
        result.current.setFilters({ type: "Spell" });
      });
      expect(setFiltersSpy).toHaveBeenCalledWith({ type: "Spell" });
    });
  });

  describe("URL Synchronization (syncUrl: true)", () => {
    const urlConfig = {
      parse: (params: URLSearchParams) => ({
        type: params.get("type") || "ALL",
      }),
      serialize: (params: URLSearchParams, filters: { type: string }) => {
        if (filters.type !== "ALL") {
          params.set("type", filters.type);
        } else {
          params.delete("type");
        }
      },
    };

    it("should parse initial state from searchParams and update state", () => {
      mockSearchParams.set("page", "4");
      mockSearchParams.set("q", "Blue-Eyes");
      mockSearchParams.set("type", "Spell");

      const { result } = renderHook(() =>
        useSearch(mockEndpointBuilder, {
          syncUrl: true,
          urlConfig,
        }),
      );

      expect(result.current.page).toBe(4);
      expect(result.current.searchQuery).toBe("Blue-Eyes");
      expect(result.current.filters).toEqual({ type: "Spell" });
    });

    it("should update searchParams on page change", () => {
      const { result } = renderHook(() =>
        useSearch(mockEndpointBuilder, {
          syncUrl: true,
          urlConfig,
        }),
      );

      act(() => {
        result.current.setPage(3);
      });

      expect(setSearchParamsMock).toHaveBeenCalled();
      const params = setSearchParamsMock.mock.calls[0][0];
      expect(params.get("page")).toBe("3");
    });

    it("should delete page parameter when page is set to 0", () => {
      mockSearchParams.set("page", "2");

      const { result } = renderHook(() =>
        useSearch(mockEndpointBuilder, {
          syncUrl: true,
          urlConfig,
        }),
      );

      act(() => {
        result.current.setPage(0);
      });

      expect(setSearchParamsMock).toHaveBeenCalled();
      const params = setSearchParamsMock.mock.calls[0][0];
      expect(params.get("page")).toBeNull();
    });

    it("should update searchParams on filter changes and reset page", () => {
      mockSearchParams.set("page", "3");

      const { result } = renderHook(() =>
        useSearch(mockEndpointBuilder, {
          syncUrl: true,
          urlConfig,
          initialFilters: { type: "Monster" },
        }),
      );

      act(() => {
        result.current.setFilters({ type: "Spell" });
      });

      expect(setSearchParamsMock).toHaveBeenCalled();
      const params = setSearchParamsMock.mock.calls[0][0];
      expect(params.get("type")).toBe("Spell");
      expect(params.get("page")).toBeNull(); // Reset page
    });

    it("should update searchParams on query changes after debouncing and reset page", () => {
      mockSearchParams.set("page", "2");

      const { result } = renderHook(() =>
        useSearch(mockEndpointBuilder, {
          syncUrl: true,
          urlConfig,
        }),
      );

      act(() => {
        result.current.setSearchQuery("Magician");
      });

      expect(setSearchParamsMock).toHaveBeenCalled();
      const params = setSearchParamsMock.mock.calls[0][0];
      expect(params.get("q")).toBe("Magician");
      expect(params.get("page")).toBeNull();
    });
  });

  describe("TanStack Query integration", () => {
    it("should pass data, loading, error, and refetch from useQuery", () => {
      const refetchSpy = vi.fn();
      vi.mocked(useQuery).mockReturnValue({
        data: { payload: "mocked" },
        isLoading: true,
        error: new Error("Fetch error"),
        refetch: refetchSpy,
      } as any);

      const { result } = renderHook(() =>
        useSearch(mockEndpointBuilder, {
          initialFilters: { type: "Monster" },
        }),
      );

      expect(result.current.data).toEqual({ payload: "mocked" });
      expect(result.current.loading).toBe(true);
      expect(result.current.error).toEqual(new Error("Fetch error"));

      act(() => {
        result.current.refetch();
      });
      expect(refetchSpy).toHaveBeenCalled();
    });
  });
});
