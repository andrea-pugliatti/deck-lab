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

    it("should return undefined for non-positive numbers or strings", () => {
      expect(parseNumericId("0")).toBeUndefined();
      expect(parseNumericId(0)).toBeUndefined();
      expect(parseNumericId("-1")).toBeUndefined();
      expect(parseNumericId(-5)).toBeUndefined();
    });

    it("should return undefined for decimal numbers or decimal strings", () => {
      expect(parseNumericId("1.5")).toBeUndefined();
      expect(parseNumericId(1.5)).toBeUndefined();
      expect(parseNumericId("42.0")).toBeUndefined();
    });

    it("should return undefined for non-numeric strings", () => {
      expect(parseNumericId("abc")).toBeUndefined();
      expect(parseNumericId("123abc")).toBeUndefined();
      expect(parseNumericId("")).toBeUndefined();
      expect(parseNumericId("   ")).toBeUndefined();
    });

    it("should return undefined for null, undefined, and non-primitive values", () => {
      expect(parseNumericId(null)).toBeUndefined();
      expect(parseNumericId(undefined)).toBeUndefined();
      expect(parseNumericId({})).toBeUndefined();
      expect(parseNumericId([])).toBeUndefined();
      expect(parseNumericId(true)).toBeUndefined();
    });

    it("should return undefined for values exceeding Number.MAX_SAFE_INTEGER", () => {
      expect(parseNumericId(Number.MAX_SAFE_INTEGER + 10)).toBeUndefined();
      expect(parseNumericId(String(Number.MAX_SAFE_INTEGER) + "9")).toBeUndefined();
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
