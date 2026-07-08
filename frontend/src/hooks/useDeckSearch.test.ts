import { act, renderHook } from "@testing-library/react";
import { useSearchParams } from "react-router";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { useDeckSearch } from "./useDeckSearch";
import { useFetch } from "./useFetch";

vi.mock("react-router", () => ({
  useSearchParams: vi.fn(),
}));

vi.mock("./useFetch", () => ({
  useFetch: vi.fn(),
}));

vi.mock("./useDebounce", () => ({
  useDebounce: vi.fn((val) => val),
}));

describe("useDeckSearch hook", () => {
  const setSearchParamsMock = vi.fn();
  let mockSearchParams: URLSearchParams;

  beforeEach(() => {
    setSearchParamsMock.mockReset();
    vi.mocked(useSearchParams).mockReset();
    mockSearchParams = new URLSearchParams();
    vi.mocked(useSearchParams).mockReturnValue([mockSearchParams, setSearchParamsMock]);

    vi.mocked(useFetch).mockReset();
    vi.mocked(useFetch).mockReturnValue({
      data: {
        content: [{ id: 10, name: "Deck X" }],
        page: { totalPages: 3, totalElements: 18 },
      },
      loading: false,
      error: undefined,
      refetch: vi.fn(),
    } as any);
  });

  it("should initialize with default states", () => {
    const { result } = renderHook(() => useDeckSearch());

    expect(result.current.page).toBe(0);
    expect(result.current.searchQuery).toBe("");
    expect(result.current.format).toBe("ALL");
    expect(result.current.username).toBe("");
    expect(result.current.decks).toEqual([{ id: 10, name: "Deck X" }]);
    expect(result.current.totalPages).toBe(3);
    expect(result.current.totalElements).toBe(18);
  });

  it("should update and reset pagination on filter changes", () => {
    const { result } = renderHook(() => useDeckSearch());

    act(() => {
      result.current.setPage(2);
    });
    expect(result.current.page).toBe(2);

    act(() => {
      result.current.setFormat("Speed Duel");
    });
    expect(result.current.format).toBe("Speed Duel");
    expect(result.current.page).toBe(0); // page resets to 0
  });

  it("should update page on page setters", () => {
    const { result } = renderHook(() => useDeckSearch());

    act(() => {
      result.current.setUsername("yugi");
    });
    expect(result.current.username).toBe("yugi");
    expect(result.current.page).toBe(0);
  });

  it("should support controlled parameters", () => {
    const setPageMock = vi.fn();
    const setQueryMock = vi.fn();
    const setFormatMock = vi.fn();
    const setUsernameMock = vi.fn();

    const { result } = renderHook(() =>
      useDeckSearch({
        page: 1,
        setPage: setPageMock,
        searchQuery: "Exodia",
        setSearchQuery: setQueryMock,
        format: "Goat",
        setFormat: setFormatMock,
        username: "kaiba",
        setUsername: setUsernameMock,
      }),
    );

    expect(result.current.page).toBe(1);
    expect(result.current.searchQuery).toBe("Exodia");
    expect(result.current.format).toBe("Goat");
    expect(result.current.username).toBe("kaiba");

    act(() => {
      result.current.setPage(2);
    });
    expect(setPageMock).toHaveBeenCalledWith(2);

    act(() => {
      result.current.setSearchQuery("Blue");
    });
    expect(setQueryMock).toHaveBeenCalledWith("Blue");

    act(() => {
      result.current.setFormat("TCG");
    });
    expect(setFormatMock).toHaveBeenCalledWith("TCG");

    act(() => {
      result.current.setUsername("pegasus");
    });
    expect(setUsernameMock).toHaveBeenCalledWith("pegasus");
  });

  describe("with syncUrl: true", () => {
    it("should parse initial state from searchParams", () => {
      mockSearchParams.set("page", "2");
      mockSearchParams.set("format", "Goat");
      mockSearchParams.set("q", "Exodia");

      const { result } = renderHook(() => useDeckSearch({ syncUrl: true, username: "kaiba" }));

      expect(result.current.page).toBe(2);
      expect(result.current.searchQuery).toBe("Exodia");
      expect(result.current.format).toBe("Goat");
      expect(result.current.username).toBe("kaiba");
    });

    it("should update searchParams on filter/page changes", () => {
      const { result } = renderHook(() => useDeckSearch({ syncUrl: true }));

      act(() => {
        result.current.setFormat("Speed Duel");
      });

      expect(setSearchParamsMock).toHaveBeenCalled();
      let params = setSearchParamsMock.mock.calls[0][0];
      expect(params.get("format")).toBe("Speed Duel");
      expect(params.get("page")).toBeNull(); // Reset page

      setSearchParamsMock.mockClear();

      act(() => {
        result.current.setPage(3);
      });

      expect(setSearchParamsMock).toHaveBeenCalled();
      params = setSearchParamsMock.mock.calls[0][0];
      expect(params.get("page")).toBe("3");
    });

    it("should update searchParams on query change after debouncing", () => {
      const { result } = renderHook(() => useDeckSearch({ syncUrl: true }));

      act(() => {
        result.current.setSearchQuery("Blue");
      });

      expect(setSearchParamsMock).toHaveBeenCalled();
      const params = setSearchParamsMock.mock.calls[0][0];
      expect(params.get("q")).toBe("Blue");
      expect(params.get("page")).toBeNull(); // Reset page
    });
  });
});
