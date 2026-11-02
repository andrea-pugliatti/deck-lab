import { renderHook, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { getMetadata } from "../../../features/cards";
import { createQueryClientWrapper, createTestQueryClient } from "../../../test/setup";
import { useCardMetadata } from "./useCardMetadata";

vi.mock("../../../features/cards", () => ({
  getMetadata: vi.fn(),
}));

describe("useCardMetadata hook", () => {
  let queryClient = createTestQueryClient();

  beforeEach(() => {
    queryClient = createTestQueryClient();
    vi.mocked(getMetadata).mockReset();
  });

  it("should return defaults initially and then update states with fetched data", async () => {
    const mockTypes = ["Normal Monster", "Spell Card", "Trap Card", "Token"];
    const mockAttributes = ["LIGHT", "DARK", "FIRE"];
    const mockRaces = ["Spellcaster", "Dragon"];
    const mockArchetypes = ["Blue-Eyes", "Red-Eyes"];

    vi.mocked(getMetadata).mockImplementation(async (type) => {
      if (type === "types") return mockTypes;
      if (type === "attributes") return mockAttributes;
      if (type === "races") return mockRaces;
      if (type === "archetypes") return mockArchetypes;
      return [];
    });

    const { result } = renderHook(() => useCardMetadata(), {
      wrapper: createQueryClientWrapper(queryClient),
    });

    expect(result.current.types).toContain("Normal Monster");
    expect(result.current.attributes).toContain("LIGHT");
    expect(result.current.races).toEqual([]);
    expect(result.current.archetypes).toEqual([]);

    await waitFor(() => {
      expect(result.current.races).toEqual(mockRaces);
    });

    expect(result.current.types).toEqual(mockTypes);
    expect(result.current.attributes).toEqual(mockAttributes);
    expect(result.current.archetypes).toEqual(mockArchetypes);
  });

  it("should filter out invalid metadata values using runtime type guards", async () => {
    const rawTypes = ["Normal Monster", "InvalidType", "FakeMonster", "Spell Card"];
    const rawAttributes = ["LIGHT", "INVALID_ATTR", "FIRE", "UNKNOWN_ATTR"];
    const rawRaces = ["Spellcaster", "InvalidRace", "Dragon"];

    vi.mocked(getMetadata).mockImplementation(async (type) => {
      if (type === "types") return rawTypes;
      if (type === "attributes") return rawAttributes;
      if (type === "races") return rawRaces;
      if (type === "archetypes") return ["Blue-Eyes"];
      return [];
    });

    const { result } = renderHook(() => useCardMetadata(), {
      wrapper: createQueryClientWrapper(queryClient),
    });

    await waitFor(() => {
      expect(result.current.races).toEqual(["Spellcaster", "Dragon"]);
    });

    expect(result.current.types).toEqual(["Normal Monster", "Spell Card"]);
    expect(result.current.attributes).toEqual(["LIGHT", "FIRE"]);
  });
});
