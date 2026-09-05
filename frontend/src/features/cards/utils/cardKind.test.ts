import { describe, expect, it } from "vitest";

import { getCardKind } from "./cardKind";

describe("cardKind domain utility", () => {
  describe("getCardKind", () => {
    it("should return spell for spell card strings", () => {
      expect(getCardKind("Normal Spell Card")).toBe("spell");
      expect(getCardKind("Quick-Play Spell")).toBe("spell");
      expect(getCardKind("SPELL")).toBe("spell");
    });

    it("should return trap for trap card strings", () => {
      expect(getCardKind("Continuous Trap")).toBe("trap");
      expect(getCardKind("Counter Trap Card")).toBe("trap");
      expect(getCardKind("TRAP")).toBe("trap");
    });

    it("should return monster for monster card strings", () => {
      expect(getCardKind("Effect Monster")).toBe("monster");
      expect(getCardKind("Fusion Monster")).toBe("monster");
      expect(getCardKind("Synchro / Tuner Monster")).toBe("monster");
      expect(getCardKind("XYZ Monster")).toBe("monster");
      expect(getCardKind("Link Monster")).toBe("monster");
      expect(getCardKind("MONSTER")).toBe("monster");
    });

    it("should return default for unknown, undefined, or empty strings", () => {
      expect(getCardKind()).toBe("default");
      expect(getCardKind("")).toBe("default");
      expect(getCardKind("Token")).toBe("default");
      expect(getCardKind("Unknown")).toBe("default");
    });
  });
});
