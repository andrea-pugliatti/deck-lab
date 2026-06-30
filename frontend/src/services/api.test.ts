import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import {
  apiFetch,
  getAccessToken,
  parseResponseError,
  parseResponseErrors,
  setAccessToken,
} from "./api";

describe("api service", () => {
  const fetchSpy = vi.spyOn(globalThis, "fetch");

  beforeEach(() => {
    fetchSpy.mockReset();
    setAccessToken(undefined);
    vi.stubGlobal("window", {
      dispatchEvent: vi.fn(),
    });
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  describe("accessToken store", () => {
    it("should initially be undefined", () => {
      expect(getAccessToken()).toBeUndefined();
    });

    it("should set and get access token", () => {
      setAccessToken("my-token");
      expect(getAccessToken()).toBe("my-token");
    });
  });

  describe("parseResponseErrors", () => {
    it("should parse JSON response with list of errors", async () => {
      const response = {
        headers: {
          get: (name: string) => (name === "content-type" ? "application/json" : null),
        },
        json: async () => ({
          errors: [
            "Error 1",
            { defaultMessage: "Error 2" },
            { message: "Error 3" },
            { error: "Error 4" },
            { other: "unknown" },
          ],
        }),
      } as unknown as Response;

      const errors = await parseResponseErrors(response);
      expect(errors).toEqual(["Error 1", "Error 2", "Error 3", "Error 4", "[object Object]"]);
    });

    it("should parse JSON response with single message or error field", async () => {
      const resMsg = {
        headers: {
          get: (name: string) => (name === "content-type" ? "application/json" : null),
        },
        json: async () => ({ message: "Direct message" }),
      } as unknown as Response;

      expect(await parseResponseErrors(resMsg)).toEqual(["Direct message"]);

      const resErr = {
        headers: {
          get: (name: string) => (name === "content-type" ? "application/json" : null),
        },
        json: async () => ({ error: "Direct error" }),
      } as unknown as Response;

      expect(await parseResponseErrors(resErr)).toEqual(["Direct error"]);
    });

    it("should parse text response if not JSON", async () => {
      const response = {
        headers: {
          get: () => "text/plain",
        },
        text: async () => "Plain text error message",
      } as unknown as Response;

      const errors = await parseResponseErrors(response);
      expect(errors).toEqual(["Plain text error message"]);
    });

    it("should fall back to status text if text is empty or json parse fails", async () => {
      const response = {
        headers: {
          get: () => "application/json",
        },
        json: () => Promise.reject(new Error("JSON Parse Error")),
        status: 500,
        statusText: "Internal Server Error",
      } as unknown as Response;

      const errors = await parseResponseErrors(response);
      expect(errors).toEqual(["Error: 500 Internal Server Error"]);
    });
  });

  describe("parseResponseError", () => {
    it("should return an Error object with joined messages", async () => {
      const response = {
        headers: {
          get: () => "application/json",
        },
        json: async () => ({ errors: ["Msg A", "Msg B"] }),
      } as unknown as Response;

      const error = await parseResponseError(response);
      expect(error).toBeInstanceOf(Error);
      expect(error.message).toBe("Msg A, Msg B");
    });
  });

  describe("apiFetch", () => {
    it("should execute fetch with Authorization header when accessToken exists", async () => {
      setAccessToken("token-xyz");
      fetchSpy.mockResolvedValueOnce({
        status: 200,
        ok: true,
      } as Response);

      await apiFetch("/api/test");

      expect(fetchSpy).toHaveBeenCalledWith(
        "/api/test",
        expect.objectContaining({
          headers: expect.objectContaining({
            Authorization: "Bearer token-xyz",
          }),
        }),
      );
    });

    it("should auto-set Content-Type: application/json for bodies that are not FormData", async () => {
      fetchSpy.mockResolvedValueOnce({
        status: 200,
        ok: true,
      } as Response);

      await apiFetch("/api/test", {
        method: "POST",
        body: JSON.stringify({ a: 1 }),
      });

      expect(fetchSpy).toHaveBeenCalledWith(
        "/api/test",
        expect.objectContaining({
          headers: expect.objectContaining({
            "Content-Type": "application/json",
          }),
        }),
      );
    });

    it("should perform silent token refresh on 401 error and retry target fetch", async () => {
      setAccessToken("old-token");

      // 1. Initial request fails with 401
      fetchSpy.mockResolvedValueOnce({
        status: 401,
        ok: false,
      } as Response);

      // 2. Token refresh request succeeds
      fetchSpy.mockResolvedValueOnce({
        status: 200,
        ok: true,
        json: async () => ({ accessToken: "new-token" }),
      } as Response);

      // 3. Retry request succeeds
      fetchSpy.mockResolvedValueOnce({
        status: 200,
        ok: true,
        text: async () => "Retry Success",
      } as Response);

      const res = await apiFetch("/api/data");
      const text = await res.text();

      expect(text).toBe("Retry Success");
      expect(getAccessToken()).toBe("new-token");

      // verify calls:
      // call 1: initial fetch `/api/data`
      expect(fetchSpy).toHaveBeenNthCalledWith(
        1,
        "/api/data",
        expect.objectContaining({
          headers: expect.objectContaining({
            Authorization: "Bearer old-token",
          }),
        }),
      );

      // call 2: refresh token fetch `/api/auth/refresh`
      expect(fetchSpy).toHaveBeenNthCalledWith(
        2,
        "/api/auth/refresh",
        expect.objectContaining({
          method: "POST",
        }),
      );

      // call 3: retry fetch `/api/data` with new token
      expect(fetchSpy).toHaveBeenNthCalledWith(
        3,
        "/api/data",
        expect.objectContaining({
          headers: expect.objectContaining({
            Authorization: "Bearer new-token",
          }),
        }),
      );
    });

    it("should fail when refresh token request itself fails with 401", async () => {
      fetchSpy.mockResolvedValueOnce({
        status: 401,
        ok: false,
      } as Response);

      await expect(apiFetch("/api/auth/refresh")).rejects.toThrow(
        "Refresh token expired or invalid",
      );
      expect(getAccessToken()).toBeUndefined();
    });

    it("should clear token, reject, and dispatch auth-logout when token refresh fails with non-200", async () => {
      setAccessToken("old-token");

      // 1. Initial request fails with 401
      fetchSpy.mockResolvedValueOnce({
        status: 401,
        ok: false,
      } as Response);

      // 2. Refresh fails (e.g., 400 Bad Request)
      fetchSpy.mockResolvedValueOnce({
        status: 400,
        ok: false,
      } as Response);

      await expect(apiFetch("/api/data")).rejects.toThrow("Session expired");
      expect(getAccessToken()).toBeUndefined();
      expect(window.dispatchEvent).toHaveBeenCalledWith(
        expect.objectContaining({ type: "auth-logout" }),
      );
    });
  });
});
