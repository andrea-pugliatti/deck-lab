import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { renderHook } from "@testing-library/react";
import React from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { cardKeys, deckKeys } from "../services/queryKeys";
import { useOptionalQueryClient, usePrefetchCard, usePrefetchDeck } from "./usePrefetch";

describe("usePrefetch hooks", () => {
  let queryClient: QueryClient;

  beforeEach(() => {
    queryClient = new QueryClient({
      defaultOptions: {
        queries: {
          retry: false,
        },
      },
    });
  });

  const createWrapper = () => {
    return ({ children }: { children: React.ReactNode }) =>
      React.createElement(QueryClientProvider, { client: queryClient }, children);
  };

  describe("useOptionalQueryClient", () => {
    it("returns null when rendered outside of a QueryClientProvider without throwing", () => {
      const { result } = renderHook(() => useOptionalQueryClient());
      expect(result.current).toBeNull();
    });

    it("returns the active queryClient when rendered inside a QueryClientProvider", () => {
      const { result } = renderHook(() => useOptionalQueryClient(), {
        wrapper: createWrapper(),
      });
      expect(result.current).toBe(queryClient);
    });
  });

  describe("usePrefetchCard", () => {
    it("safely does nothing when rendered outside of a QueryClientProvider", () => {
      const { result } = renderHook(() => usePrefetchCard(123));
      expect(() => result.current()).not.toThrow();
    });

    it("safely does nothing when id is undefined or null", () => {
      const prefetchSpy = vi.spyOn(queryClient, "prefetchQuery");
      const { result } = renderHook(() => usePrefetchCard(undefined), {
        wrapper: createWrapper(),
      });

      result.current();
      expect(prefetchSpy).not.toHaveBeenCalled();
    });

    it("triggers card detail query prefetch with 60s staleTime when invoked", () => {
      const prefetchSpy = vi.spyOn(queryClient, "prefetchQuery").mockResolvedValue();
      const { result } = renderHook(() => usePrefetchCard(456), {
        wrapper: createWrapper(),
      });

      result.current();
      expect(prefetchSpy).toHaveBeenCalledWith(
        expect.objectContaining({
          queryKey: cardKeys.detail(456),
          staleTime: 60 * 1000,
        }),
      );
    });
  });

  describe("usePrefetchDeck", () => {
    it("safely does nothing when rendered outside of a QueryClientProvider", () => {
      const { result } = renderHook(() => usePrefetchDeck(789));
      expect(() => result.current()).not.toThrow();
    });

    it("safely does nothing when id is undefined or null", () => {
      const prefetchSpy = vi.spyOn(queryClient, "prefetchQuery");
      const { result } = renderHook(() => usePrefetchDeck(undefined), {
        wrapper: createWrapper(),
      });

      result.current();
      expect(prefetchSpy).not.toHaveBeenCalled();
    });

    it("triggers deck detail query prefetch with 60s staleTime when invoked", () => {
      const prefetchSpy = vi.spyOn(queryClient, "prefetchQuery").mockResolvedValue();
      const { result } = renderHook(() => usePrefetchDeck(789), {
        wrapper: createWrapper(),
      });

      result.current();
      expect(prefetchSpy).toHaveBeenCalledWith(
        expect.objectContaining({
          queryKey: deckKeys.detail(789),
          staleTime: 60 * 1000,
        }),
      );
    });
  });
});
