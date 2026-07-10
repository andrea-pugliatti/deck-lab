import { describe, expect, it, vi } from "vitest";

import { apiFetch } from "./api";
import {
  getDecksQueryEndpoint,
  getDeck,
  validateDeck,
  saveDeck,
  deleteDeck,
  fetchAiSuggestions,
  generateAiDeck,
} from "./deck";

vi.mock("./api", () => ({
  apiFetch: vi.fn(),
  parseResponseError: vi.fn().mockImplementation(async () => new Error("Mocked parsing error")),
  parseResponseErrors: vi.fn().mockImplementation(async () => ["Mocked field error"]),
}));

describe("deck service", () => {
  describe("endpoint builders", () => {
    it("should build decks list from URLSearchParams", () => {
      const params = new URLSearchParams({ search: "Blue-Eyes" });
      expect(getDecksQueryEndpoint(params)).toBe("/api/decks?search=Blue-Eyes");
    });
  });

  describe("getDeck", () => {
    it("should load deck on success", async () => {
      const mockDeck = { id: 1, name: "Starter Deck" };
      vi.mocked(apiFetch).mockResolvedValueOnce({
        ok: true,
        json: async () => mockDeck,
      } as Response);

      const deck = await getDeck("1");
      expect(deck).toEqual(mockDeck);
      expect(apiFetch).toHaveBeenCalledWith("/api/decks/1", { signal: undefined });
    });

    it("should throw standard loading error when not ok", async () => {
      vi.mocked(apiFetch).mockResolvedValueOnce({
        ok: false,
      } as Response);

      await expect(getDeck("1")).rejects.toThrow("Mocked parsing error");
    });
  });

  describe("validateDeck", () => {
    const payload = { name: "A", description: "B", formatName: "TCG", deckCards: [] };

    it("should return ok: true when backend validation succeeds", async () => {
      vi.mocked(apiFetch).mockResolvedValueOnce({
        ok: true,
      } as Response);

      const result = await validateDeck(payload);
      expect(result).toEqual({ ok: true });
    });

    it("should return ok: false with errors when backend validation fails", async () => {
      vi.mocked(apiFetch).mockResolvedValueOnce({
        ok: false,
      } as Response);

      const result = await validateDeck(payload);
      expect(result).toEqual({ ok: false, errors: ["Mocked field error"] });
    });

    it("should handle exceptions by returning connection errors", async () => {
      vi.mocked(apiFetch).mockRejectedValueOnce(new Error("Net error"));

      const result = await validateDeck(payload);
      expect(result).toEqual({ ok: false, errors: ["Net error"] });
    });
  });

  describe("saveDeck", () => {
    const payload = { name: "Save", description: "", formatName: "TCG", deckCards: [] };

    it("should perform POST for new deck", async () => {
      const mockSaved = { id: "new-id", ...payload };
      vi.mocked(apiFetch).mockResolvedValueOnce({
        ok: true,
        json: async () => mockSaved,
      } as Response);

      const result = await saveDeck(payload);
      expect(result).toEqual(mockSaved);
      expect(apiFetch).toHaveBeenCalledWith(
        "/api/decks",
        expect.objectContaining({ method: "POST" }),
      );
    });

    it("should perform PUT for existing deck", async () => {
      const mockSaved = { id: "123", ...payload };
      vi.mocked(apiFetch).mockResolvedValueOnce({
        ok: true,
        json: async () => mockSaved,
      } as Response);

      const result = await saveDeck(payload, "123");
      expect(result).toEqual(mockSaved);
      expect(apiFetch).toHaveBeenCalledWith(
        "/api/decks/123",
        expect.objectContaining({ method: "PUT" }),
      );
    });

    it("should throw parsed error if save is not ok", async () => {
      vi.mocked(apiFetch).mockResolvedValueOnce({
        ok: false,
      } as Response);

      await expect(saveDeck(payload)).rejects.toThrow("Mocked parsing error");
    });
  });

  describe("deleteDeck", () => {
    it("should fetch DELETE endpoint", async () => {
      vi.mocked(apiFetch).mockResolvedValueOnce({
        ok: true,
      } as Response);

      await deleteDeck(123);
      expect(apiFetch).toHaveBeenCalledWith(
        "/api/decks/123",
        expect.objectContaining({ method: "DELETE" }),
      );
    });

    it("should throw error if delete failed", async () => {
      vi.mocked(apiFetch).mockResolvedValueOnce({
        ok: false,
      } as Response);

      await expect(deleteDeck(123)).rejects.toThrow("Mocked parsing error");
    });
  });

  describe("fetchAiSuggestions", () => {
    it("should fetch suggestions on success", async () => {
      const mockSugs = [{ cardId: 1, name: "Rec A", reason: "Good" }];
      vi.mocked(apiFetch).mockResolvedValueOnce({
        ok: true,
        json: async () => mockSugs,
      } as Response);

      const sugs = await fetchAiSuggestions("TCG", []);
      expect(sugs).toEqual(mockSugs);
    });
  });

  describe("generateAiDeck", () => {
    it("should call generate endpoint and return deck details", async () => {
      const payload = { archetype: "Yubel", strategy: "Control", formatName: "TCG" };
      const mockResponse = { name: "AI Deck", deckCards: [] };
      vi.mocked(apiFetch).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      } as Response);

      const result = await generateAiDeck(payload);
      expect(result).toEqual(mockResponse);
      expect(apiFetch).toHaveBeenCalledWith(
        "/api/decks/ai/generate",
        expect.objectContaining({
          method: "POST",
          body: JSON.stringify(payload),
        }),
      );
    });
  });
});
