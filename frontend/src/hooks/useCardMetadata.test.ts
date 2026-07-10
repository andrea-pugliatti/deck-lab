import { useQuery } from "@tanstack/react-query";
import { renderHook } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { useCardMetadata } from "./useCardMetadata";

vi.mock("@tanstack/react-query", () => ({
  useQuery: vi.fn(),
}));

describe("useCardMetadata hook", () => {
  beforeEach(() => {
    vi.mocked(useQuery).mockReset();
  });

  it("should return defaults initially and then update states with fetched data", async () => {
    const mockTypes = ["Monster", "Spell", "Trap", "Token"];
    const mockAttributes = ["LIGHT", "DARK", "FIRE"];
    const mockRaces = ["Spellcaster", "Dragon"];
    const mockArchetypes = ["Blue-Eyes", "Red-Eyes"];

    let isFetched = false;
    vi.mocked(useQuery).mockImplementation((options: any) => {
      const key = options?.queryKey?.[1];
      if (!isFetched) {
        return { data: undefined } as any;
      }
      if (key === "types") return { data: mockTypes } as any;
      if (key === "attributes") return { data: mockAttributes } as any;
      if (key === "races") return { data: mockRaces } as any;
      if (key === "archetypes") return { data: mockArchetypes } as any;
      return { data: undefined } as any;
    });

    const { result, rerender } = renderHook(() => useCardMetadata());

    // Defaults check
    expect(result.current.types).toContain("Monster");
    expect(result.current.attributes).toContain("LIGHT");
    expect(result.current.races).toEqual([]);
    expect(result.current.archetypes).toEqual([]);

    // Update fetched state and rerender to simulate async load completion
    isFetched = true;
    rerender();

    expect(result.current.races).toEqual(mockRaces);
    expect(result.current.types).toEqual(mockTypes);
    expect(result.current.attributes).toEqual(mockAttributes);
    expect(result.current.archetypes).toEqual(mockArchetypes);
  });
});
