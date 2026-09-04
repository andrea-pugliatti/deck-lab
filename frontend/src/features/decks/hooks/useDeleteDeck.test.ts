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
});
