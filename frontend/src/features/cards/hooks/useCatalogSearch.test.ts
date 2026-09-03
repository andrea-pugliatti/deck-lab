import { useQuery } from "@tanstack/react-query";
import { act, renderHook } from "@testing-library/react";
import { useSearchParams } from "react-router";
import { beforeEach, describe, expect, it, vi } from "vitest";

import type { CardAttribute, CardRace, CardType } from "../../../types";
import { useCatalogSearch } from "./useCatalogSearch";

vi.mock("react-router", () => ({
  useSearchParams: vi.fn(),
}));

vi.mock("@tanstack/react-query", () => ({
  useQuery: vi.fn(),
  keepPreviousData: () => undefined,
}));

vi.mock("../../../hooks/useDebounce", () => ({
  useDebounce: vi.fn((val) => val),
}));

describe("useCatalogSearch hook", () => {
  const setSearchParamsMock = vi.fn();
  let mockSearchParams: URLSearchParams;

  beforeEach(() => {
    setSearchParamsMock.mockReset();
    vi.mocked(useSearchParams).mockReset();
    mockSearchParams = new URLSearchParams();
    vi.mocked(useSearchParams).mockReturnValue([mockSearchParams, setSearchParamsMock]);

    vi.mocked(useQuery).mockReset();
    vi.mocked(useQuery).mockReturnValue({
      data: {
        content: [{ id: 1, name: "Card A" }],
        page: { totalPages: 5, totalElements: 40 },
      },
      isLoading: false,
      error: undefined,
      refetch: vi.fn(),
    } as unknown as ReturnType<typeof useQuery>);
  });

  it("should initialize with default states in uncontrolled mode", () => {
    const { result } = renderHook(() => useCatalogSearch());

    expect(result.current.searchPage).toBe(0);
    expect(result.current.searchQuery).toBe("");
    expect(result.current.filters).toEqual({
      type: "ALL",
      attribute: "ALL",
      race: "ALL",
      archetype: "ALL",
    });
    expect(result.current.libraryCards).toEqual([{ id: 1, name: "Card A" }]);
    expect(result.current.totalSearchPages).toBe(5);
    expect(result.current.totalElements).toBe(40);
  });

  it("should update page state", () => {
    const { result } = renderHook(() => useCatalogSearch());

    act(() => {
      result.current.setSearchPage(2);
    });

    expect(result.current.searchPage).toBe(2);
  });

  it("should reset page when query or filters change in uncontrolled mode", () => {
    const { result, rerender } = renderHook(() => useCatalogSearch());

    act(() => {
      result.current.setSearchPage(3);
    });
    expect(result.current.searchPage).toBe(3);

    // change search query
    act(() => {
      result.current.setSearchQuery("Blue");
    });
    rerender();
    expect(result.current.searchPage).toBe(0);
  });

  it("should update filters state", () => {
    const { result } = renderHook(() => useCatalogSearch());

    act(() => {
      result.current.setFilters({
        type: "Spell Card" as CardType,
        attribute: "ALL",
        race: "ALL",
        archetype: "ALL",
      });
    });

    expect(result.current.filters.type).toBe("Spell Card");
  });

  it("should support controlled mode when options are passed", () => {
    const setPageMock = vi.fn();
    const setFiltersMock = vi.fn();
    const setSearchQueryMock = vi.fn();

    const { result } = renderHook(() =>
      useCatalogSearch({
        page: 3,
        setPage: setPageMock,
        filters: {
          type: "Trap Card" as CardType,
          attribute: "LIGHT" as CardAttribute,
          race: "ALL",
          archetype: "ALL",
        },
        setFilters: setFiltersMock,
        searchQuery: "control",
        setSearchQuery: setSearchQueryMock,
      }),
    );

    expect(result.current.searchPage).toBe(3);
    expect(result.current.searchQuery).toBe("control");
    expect(result.current.filters.type).toBe("Trap Card");

    act(() => {
      result.current.setSearchPage(4);
    });
    expect(setPageMock).toHaveBeenCalledWith(4);

    act(() => {
      result.current.setSearchQuery("aggro");
    });
    expect(setSearchQueryMock).toHaveBeenCalledWith("aggro");

    act(() => {
      result.current.setFilters((prev) => ({ ...prev, race: "Warrior" as CardRace }));
    });
    expect(setFiltersMock).toHaveBeenCalled();
  });

  describe("with syncUrl: true", () => {
    const getUpdatedParams = (callIndex = 0) => {
      const call = setSearchParamsMock.mock.calls[callIndex];
      if (!call) return null;
      const [arg] = call;
      return typeof arg === "function" ? arg(mockSearchParams) : arg;
    };

    it("should parse initial state from searchParams", () => {
      mockSearchParams.set("page", "2");
      mockSearchParams.set("type", "Normal Monster");
      mockSearchParams.set("attribute", "DARK");
      mockSearchParams.set("q", "Dragon");

      const { result } = renderHook(() => useCatalogSearch({ syncUrl: true }));

      expect(result.current.searchPage).toBe(2);
      expect(result.current.searchQuery).toBe("Dragon");
      expect(result.current.filters).toEqual({
        type: "Normal Monster",
        attribute: "DARK",
        race: "ALL",
        archetype: "ALL",
      });
    });

    it("should update searchParams on filter changes", () => {
      const { result } = renderHook(() => useCatalogSearch({ syncUrl: true }));

      act(() => {
        result.current.setFilters({
          type: "Spell Card" as CardType,
          attribute: "LIGHT" as CardAttribute,
          race: "Zombie" as CardRace,
          archetype: "Vampire",
        });
      });

      expect(setSearchParamsMock).toHaveBeenCalled();
      const params = getUpdatedParams();
      expect(params.get("type")).toBe("Spell Card");
      expect(params.get("attribute")).toBe("LIGHT");
      expect(params.get("race")).toBe("Zombie");
      expect(params.get("archetype")).toBe("Vampire");
      expect(params.get("page")).toBeNull(); // Reset page
    });

    it("should update searchParams on page change", () => {
      const { result } = renderHook(() => useCatalogSearch({ syncUrl: true }));

      act(() => {
        result.current.setSearchPage(3);
      });

      expect(setSearchParamsMock).toHaveBeenCalled();
      const params = getUpdatedParams();
      expect(params.get("page")).toBe("3");
    });

    it("should update searchParams on query change after debouncing", () => {
      const { result } = renderHook(() => useCatalogSearch({ syncUrl: true }));

      act(() => {
        result.current.setSearchQuery("Magician");
      });

      expect(setSearchParamsMock).toHaveBeenCalled();
      const params = getUpdatedParams();
      expect(params.get("q")).toBe("Magician");
      expect(params.get("page")).toBeNull(); // Reset page
    });
  });
});
