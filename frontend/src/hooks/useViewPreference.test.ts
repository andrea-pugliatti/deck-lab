/**
 * @file useViewPreference.test.ts
 * @description Unit test suite for the useViewPreference hook.
 * Tests local storage persistence, fallback cases, validation, and error resilience.
 */

import { act, renderHook } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { useViewPreference } from "./useViewPreference";

describe("useViewPreference hook", () => {
  const testKey = "test-view-mode";
  let warnSpy: any;

  beforeEach(() => {
    localStorage.clear();
    warnSpy = vi.spyOn(console, "warn").mockImplementation(() => {});
  });

  afterEach(() => {
    warnSpy.mockRestore();
  });

  it("should return the default value when localStorage is empty", () => {
    const { result } = renderHook(() => useViewPreference(testKey, "grid"));
    expect(result.current[0]).toBe("grid");
    expect(localStorage.getItem(testKey)).toBeNull();
  });

  it("should return the default value when default value is list and localStorage is empty", () => {
    const { result } = renderHook(() => useViewPreference(testKey, "list"));
    expect(result.current[0]).toBe("list");
  });

  it("should return stored value when it exists in localStorage", () => {
    localStorage.setItem(testKey, "list");
    const { result } = renderHook(() => useViewPreference(testKey, "grid"));
    expect(result.current[0]).toBe("list");
  });

  it("should ignore invalid stored values and fallback to default", () => {
    localStorage.setItem(testKey, "invalid-mode");
    const { result } = renderHook(() => useViewPreference(testKey, "grid"));
    expect(result.current[0]).toBe("grid");
  });

  it("should set and persist the new view mode in localStorage", () => {
    const { result } = renderHook(() => useViewPreference(testKey, "grid"));

    act(() => {
      result.current[1]("list");
    });

    expect(result.current[0]).toBe("list");
    expect(localStorage.getItem(testKey)).toBe("list");
  });

  it("should catch and warn when localStorage.getItem throws an exception", () => {
    const getItemSpy = vi.spyOn(Storage.prototype, "getItem").mockImplementation(() => {
      throw new Error("Storage blocked");
    });

    const { result } = renderHook(() => useViewPreference(testKey, "grid"));

    expect(result.current[0]).toBe("grid");
    expect(warnSpy).toHaveBeenCalledWith(
      "localStorage view preference read failed:",
      expect.any(Error),
    );

    getItemSpy.mockRestore();
  });

  it("should catch, warn, and still update state when localStorage.setItem throws an exception", () => {
    const setItemSpy = vi.spyOn(Storage.prototype, "setItem").mockImplementation(() => {
      throw new Error("Quota exceeded");
    });

    const { result } = renderHook(() => useViewPreference(testKey, "grid"));

    act(() => {
      result.current[1]("list");
    });

    // The react state should still update even if localStorage fails
    expect(result.current[0]).toBe("list");
    expect(warnSpy).toHaveBeenCalledWith(
      "localStorage view preference write failed:",
      expect.any(Error),
    );

    setItemSpy.mockRestore();
  });
});
