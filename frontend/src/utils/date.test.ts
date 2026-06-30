import { describe, expect, it } from "vitest";

import { formatRelativeTime } from "./date";

describe("date utility", () => {
  describe("formatRelativeTime", () => {
    it("should return 'some time ago' if dateString is undefined", () => {
      expect(formatRelativeTime()).toBe("some time ago");
      expect(formatRelativeTime("")).toBe("some time ago");
    });

    it("should return 'just now' if time difference is less than a minute", () => {
      const nowStr = new Date().toISOString();
      expect(formatRelativeTime(nowStr)).toBe("just now");
    });

    it("should return 'X minutes ago'", () => {
      const minutesAgo = new Date(Date.now() - 5 * 60000).toISOString();
      expect(formatRelativeTime(minutesAgo)).toBe("5 minutes ago");

      const oneMinuteAgo = new Date(Date.now() - 1 * 60000).toISOString();
      expect(formatRelativeTime(oneMinuteAgo)).toBe("1 minute ago");
    });

    it("should return 'X hours ago'", () => {
      const hoursAgo = new Date(Date.now() - 3 * 3600000).toISOString();
      expect(formatRelativeTime(hoursAgo)).toBe("3 hours ago");

      const oneHourAgo = new Date(Date.now() - 1 * 3600000).toISOString();
      expect(formatRelativeTime(oneHourAgo)).toBe("1 hour ago");
    });

    it("should return 'X days ago'", () => {
      const daysAgo = new Date(Date.now() - 4 * 86400000).toISOString();
      expect(formatRelativeTime(daysAgo)).toBe("4 days ago");

      const oneDayAgo = new Date(Date.now() - 1 * 86400000).toISOString();
      expect(formatRelativeTime(oneDayAgo)).toBe("1 day ago");
    });

    it("should return local date string if difference is 30 days or more", () => {
      const longAgo = new Date(Date.now() - 31 * 86400000);
      const result = formatRelativeTime(longAgo.toISOString());
      expect(result).toBe(longAgo.toLocaleDateString());
    });

    it("should return 'recently' if parsing fails or invalid date is passed", () => {
      expect(formatRelativeTime("invalid-date-string")).toBe("recently");
    });
  });
});
