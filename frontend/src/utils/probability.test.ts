import { describe, expect, it } from "vitest";

import { calculateProbability, choose, hypergeometric } from "./probability";

describe("probability utility", () => {
  describe("choose (combinations)", () => {
    it("should return 0 when k is less than 0 or greater than n", () => {
      expect(choose(5, -1)).toBe(0);
      expect(choose(5, 6)).toBe(0);
    });

    it("should return 1 when k is 0 or k is equal to n", () => {
      expect(choose(5, 0)).toBe(1);
      expect(choose(5, 5)).toBe(1);
    });

    it("should correctly compute binomial coefficients", () => {
      // 5 choose 2 = 10
      expect(choose(5, 2)).toBe(10);
      // 10 choose 3 = 120
      expect(choose(10, 3)).toBe(120);
      // 40 choose 5 = 658008
      expect(choose(40, 5)).toBe(658008);
    });

    it("should optimize calculation by setting k = n - k if k > n / 2", () => {
      expect(choose(10, 8)).toBe(choose(10, 2));
    });
  });

  describe("hypergeometric probability", () => {
    it("should return 0 if population denominator is 0", () => {
      expect(hypergeometric(1, 0, 1, 1)).toBe(0);
    });

    it("should correctly calculate hypergeometric probability", () => {
      // Standard scenario: deck of 40 (N), with 3 copies of a card (K).
      // We draw 5 cards (n). What is probability of getting exactly 1 copy (x)?
      // choose(3, 1) * choose(37, 4) / choose(40, 5)
      // = 3 * 66045 / 658008 = 198135 / 658008 ≈ 0.3011
      const prob = hypergeometric(1, 40, 3, 5);
      expect(prob).toBeCloseTo(0.3011, 4);
    });

    it("should return 0 when asking for impossible number of successes", () => {
      // asking for 2 successes from a population with 1 success
      expect(hypergeometric(2, 40, 1, 5)).toBe(0);
    });
  });

  describe("calculateProbability (cumulative draw)", () => {
    it("should return 0 for invalid inputs", () => {
      expect(calculateProbability(0, 3, 5, 1)).toBe(0);
      expect(calculateProbability(40, 0, 5, 1)).toBe(0);
      expect(calculateProbability(40, 3, 0, 1)).toBe(0);
      expect(calculateProbability(40, 3, 5, 4)).toBe(0); // cannot draw at least 4 successes if only 3 exist
    });

    it("should return 1.0 if sample size is greater than population size", () => {
      expect(calculateProbability(5, 3, 6, 1)).toBe(1.0);
    });

    it("should calculate cumulative probability correctly", () => {
      // Deck of 40, 3 copies of card, hand of 5, drawing AT LEAST 1 success.
      // P(at least 1) = P(1) + P(2) + P(3)
      // Or 1 - P(0)
      // P(0) = choose(3, 0) * choose(37, 5) / choose(40, 5) = 1 * 435897 / 658008 ≈ 0.6624
      // P(at least 1) ≈ 1 - 0.6624 = 0.3376
      const prob = calculateProbability(40, 3, 5, 1);
      expect(prob).toBeCloseTo(0.3376, 4);
    });

    it("should handle drawing at least 2 successes", () => {
      // P(at least 2) = P(2) + P(3)
      // P(2) = choose(3, 2) * choose(37, 3) / choose(40, 5) = 3 * 7770 / 658008 ≈ 0.0354
      // P(3) = choose(3, 3) * choose(37, 2) / choose(40, 5) = 1 * 666 / 658008 ≈ 0.0010
      // P(at least 2) ≈ 0.0364
      const prob = calculateProbability(40, 3, 5, 2);
      expect(prob).toBeCloseTo(0.0364, 4);
    });
  });
});
