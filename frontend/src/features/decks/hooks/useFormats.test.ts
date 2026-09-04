import { renderHook, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { formatKeys } from "../../../services/queryKeys";
import { createQueryClientWrapper, createTestQueryClient } from "../../../test/setup";
import { getFormats } from "../api/deck";
import { useFormats } from "./useFormats";

vi.mock("../api/deck", () => ({
  getFormats: vi.fn(),
}));

describe("useFormats hook", () => {
  let queryClient = createTestQueryClient();

  beforeEach(() => {
    queryClient = createTestQueryClient();
    vi.mocked(getFormats).mockReset();
  });

  it("should return formats from API and cache with infinite staleTime", async () => {
    const mockFormats = ["TCG", "OCG", "Goat", "Edison"];
    vi.mocked(getFormats).mockResolvedValueOnce(mockFormats);

    const { result } = renderHook(() => useFormats(), {
      wrapper: createQueryClientWrapper(queryClient),
    });

    expect(result.current.loading).toBe(true);

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.formats).toEqual(mockFormats);
    expect(queryClient.getQueryData(formatKeys.all)).toEqual(mockFormats);
  });
});
