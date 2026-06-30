import { beforeEach, describe, expect, it, vi } from "vitest";

import { login, logout, parseJwt, refreshToken, register } from "./auth";

describe("auth service", () => {
  const fetchSpy = vi.spyOn(globalThis, "fetch");

  beforeEach(() => {
    fetchSpy.mockReset();
  });

  describe("login", () => {
    it("should return token and username on success", async () => {
      fetchSpy.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ accessToken: "test-token", username: "testuser" }),
      } as Response);

      const result = await login("testuser", "password123");

      expect(result).toEqual({ accessToken: "test-token", username: "testuser" });
      expect(fetchSpy).toHaveBeenCalledWith(
        "/api/auth/login",
        expect.objectContaining({
          method: "POST",
          body: JSON.stringify({ username: "testuser", password: "password123" }),
        }),
      );
    });

    it("should throw rate-limit error on 429", async () => {
      fetchSpy.mockResolvedValueOnce({
        ok: false,
        status: 429,
      } as Response);

      await expect(login("testuser", "pass")).rejects.toThrow(
        "Too many login attempts. Please try again later.",
      );
    });

    it("should throw invalid credentials error on other non-ok status codes", async () => {
      fetchSpy.mockResolvedValueOnce({
        ok: false,
        status: 401,
      } as Response);

      await expect(login("testuser", "pass")).rejects.toThrow("Invalid username or password");
    });
  });

  describe("register", () => {
    it("should return token and username on registration success", async () => {
      fetchSpy.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ accessToken: "reg-token", username: "newuser" }),
      } as Response);

      const result = await register("newuser", "new@test.com", "secure123");

      expect(result).toEqual({ accessToken: "reg-token", username: "newuser" });
      expect(fetchSpy).toHaveBeenCalledWith(
        "/api/auth/register",
        expect.objectContaining({
          method: "POST",
          body: JSON.stringify({
            username: "newuser",
            email: "new@test.com",
            password: "secure123",
          }),
        }),
      );
    });

    it("should throw server error text on registration failure", async () => {
      fetchSpy.mockResolvedValueOnce({
        ok: false,
        text: async () => "Username already exists",
      } as Response);

      await expect(register("newuser", "new@test.com", "pwd")).rejects.toThrow(
        "Username already exists",
      );
    });

    it("should fall back to 'Registration failed' if error response contains no text", async () => {
      fetchSpy.mockResolvedValueOnce({
        ok: false,
        text: async () => "",
      } as Response);

      await expect(register("newuser", "new@test.com", "pwd")).rejects.toThrow(
        "Registration failed",
      );
    });
  });

  describe("logout", () => {
    it("should perform logout call successfully", async () => {
      fetchSpy.mockResolvedValueOnce({
        ok: true,
      } as Response);

      await expect(logout()).resolves.toBeUndefined();
      expect(fetchSpy).toHaveBeenCalledWith(
        "/api/auth/logout",
        expect.objectContaining({
          method: "POST",
          credentials: "same-origin",
        }),
      );
    });

    it("should throw an error if logout response is not ok", async () => {
      fetchSpy.mockResolvedValueOnce({
        ok: false,
      } as Response);

      await expect(logout()).rejects.toThrow("Logout failed");
    });
  });

  describe("refreshToken", () => {
    it("should retrieve a new access token", async () => {
      fetchSpy.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ accessToken: "refreshed-token" }),
      } as Response);

      const result = await refreshToken();
      expect(result).toEqual({ accessToken: "refreshed-token" });
    });

    it("should throw error if token refresh response is not ok", async () => {
      fetchSpy.mockResolvedValueOnce({
        ok: false,
      } as Response);

      await expect(refreshToken()).rejects.toThrow("Failed to refresh token");
    });
  });

  describe("parseJwt", () => {
    beforeEach(() => {
      // Mock window.atob which might not be defined in jsdom
      if (typeof window !== "undefined") {
        window.atob = vi
          .fn()
          .mockImplementation((str: string) => Buffer.from(str, "base64").toString("binary"));
      }
    });

    it("should decode and parse valid JWT payload", () => {
      // Payload: {"sub":"user123","admin":true}
      // base64 url-safe: eyJzdWIiOiJ1c2VyMTIzIiwiYWRtaW4iOnRydWV9
      const validJwt = "header.eyJzdWIiOiJ1c2VyMTIzIiwiYWRtaW4iOnRydWV9.signature";
      const payload = parseJwt(validJwt);
      expect(payload).toEqual({ sub: "user123", admin: true });
    });

    it("should return undefined for malformed JWT tokens", () => {
      expect(parseJwt("malformed")).toBeUndefined();
      expect(parseJwt("part1.part2")).toBeUndefined();
    });
  });
});
