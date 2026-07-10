import "@testing-library/jest-dom";
import { cleanup } from "@testing-library/react";
import { afterEach, vi } from "vitest";

// Automatically cleanup after each test
afterEach(() => {
  cleanup();
});

// Mock window.matchMedia if it doesn't exist
if (typeof window !== "undefined" && !window.matchMedia) {
  Object.defineProperty(window, "matchMedia", {
    writable: true,
    value: vi.fn().mockImplementation((query) => ({
      matches: false,
      media: query,
      onchange: null,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    })),
  });
}

// Mock ResizeObserver
if (typeof window !== "undefined" && !window.ResizeObserver) {
  class ResizeObserver {
    observe = vi.fn();
    unobserve = vi.fn();
    disconnect = vi.fn();
  }
  Object.defineProperty(window, "ResizeObserver", {
    writable: true,
    value: ResizeObserver,
  });
}

// Mock global fetch if not present in env (jsdom has fetch, but good to ensure spyable)
if (typeof globalThis.fetch === "undefined") {
  globalThis.fetch = vi.fn();
}

// Mock @tanstack/react-query globally
vi.mock("@tanstack/react-query", () => ({
  useQuery: vi.fn().mockReturnValue({}),
  useMutation: vi.fn().mockReturnValue({
    mutate: vi.fn(),
    mutateAsync: vi.fn(),
    isPending: false,
    isLoading: false,
  }),
  useQueryClient: vi.fn().mockReturnValue({
    invalidateQueries: vi.fn(),
  }),
  QueryClient: class {
    clear = vi.fn();
  },
  QueryClientProvider: ({ children }: any) => children,
}));
