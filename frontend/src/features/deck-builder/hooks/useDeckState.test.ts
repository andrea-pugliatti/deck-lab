import { act, renderHook, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { getDeck, saveDeck as saveDeckService, validateDeck } from "../../../features/decks";
import { deckKeys } from "../../../services/queryKeys";
import { createQueryClientWrapper, createTestQueryClient } from "../../../test/setup";
import { useDeckState } from "./useDeckState";

vi.mock("../../../features/decks", () => ({
  getDeck: vi.fn(),
  saveDeck: vi.fn(),
  validateDeck: vi.fn(),
}));

describe("useDeckState hook", () => {
  let queryClient = createTestQueryClient();

  beforeEach(() => {
    queryClient = createTestQueryClient();
    vi.mocked(getDeck).mockReset();
    vi.mocked(saveDeckService).mockReset();
    vi.mocked(validateDeck).mockReset();
  });

  it("should initialize in draft (creation) mode by default", () => {
    const { result } = renderHook(() => useDeckState(), {
      wrapper: createQueryClientWrapper(queryClient),
    });

    expect(result.current.isEditMode).toBe(false);
    expect(result.current.name).toBe("");
    expect(result.current.description).toBe("");
    expect(result.current.formatName).toBe("TCG");
    expect(result.current.deckCards).toEqual([]);
    expect(result.current.isSaving).toBe(false);
  });

  it("should load existing deck details in edit mode", async () => {
    const mockDeck = {
      id: 12,
      name: "Existing Deck",
      description: "Old desc",
      formatName: "Goat" as const,
      deckCards: [
        {
          cardId: 2,
          name: "Card X",
          quantity: 3,
          section: "MAIN" as const,
          type: "Spell Card" as const,
          imageUrl: "",
        },
      ],
    };
    vi.mocked(getDeck).mockResolvedValueOnce(mockDeck);

    const { result } = renderHook(() => useDeckState("12"), {
      wrapper: createQueryClientWrapper(queryClient),
    });

    expect(result.current.isEditMode).toBe(true);

    await waitFor(() => {
      expect(result.current.name).toBe("Existing Deck");
    });

    expect(result.current.description).toBe("Old desc");
    expect(result.current.formatName).toBe("Goat");
    expect(result.current.deckCards).toHaveLength(1);
  });

  it("should trigger validation and set validation success", async () => {
    vi.mocked(validateDeck).mockResolvedValueOnce({ ok: true });

    const { result } = renderHook(() => useDeckState(), {
      wrapper: createQueryClientWrapper(queryClient),
    });

    let valOk = false;
    await act(async () => {
      valOk = await result.current.validateDeckPayload();
    });

    expect(valOk).toBe(true);
    expect(result.current.validationSuccess).toBe(true);
    expect(result.current.validationErrors).toEqual([]);
  });

  it("should handle failing validation with error messages", async () => {
    vi.mocked(validateDeck).mockResolvedValueOnce({
      ok: false,
      errors: ["Exceeds max copies", "Invalid section size"],
    });

    const { result } = renderHook(() => useDeckState(), {
      wrapper: createQueryClientWrapper(queryClient),
    });

    let valOk = true;
    await act(async () => {
      valOk = await result.current.validateDeckPayload();
    });

    expect(valOk).toBe(false);
    expect(result.current.validationSuccess).toBe(false);
    expect(result.current.validationErrors).toEqual(["Exceeds max copies", "Invalid section size"]);
  });

  it("should fail saveDeck if deck name is empty", async () => {
    const { result } = renderHook(() => useDeckState(), {
      wrapper: createQueryClientWrapper(queryClient),
    });

    act(() => {
      result.current.saveDeck();
    });

    expect(result.current.submitError).toBe("Deck name is required.");
    expect(saveDeckService).not.toHaveBeenCalled();
  });

  it("should clamp description to 255 characters", () => {
    const { result } = renderHook(() => useDeckState(), {
      wrapper: createQueryClientWrapper(queryClient),
    });

    act(() => {
      result.current.setDescription("a".repeat(300));
    });

    expect(result.current.description).toHaveLength(255);
  });

  it("should fail saveDeck if description is longer than 255 characters", async () => {
    const mockDeck = {
      id: 12,
      name: "Existing Deck",
      description: "a".repeat(300),
      formatName: "TCG" as const,
      deckCards: [],
    };
    vi.mocked(getDeck).mockResolvedValueOnce(mockDeck);

    const { result } = renderHook(() => useDeckState("12"), {
      wrapper: createQueryClientWrapper(queryClient),
    });

    await waitFor(() => {
      expect(result.current.name).toBe("Existing Deck");
    });

    act(() => {
      result.current.saveDeck();
    });

    expect(result.current.submitError).toBe("Strategy/notes must be 255 characters or less.");
    expect(saveDeckService).not.toHaveBeenCalled();
  });

  it("should validate and save deck successfully with targeted cache invalidation and seeding", async () => {
    const onSaveSuccessMock = vi.fn();
    const invalidateSpy = vi.spyOn(queryClient, "invalidateQueries");
    const setQueryDataSpy = vi.spyOn(queryClient, "setQueryData");

    vi.mocked(validateDeck).mockResolvedValueOnce({ ok: true });
    vi.mocked(saveDeckService).mockResolvedValueOnce({
      id: 10,
      name: "Super Deck",
    } as unknown as Awaited<ReturnType<typeof saveDeckService>>);

    const { result } = renderHook(() => useDeckState(undefined, onSaveSuccessMock), {
      wrapper: createQueryClientWrapper(queryClient),
    });

    act(() => {
      result.current.setName("Super Deck");
    });

    await act(async () => {
      result.current.saveDeck();
    });

    await waitFor(() => {
      expect(onSaveSuccessMock).toHaveBeenCalledWith({ id: 10, name: "Super Deck" });
    });

    expect(result.current.submitError).toBeUndefined();
    expect(saveDeckService).toHaveBeenCalled();
    expect(setQueryDataSpy).toHaveBeenCalledWith(deckKeys.detail("10"), { id: 10, name: "Super Deck" });
    expect(invalidateSpy).toHaveBeenCalledWith({ queryKey: deckKeys.detail("10") });
    expect(invalidateSpy).toHaveBeenCalledWith({ queryKey: deckKeys.lists() });
    expect(invalidateSpy).not.toHaveBeenCalledWith({ queryKey: deckKeys.all });
    expect(invalidateSpy).not.toHaveBeenCalledWith({ queryKey: deckKeys.detail(undefined) });
  });
});
