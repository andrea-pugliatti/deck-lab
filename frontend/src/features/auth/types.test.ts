import { describe, expect, it } from "vitest";

import { getRedirectPath, isAuthLocationState } from "./types";

describe("auth location state helpers", () => {
  describe("isAuthLocationState", () => {
    it("should return false for non-object and null values", () => {
      expect(isAuthLocationState(null)).toBe(false);
      expect(isAuthLocationState(undefined)).toBe(false);
      expect(isAuthLocationState("string")).toBe(false);
      expect(isAuthLocationState(123)).toBe(false);
      expect(isAuthLocationState(true)).toBe(false);
    });

    it("should return true for valid object states", () => {
      expect(isAuthLocationState({})).toBe(true);
      expect(isAuthLocationState({ from: "/custom-path" })).toBe(true);
      expect(isAuthLocationState({ from: { pathname: "/decks/create" } })).toBe(true);
      expect(isAuthLocationState({ from: undefined })).toBe(true);
    });

    it("should return false when from is an invalid type", () => {
      expect(isAuthLocationState({ from: 123 })).toBe(false);
      expect(isAuthLocationState({ from: true })).toBe(false);
    });
  });

  describe("getRedirectPath", () => {
    it("should return default fallback (/decks) when state is missing or empty", () => {
      expect(getRedirectPath(undefined)).toBe("/decks");
      expect(getRedirectPath(null)).toBe("/decks");
      expect(getRedirectPath({})).toBe("/decks");
    });

    it("should return string destination when from is a string", () => {
      expect(getRedirectPath({ from: "/profile" })).toBe("/profile");
    });

    it("should format pathname, search, and hash when from is an object", () => {
      expect(
        getRedirectPath({
          from: {
            pathname: "/decks/1",
            search: "?tab=cards",
            hash: "#details",
          },
        }),
      ).toBe("/decks/1?tab=cards#details");
    });

    it("should return fallback when pathname/search/hash evaluate to empty string", () => {
      expect(getRedirectPath({ from: {} })).toBe("/decks");
    });

    it("should use custom fallback when provided", () => {
      expect(getRedirectPath(undefined, "/home")).toBe("/home");
      expect(getRedirectPath({}, "/home")).toBe("/home");
    });
  });
});
