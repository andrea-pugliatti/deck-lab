import "@testing-library/jest-dom";
import { cleanup } from "@testing-library/react";
import { afterEach, vi } from "vitest";

// Automatically cleanup after each test
afterEach(() => {
  cleanup();
});

// Ensure localStorage and sessionStorage are available and properly isolated from Node's built-in Web Storage
if (typeof window !== "undefined") {
  try {
    vi.stubGlobal("localStorage", window.localStorage);
    vi.stubGlobal("sessionStorage", window.sessionStorage);
  } catch {
    const createStorageMock = () => {
      let store: Record<string, string> = {};
      return {
        getItem: vi.fn((key: string) => store[key] ?? null),
        setItem: vi.fn((key: string, value: string) => {
          store[key] = String(value);
        }),
        removeItem: vi.fn((key: string) => {
          delete store[key];
        }),
        clear: vi.fn(() => {
          store = {};
        }),
        key: vi.fn((index: number) => Object.keys(store)[index] ?? null),
        get length() {
          return Object.keys(store).length;
        },
      };
    };
    vi.stubGlobal("localStorage", createStorageMock());
    vi.stubGlobal("sessionStorage", createStorageMock());
  }
}

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
  QueryClientProvider: ({ children }: { children: React.ReactNode }) => children,
}));
