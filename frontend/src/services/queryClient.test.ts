import { describe, expect, it, vi } from "vitest";

// Unmock @tanstack/react-query to test actual QueryClient configuration
vi.unmock("@tanstack/react-query");

import { QueryClient } from "@tanstack/react-query";

import { queryClient } from "./queryClient";

describe("queryClient", () => {
  it("should be an instance of QueryClient", () => {
    expect(queryClient).toBeInstanceOf(QueryClient);
  });

  it("should have correct default options configured", () => {
    const defaultOptions = queryClient.getDefaultOptions();

    expect(defaultOptions.queries?.staleTime).toBe(3 * 60 * 1000);
    expect(defaultOptions.queries?.gcTime).toBe(10 * 60 * 1000);
    expect(defaultOptions.queries?.refetchOnWindowFocus).toBe(false);
    expect(defaultOptions.queries?.retry).toBe(1);
  });
});
