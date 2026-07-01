import { act, renderHook, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { apiFetch } from "../services/api";
import { useFetch } from "./useFetch";

vi.mock("../services/api", () => ({
  apiFetch: vi.fn(),
  parseResponseError: vi.fn().mockImplementation(async () => new Error("Mocked request failure")),
}));

describe("useFetch hook", () => {
  beforeEach(() => {
    vi.mocked(apiFetch).mockReset();
  });

  it("should initialize with loading: false if url is undefined", () => {
    const { result } = renderHook(() => useFetch());
    expect(result.current.loading).toBe(false);
    expect(result.current.data).toBeUndefined();
    expect(result.current.error).toBeUndefined();
  });

  it("should initialize with loading: false if skip is true", () => {
    const { result } = renderHook(() => useFetch("/api/test", { skip: true }));
    expect(result.current.loading).toBe(false);
    expect(apiFetch).not.toHaveBeenCalled();
  });

  it("should trigger fetch, set loading, and return data on success", async () => {
    const mockData = { items: [1, 2] };
    vi.mocked(apiFetch).mockResolvedValueOnce({
      ok: true,
      status: 200,
      json: async () => mockData,
    } as Response);

    const { result } = renderHook(() => useFetch("/api/test"));

    expect(result.current.loading).toBe(true);

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.data).toEqual(mockData);
    expect(result.current.error).toBeUndefined();
    expect(apiFetch).toHaveBeenCalledWith("/api/test", expect.any(Object));
  });

  it("should handle 204 No Content response successfully", async () => {
    vi.mocked(apiFetch).mockResolvedValueOnce({
      ok: true,
      status: 204,
    } as Response);

    const { result } = renderHook(() => useFetch("/api/test-204"));

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.data).toBeUndefined();
    expect(result.current.error).toBeUndefined();
  });

  it("should set error state if fetch request is not ok", async () => {
    vi.mocked(apiFetch).mockResolvedValueOnce({
      ok: false,
      status: 500,
    } as Response);

    const { result } = renderHook(() => useFetch("/api/fail"));

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.data).toBeUndefined();
    expect(result.current.error).toBeInstanceOf(Error);
    expect(result.current.error?.message).toBe("Mocked request failure");
  });

  it("should allow manual refetching", async () => {
    vi.mocked(apiFetch).mockResolvedValueOnce({
      ok: true,
      status: 200,
      json: async () => ({ value: "first" }),
    } as Response);

    const { result } = renderHook(() => useFetch("/api/refetch"));

    await waitFor(() => {
      expect(result.current.data).toEqual({ value: "first" });
    });

    vi.mocked(apiFetch).mockResolvedValueOnce({
      ok: true,
      status: 200,
      json: async () => ({ value: "second" }),
    } as Response);

    act(() => {
      result.current.refetch();
    });

    await waitFor(() => {
      expect(result.current.data).toEqual({ value: "second" });
    });
  });
});
