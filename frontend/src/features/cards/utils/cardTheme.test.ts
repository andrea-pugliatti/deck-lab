import { describe, expect, it } from "vitest";

import { getCardTheme } from "./card";

describe("card utility", () => {
  describe("getCardTheme", () => {
    it("should return spell theme when type string contains 'spell'", () => {
      const theme = getCardTheme("Normal Spell Card");
      expect(theme.type).toBe("spell");
      expect(theme.barColor).toBe("bg-emerald-500");
      expect(theme.badgeVariant).toBe("spell");
    });

    it("should return trap theme when type string contains 'trap'", () => {
      const theme = getCardTheme("Continuous Trap");
      expect(theme.type).toBe("trap");
      expect(theme.barColor).toBe("bg-rose-500");
      expect(theme.badgeVariant).toBe("trap");
    });

    it("should return monster theme when type string contains 'monster'", () => {
      const theme = getCardTheme("Effect Monster");
      expect(theme.type).toBe("monster");
      expect(theme.barColor).toBe("bg-amber-500");
      expect(theme.badgeVariant).toBe("monster");
    });

    it("should return default theme when type string is empty, undefined, or doesn't match", () => {
      const defaultTheme = {
        type: "default",
        borderColor: "border-slate-500/20",
        glowColor: "hover:shadow-[0_0_15px_rgba(148,163,184,0.3)] hover:border-slate-500/40",
        barColor: "bg-slate-500/40",
        badgeVariant: "default",
        gridBadgeColor: "text-slate-400 bg-slate-400/10",
        deckBadgeColor: "border-slate-500/20 text-slate-400 bg-slate-500/5",
        bgGradient: "from-slate-500/5",
      };

      expect(getCardTheme()).toEqual(defaultTheme);
      expect(getCardTheme("Token")).toEqual(defaultTheme);
      expect(getCardTheme("")).toEqual(defaultTheme);
    });

    it("should be case-insensitive", () => {
      const themeUpper = getCardTheme("MONSTER");
      expect(themeUpper.type).toBe("monster");
    });
  });
});
