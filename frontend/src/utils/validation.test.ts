import { describe, expect, it } from "vitest";

import { isValidNumericId, parseNumericId } from "./validation";

describe("validation utilities", () => {
  describe("parseNumericId", () => {
    it("should parse positive integers from strings and numbers", () => {
      expect(parseNumericId("1")).toBe(1);
      expect(parseNumericId("42")).toBe(42);
      expect(parseNumericId(" 100 ")).toBe(100);
      expect(parseNumericId(42)).toBe(42);
    });

    it("should return null for non-positive numbers or strings", () => {
      expect(parseNumericId("0")).toBeNull();
      expect(parseNumericId(0)).toBeNull();
      expect(parseNumericId("-1")).toBeNull();
      expect(parseNumericId(-5)).toBeNull();
    });

    it("should return null for decimal numbers or decimal strings", () => {
      expect(parseNumericId("1.5")).toBeNull();
      expect(parseNumericId(1.5)).toBeNull();
      expect(parseNumericId("42.0")).toBeNull();
    });

    it("should return null for non-numeric strings", () => {
      expect(parseNumericId("abc")).toBeNull();
      expect(parseNumericId("123abc")).toBeNull();
      expect(parseNumericId("")).toBeNull();
      expect(parseNumericId("   ")).toBeNull();
    });

    it("should return null for null, undefined, and non-primitive values", () => {
      expect(parseNumericId(null)).toBeNull();
      expect(parseNumericId(undefined)).toBeNull();
      expect(parseNumericId({})).toBeNull();
      expect(parseNumericId([])).toBeNull();
      expect(parseNumericId(true)).toBeNull();
    });

    it("should return null for values exceeding Number.MAX_SAFE_INTEGER", () => {
      expect(parseNumericId(Number.MAX_SAFE_INTEGER + 10)).toBeNull();
      expect(parseNumericId(String(Number.MAX_SAFE_INTEGER) + "9")).toBeNull();
    });
  });

  describe("isValidNumericId", () => {
    it("should return true for valid numeric IDs", () => {
      expect(isValidNumericId("1")).toBe(true);
      expect(isValidNumericId(42)).toBe(true);
      expect(isValidNumericId(" 100 ")).toBe(true);
    });

    it("should return false for invalid IDs", () => {
      expect(isValidNumericId("0")).toBe(false);
      expect(isValidNumericId("-1")).toBe(false);
      expect(isValidNumericId("abc")).toBe(false);
      expect(isValidNumericId(null)).toBe(false);
      expect(isValidNumericId(undefined)).toBe(false);
      expect(isValidNumericId({})).toBe(false);
    });
  });
});
