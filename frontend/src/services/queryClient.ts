/**
 * @file queryClient.ts
 * @description Centralized TanStack Query client instance configured with default
 * query options for caching, stale time, and retry policies.
 */

import { QueryClient } from "@tanstack/react-query";

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 3 * 60 * 1000,
      gcTime: 10 * 60 * 1000,
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});
