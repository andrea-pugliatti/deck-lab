import "@testing-library/jest-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { cleanup, render, type RenderOptions } from "@testing-library/react";
import type React from "react";
import { createElement } from "react";
import { afterEach, vi } from "vitest";

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

const storageProperties = {
  Storage: { value: InMemoryStorage, writable: true, configurable: true },
  localStorage: { value: new InMemoryStorage(), writable: true, configurable: true },
  sessionStorage: { value: new InMemoryStorage(), writable: true, configurable: true },
};
Object.defineProperties(globalThis, storageProperties);
if (typeof window !== "undefined") {
  Object.defineProperties(window, storageProperties);
}

if (typeof window !== "undefined") {
  if (!window.matchMedia) {
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

  if (!window.ResizeObserver) {
    Object.defineProperty(window, "ResizeObserver", {
      writable: true,
      value: class {
        observe = vi.fn();
        unobserve = vi.fn();
        disconnect = vi.fn();
      },
    });
  }
}

if (typeof globalThis.fetch === "undefined") {
  globalThis.fetch = vi.fn();
}

export function createTestQueryClient(): QueryClient {
  return new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
        gcTime: Infinity,
      },
      mutations: {
        retry: false,
      },
    },
  });
}

export function createQueryClientWrapper(client: QueryClient = createTestQueryClient()) {
  return function QueryClientWrapper({ children }: { children: React.ReactNode }) {
    return createElement(QueryClientProvider, { client }, children);
  };
}

export function renderWithClient(
  ui: React.ReactElement,
  client: QueryClient = createTestQueryClient(),
  options?: Omit<RenderOptions, "wrapper">,
) {
  const { rerender, ...result } = render(ui, {
    wrapper: createQueryClientWrapper(client),
    ...options,
  });

  return {
    ...result,
    client,
    rerender: (rerenderUi: React.ReactElement) =>
      rerender(createElement(QueryClientProvider, { client }, rerenderUi)),
  };
}

export * from "@testing-library/react";
