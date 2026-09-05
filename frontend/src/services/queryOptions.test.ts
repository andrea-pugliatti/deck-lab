import { describe, expect, it } from "vitest";

import { cardKeys, deckKeys, formatKeys, metaKeys } from "./queryKeys";
import { cardQueries, deckQueries, metaQueries } from "./queryOptions";

describe("queryOptions factories", () => {
  describe("metaQueries", () => {
    it("should configure types query with infinite staleTime and gcTime", () => {
      const options = metaQueries.types();
      expect(options.queryKey).toEqual(metaKeys.types());
      expect(options.staleTime).toBe(Infinity);
      expect(options.gcTime).toBe(Infinity);
      expect(typeof options.queryFn).toBe("function");
    });

    it("should configure attributes query with infinite staleTime and gcTime", () => {
      const options = metaQueries.attributes();
      expect(options.queryKey).toEqual(metaKeys.attributes());
      expect(options.staleTime).toBe(Infinity);
      expect(options.gcTime).toBe(Infinity);
      expect(typeof options.queryFn).toBe("function");
    });

    it("should configure races query with infinite staleTime and gcTime", () => {
      const options = metaQueries.races();
      expect(options.queryKey).toEqual(metaKeys.races());
      expect(options.staleTime).toBe(Infinity);
      expect(options.gcTime).toBe(Infinity);
      expect(typeof options.queryFn).toBe("function");
    });

    it("should configure archetypes query with infinite staleTime and gcTime", () => {
      const options = metaQueries.archetypes();
      expect(options.queryKey).toEqual(metaKeys.archetypes());
      expect(options.staleTime).toBe(Infinity);
      expect(options.gcTime).toBe(Infinity);
      expect(typeof options.queryFn).toBe("function");
    });
  });

  describe("deckQueries", () => {
    it("should configure formats query with infinite staleTime and gcTime", () => {
      const options = deckQueries.formats();
      expect(options.queryKey).toEqual(formatKeys.all);
      expect(options.staleTime).toBe(Infinity);
      expect(options.gcTime).toBe(Infinity);
      expect(typeof options.queryFn).toBe("function");
    });

    it("should configure detail query with enabled condition based on id", () => {
      const enabledOptions = deckQueries.detail("42");
      expect(enabledOptions.queryKey).toEqual(deckKeys.detail("42"));
      expect(enabledOptions.enabled).toBe(true);

      const disabledOptions = deckQueries.detail(undefined);
      expect(disabledOptions.queryKey).toEqual(deckKeys.detail(undefined));
      expect(disabledOptions.enabled).toBe(false);
      // @ts-expect-error - testing queryFn when id is missing
      expect(() => disabledOptions.queryFn({ signal: new AbortController().signal })).toThrow(
        "A valid deck ID is required",
      );
    });

    it("should configure list query with parameter queryKey and queryFn", () => {
      const options = deckQueries.list({ size: "6" });
      expect(options.queryKey).toEqual(deckKeys.list({ size: "6" }));
      expect(typeof options.queryFn).toBe("function");
    });
  });

  describe("cardQueries", () => {
    it("should configure detail query with enabled condition based on id", () => {
      const enabledOptions = cardQueries.detail("100");
      expect(enabledOptions.queryKey).toEqual(cardKeys.detail("100"));
      expect(enabledOptions.enabled).toBe(true);

      const disabledOptions = cardQueries.detail(null);
      expect(disabledOptions.queryKey).toEqual(cardKeys.detail(null));
      expect(disabledOptions.enabled).toBe(false);
      // @ts-expect-error - testing queryFn when id is missing
      expect(() => disabledOptions.queryFn({ signal: new AbortController().signal })).toThrow(
        "A valid card ID is required",
      );
    });

    it("should configure suggestions query with trimmed query and length threshold", () => {
      const options = cardQueries.suggestions(" Blue ");
      expect(options.queryKey).toEqual(cardKeys.suggestions("Blue"));
      expect(options.enabled).toBe(true);
      expect(options.staleTime).toBe(60000);

      const shortOptions = cardQueries.suggestions("a");
      expect(shortOptions.enabled).toBe(false);
    });

    it("should configure list query with parameter queryKey and queryFn", () => {
      const options = cardQueries.list({ size: "6" });
      expect(options.queryKey).toEqual(cardKeys.list({ size: "6" }));
      expect(typeof options.queryFn).toBe("function");
    });
  });
});
