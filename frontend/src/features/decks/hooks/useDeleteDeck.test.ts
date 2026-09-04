import { act, renderHook, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { deckKeys } from "../../../services/queryKeys";
import { createQueryClientWrapper, createTestQueryClient } from "../../../test/setup";
import { deleteDeck } from "../api/deck";
import { useDeleteDeck } from "./useDeleteDeck";

vi.mock("../api/deck", () => ({
  deleteDeck: vi.fn(),
}));

describe("useDeleteDeck hook", () => {
  let queryClient = createTestQueryClient();

  beforeEach(() => {
    queryClient = createTestQueryClient();
    vi.mocked(deleteDeck).mockReset();
  });

  it("should remove detail query and invalidate deck lists on successful deletion", async () => {
    const invalidateSpy = vi.spyOn(queryClient, "invalidateQueries");
    const removeQueriesSpy = vi.spyOn(queryClient, "removeQueries");

    vi.mocked(deleteDeck).mockResolvedValueOnce(undefined as unknown as void);

    queryClient.setQueryData(deckKeys.detail(42), { id: 42, name: "Deleted Deck" });
    queryClient.setQueryData(deckKeys.detail(99), { id: 99, name: "Remaining Deck" });

    const { result } = renderHook(() => useDeleteDeck(), {
      wrapper: createQueryClientWrapper(queryClient),
    });

    act(() => {
      result.current.mutate(42);
    });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(deleteDeck).toHaveBeenCalledWith(42);
    expect(removeQueriesSpy).toHaveBeenCalledWith({ queryKey: deckKeys.detail(42) });
    expect(queryClient.getQueryData(deckKeys.detail(42))).toBeUndefined();
    expect(queryClient.getQueryData(deckKeys.detail(99))).toBeDefined();

    expect(invalidateSpy).toHaveBeenCalledWith({ queryKey: deckKeys.lists() });
    expect(invalidateSpy).not.toHaveBeenCalledWith({ queryKey: deckKeys.all });
  });

  it("should capture error if deck deletion fails", async () => {
    vi.mocked(deleteDeck).mockRejectedValueOnce(new Error("Network deletion failure"));

    const { result } = renderHook(() => useDeleteDeck(), {
      wrapper: createQueryClientWrapper(queryClient),
    });

    act(() => {
      result.current.mutate(42);
    });

    await waitFor(() => {
      expect(result.current.isError).toBe(true);
    });

    expect(result.current.error?.message).toBe("Network deletion failure");
  });

  it("should optimistically remove deck from cached lists and detail on mutate", async () => {
    let resolveDelete!: () => void;
    vi.mocked(deleteDeck).mockReturnValue(
      new Promise<void>((resolve) => {
        resolveDelete = resolve;
      }),
    );

    const listQueryKey = deckKeys.list({ size: "10" });
    const initialPage = {
      content: [
        { id: 42, name: "Deck To Delete" },
        { id: 43, name: "Deck To Keep" },
      ],
      page: { size: 10, totalElements: 2, totalPages: 1, number: 0 },
    };
    queryClient.setQueryData(listQueryKey, initialPage);
    queryClient.setQueryData(deckKeys.detail(42), { id: 42, name: "Deck To Delete" });

    const { result } = renderHook(() => useDeleteDeck(), {
      wrapper: createQueryClientWrapper(queryClient),
    });

    act(() => {
      result.current.mutate(42);
    });

    await waitFor(() => {
      const optimisticList = queryClient.getQueryData<typeof initialPage>(listQueryKey);
      expect(optimisticList?.content).toHaveLength(1);
      expect(optimisticList?.content?.[0]?.id).toBe(43);
      expect(optimisticList?.page.totalElements).toBe(1);
    });

    act(() => {
      resolveDelete();
    });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
      expect(queryClient.getQueryData(deckKeys.detail(42))).toBeUndefined();
    });
  });

  it("should roll back cached lists when deletion fails", async () => {
    vi.mocked(deleteDeck).mockRejectedValueOnce(new Error("Server error"));

    const listQueryKey = deckKeys.list({ size: "10" });
    const initialPage = {
      content: [
        { id: 42, name: "Deck To Delete" },
        { id: 43, name: "Deck To Keep" },
      ],
      page: { size: 10, totalElements: 2, totalPages: 1, number: 0 },
    };

    queryClient.setQueryData(listQueryKey, initialPage);

    const invalidateSpy = vi.spyOn(queryClient, "invalidateQueries");

    const { result } = renderHook(() => useDeleteDeck(), {
      wrapper: createQueryClientWrapper(queryClient),
    });

    act(() => {
      result.current.mutate(42);
    });

    await waitFor(() => {
      expect(result.current.isError).toBe(true);
    });

    expect(queryClient.getQueryData(listQueryKey)).toEqual(initialPage);
    expect(invalidateSpy).toHaveBeenCalledWith({ queryKey: deckKeys.lists() });
  });
});
