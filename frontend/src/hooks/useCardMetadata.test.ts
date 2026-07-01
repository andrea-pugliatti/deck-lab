import { renderHook, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { apiFetch } from "../services/api";
import { useCardMetadata } from "./useCardMetadata";

vi.mock("../services/api", () => ({
  apiFetch: vi.fn(),
}));

describe("useCardMetadata hook", () => {
  beforeEach(() => {
    vi.mocked(apiFetch).mockReset();
  });

  it("should return defaults initially and then update states with fetched data", async () => {
    const mockTypes = ["Monster", "Spell", "Trap", "Token"];
    const mockAttributes = ["LIGHT", "DARK", "FIRE"];
    const mockRaces = ["Spellcaster", "Dragon"];
    const mockArchetypes = ["Blue-Eyes", "Red-Eyes"];

    vi.mocked(apiFetch).mockImplementation(async (url: string) => {
      if (url.endsWith("/types")) return { ok: true, json: async () => mockTypes } as Response;
      if (url.endsWith("/attributes"))
        return { ok: true, json: async () => mockAttributes } as Response;
      if (url.endsWith("/races")) return { ok: true, json: async () => mockRaces } as Response;
      if (url.endsWith("/archetypes"))
        return { ok: true, json: async () => mockArchetypes } as Response;
      return { ok: false } as Response;
    });

    const { result } = renderHook(() => useCardMetadata());

    // Defaults check
    expect(result.current.types).toContain("Monster");
    expect(result.current.attributes).toContain("LIGHT");
    expect(result.current.races).toEqual([]);
    expect(result.current.archetypes).toEqual([]);

    // Wait for resolution
    await waitFor(() => {
      expect(result.current.races).toEqual(mockRaces);
    });

    expect(result.current.types).toEqual(mockTypes);
    expect(result.current.attributes).toEqual(mockAttributes);
    expect(result.current.archetypes).toEqual(mockArchetypes);
  });
});
