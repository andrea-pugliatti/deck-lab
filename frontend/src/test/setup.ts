import "@testing-library/jest-dom";
import { cleanup } from "@testing-library/react";
import { afterEach, vi } from "vitest";

// Automatically cleanup after each test
afterEach(() => {
  cleanup();
});

class InMemoryStorage implements Storage {
  private store = new Map<string, string>();

  getItem(key: string): string | null {
    return this.store.get(String(key)) ?? null;
  }

  setItem(key: string, value: string): void {
    this.store.set(String(key), String(value));
  }

  removeItem(key: string): void {
    this.store.delete(String(key));
  }

  clear(): void {
    this.store.clear();
  }

  key(index: number): string | null {
    return Array.from(this.store.keys())[index] ?? null;
  }

  get length(): number {
    return this.store.size;
  }
}

const localStorageInstance = new InMemoryStorage();
const sessionStorageInstance = new InMemoryStorage();

// Ensure Storage, localStorage, and sessionStorage are available and properly isolated from Node's built-in Web Storage
Object.defineProperty(globalThis, "Storage", {
  value: InMemoryStorage,
  writable: true,
  configurable: true,
});
Object.defineProperty(globalThis, "localStorage", {
  value: localStorageInstance,
  writable: true,
  configurable: true,
});
Object.defineProperty(globalThis, "sessionStorage", {
  value: sessionStorageInstance,
  writable: true,
  configurable: true,
});

if (typeof window !== "undefined") {
  Object.defineProperty(window, "Storage", {
    value: InMemoryStorage,
    writable: true,
    configurable: true,
  });
  Object.defineProperty(window, "localStorage", {
    value: localStorageInstance,
    writable: true,
    configurable: true,
  });
  Object.defineProperty(window, "sessionStorage", {
    value: sessionStorageInstance,
    writable: true,
    configurable: true,
  });
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
    removeQueries: vi.fn(),
    clear: vi.fn(),
    setQueryData: vi.fn(),
  }),
  QueryClient: class {
    clear = vi.fn();
    invalidateQueries = vi.fn();
    removeQueries = vi.fn();
  },
  QueryClientProvider: ({ children }: { children: React.ReactNode }) => children,
  keepPreviousData: () => undefined,
  QueryErrorResetBoundary: ({
    children,
  }: {
    children: (props: { reset: () => void }) => React.ReactNode;
  }) => children({ reset: vi.fn() }),
  useQueryErrorResetBoundary: () => ({ reset: vi.fn() }),
}));
