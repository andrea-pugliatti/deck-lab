import { useMutation, useQuery } from "@tanstack/react-query";
import { act, renderHook, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { getDeck, saveDeck as saveDeckService, validateDeck } from "../../../features/decks";
import { useDeckState } from "./useDeckState";

vi.mock("@tanstack/react-query", () => ({
  useQuery: vi.fn().mockReturnValue({}),
  useMutation: vi.fn().mockReturnValue({
    mutate: vi.fn(),
    mutateAsync: vi.fn(),
  }),
  useQueryClient: vi.fn().mockReturnValue({
    invalidateQueries: vi.fn(),
  }),
}));

vi.mock("../../../features/decks", () => ({
  getDeck: vi.fn(),
  saveDeck: vi.fn(),
  validateDeck: vi.fn(),
}));

describe("useDeckState hook", () => {
  beforeEach(() => {
    vi.mocked(getDeck).mockReset();
    vi.mocked(saveDeckService).mockReset();
    vi.mocked(validateDeck).mockReset();
    vi.mocked(useQuery).mockReturnValue({} as unknown as ReturnType<typeof useQuery>);
    vi.mocked(useMutation).mockReset();
    vi.mocked(useMutation).mockImplementation(
      (options: Parameters<typeof useMutation>[0]) =>
        ({
          mutate: vi.fn(async (payload) => {
            try {
              const res = await (
                options?.mutationFn as ((variables: unknown) => Promise<unknown>) | undefined
              )?.(payload);
              (options?.onSuccess as ((res: unknown) => void) | undefined)?.(res);
            } catch (err) {
              (options?.onError as ((err: unknown) => void) | undefined)?.(err);
            }
          }),
          mutateAsync: vi.fn(),
        }) as unknown as ReturnType<typeof useMutation>,
    );
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
    vi.mocked(useQuery).mockReturnValue({
      data: mockDeck,
    } as unknown as ReturnType<typeof useQuery>);

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

    act(() => {
      result.current.saveDeck();
    });

    expect(result.current.submitError).toBe("Deck name is required.");
    expect(saveDeckService).not.toHaveBeenCalled();
  });

  it("should clamp description to 255 characters", () => {
    const { result } = renderHook(() => useDeckState());

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
      formatName: "TCG",
      deckCards: [],
    };
    vi.mocked(useQuery).mockReturnValue({
      data: mockDeck,
    } as unknown as ReturnType<typeof useQuery>);

    const { result } = renderHook(() => useDeckState("12"));

    await waitFor(() => {
      expect(result.current.name).toBe("Existing Deck");
    });

    act(() => {
      result.current.saveDeck();
    });

    expect(result.current.submitError).toBe("Strategy/notes must be 255 characters or less.");
    expect(saveDeckService).not.toHaveBeenCalled();
  });

  it("should validate and save deck successfully", async () => {
    const onSaveSuccessMock = vi.fn();
    vi.mocked(validateDeck).mockResolvedValueOnce({ ok: true });
    vi.mocked(saveDeckService).mockResolvedValueOnce({
      id: 10,
      name: "Super Deck",
    } as unknown as Awaited<ReturnType<typeof saveDeckService>>);

    const { result } = renderHook(() => useDeckState(undefined, onSaveSuccessMock));

    // Name must be set
    act(() => {
      result.current.setName("Super Deck");
    });

    await act(async () => {
      result.current.saveDeck();
    });

    expect(result.current.submitError).toBeUndefined();
    expect(saveDeckService).toHaveBeenCalled();
    expect(onSaveSuccessMock).toHaveBeenCalledWith({ id: 10, name: "Super Deck" });
  });
});
