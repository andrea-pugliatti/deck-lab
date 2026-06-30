import { describe, expect, it, vi } from "vitest";

import { apiFetch } from "./api";
import {
  getCardEndpoint,
  getCardsEndpoint,
  getCardSuggestionsEndpoint,
  getCardMetadataEndpoint,
  getDeckFormatsEndpoint,
  getCard,
} from "./card";

vi.mock("./api", () => ({
  apiFetch: vi.fn(),
  parseResponseError: vi.fn().mockImplementation(async () => new Error("Fetch error")),
}));

describe("card service", () => {
  describe("endpoint builders", () => {
    it("should build card detail endpoint", () => {
      expect(getCardEndpoint(123)).toBe("/api/cards/123");
      expect(getCardEndpoint("abc")).toBe("/api/cards/abc");
    });

    it("should build card list endpoint with query params", () => {
      const params = new URLSearchParams({ page: "1", size: "10" });
      expect(getCardsEndpoint(params)).toBe("/api/cards?page=1&size=10");
    });

    it("should build autocomplete card suggestions endpoint", () => {
      expect(getCardSuggestionsEndpoint("dark mag")).toBe("/api/cards?q=dark%20mag&size=5");
    });

    it("should build metadata endpoints", () => {
      expect(getCardMetadataEndpoint("races")).toBe("/api/cards/races");
      expect(getCardMetadataEndpoint("archetypes")).toBe("/api/cards/archetypes");
    });

    it("should build deck formats endpoint", () => {
      expect(getDeckFormatsEndpoint()).toBe("/api/decks/formats");
    });
  });

  describe("getCard", () => {
    it("should fetch and return a card successfully", async () => {
      const mockCard = { id: 123, name: "Dark Magician", type: "Spellcaster" };
      vi.mocked(apiFetch).mockResolvedValueOnce({
        ok: true,
        json: async () => mockCard,
      } as Response);

      const card = await getCard(123);
      expect(card).toEqual(mockCard);
      expect(apiFetch).toHaveBeenCalledWith("/api/cards/123");
    });

    it("should throw error if fetch response is not ok", async () => {
      vi.mocked(apiFetch).mockResolvedValueOnce({
        ok: false,
      } as Response);

      await expect(getCard(123)).rejects.toThrow("Fetch error");
    });
  });
});
