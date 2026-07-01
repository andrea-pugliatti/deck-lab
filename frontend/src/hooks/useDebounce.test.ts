import { act, renderHook } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { useDebounce } from "./useDebounce";

describe("useDebounce hook", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("should return initial value immediately", () => {
    const { result } = renderHook(() => useDebounce("initial", 500));
    expect(result.current).toBe("initial");
  });

  it("should debounce values when value changes", () => {
    const { result, rerender } = renderHook(({ val }) => useDebounce(val, 500), {
      initialProps: { val: "initial" },
    });

    rerender({ val: "changed" });
    // Value shouldn't change immediately
    expect(result.current).toBe("initial");

    // Advance time partly
    act(() => {
      vi.advanceTimersByTime(250);
    });
    expect(result.current).toBe("initial");

    // Advance time fully
    act(() => {
      vi.advanceTimersByTime(250);
    });
    expect(result.current).toBe("changed");
  });

  it("should clear old timeout when value changes multiple times in quick succession", () => {
    const { result, rerender } = renderHook(({ val }) => useDebounce(val, 500), {
      initialProps: { val: "initial" },
    });

    rerender({ val: "change1" });
    act(() => {
      vi.advanceTimersByTime(300);
    });
    expect(result.current).toBe("initial");

    rerender({ val: "change2" });
    act(() => {
      vi.advanceTimersByTime(300);
    });
    // Still "initial" because timer reset 300ms ago when val became "change2"
    expect(result.current).toBe("initial");

    act(() => {
      vi.advanceTimersByTime(200);
    });
    expect(result.current).toBe("change2");
  });
});
