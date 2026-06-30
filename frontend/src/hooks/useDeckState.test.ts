import { act, renderHook, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { getDeck, saveDeck as saveDeckService, validateDeck } from "../services/deck";
import { useDeckState } from "./useDeckState";

vi.mock("../services/deck", () => ({
  getDeck: vi.fn(),
  saveDeck: vi.fn(),
  validateDeck: vi.fn(),
}));

describe("useDeckState hook", () => {
  beforeEach(() => {
    vi.mocked(getDeck).mockReset();
    vi.mocked(saveDeckService).mockReset();
    vi.mocked(validateDeck).mockReset();
  });

  it("should initialize in draft (creation) mode by default", () => {
    const { result } = renderHook(() => useDeckState());

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
      formatName: "Goat",
      deckCards: [
        {
          cardId: 2,
          name: "Card X",
          quantity: 3,
          section: "MAIN" as const,
          type: "spell",
          imageUrl: "",
        },
      ],
    };
    vi.mocked(getDeck).mockResolvedValueOnce(mockDeck as any);

    const { result } = renderHook(() => useDeckState("12"));

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

    const { result } = renderHook(() => useDeckState());

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

    const { result } = renderHook(() => useDeckState());

    let valOk = true;
    await act(async () => {
      valOk = await result.current.validateDeckPayload();
    });

    expect(valOk).toBe(false);
    expect(result.current.validationSuccess).toBe(false);
    expect(result.current.validationErrors).toEqual(["Exceeds max copies", "Invalid section size"]);
  });

  it("should fail saveDeck if deck name is empty", async () => {
    const { result } = renderHook(() => useDeckState());

    await act(async () => {
      await result.current.saveDeck();
    });

    expect(result.current.submitError).toBe("Deck name is required.");
    expect(saveDeckService).not.toHaveBeenCalled();
  });

  it("should validate and save deck successfully", async () => {
    const onSaveSuccessMock = vi.fn();
    vi.mocked(validateDeck).mockResolvedValueOnce({ ok: true });
    vi.mocked(saveDeckService).mockResolvedValueOnce({ id: "saved-id", name: "Super Deck" } as any);

    const { result } = renderHook(() => useDeckState(undefined, onSaveSuccessMock));

    // Name must be set
    act(() => {
      result.current.setName("Super Deck");
    });

    await act(async () => {
      await result.current.saveDeck();
    });

    expect(result.current.submitError).toBeUndefined();
    expect(saveDeckService).toHaveBeenCalled();
    expect(onSaveSuccessMock).toHaveBeenCalledWith({ id: "saved-id", name: "Super Deck" });
  });
});
