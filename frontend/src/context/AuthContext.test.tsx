import { act, render, screen, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import {
  login as apiLogin,
  logout as apiLogout,
  refreshToken as apiRefreshToken,
  register as apiRegister,
} from "../services/auth";
import { AuthProvider, useAuth } from "./AuthContext";

vi.mock("../services/auth", () => ({
  login: vi.fn(),
  logout: vi.fn(),
  refreshToken: vi.fn(),
  register: vi.fn(),
  parseJwt: vi.fn().mockReturnValue({ sub: "user@test.com" }),
}));

function ConsumerComponent() {
  const { user, isAuthenticated, login, logout, register, loading } = useAuth();
  if (loading) return <div>Loading...</div>;
  return (
    <div>
      <span data-testid="auth-state">{isAuthenticated ? "authenticated" : "guest"}</span>
      <span data-testid="username">{user?.username || ""}</span>
      <button onClick={() => login("test", "pass")}>Login</button>
      <button onClick={() => register("user1", "email", "pass")}>Register</button>
      <button onClick={logout}>Logout</button>
    </div>
  );
}

describe("AuthContext", () => {
  beforeEach(() => {
    vi.mocked(apiLogin).mockReset();
    vi.mocked(apiLogout).mockReset();
    vi.mocked(apiRefreshToken).mockReset();
    vi.mocked(apiRegister).mockReset();
    localStorage.clear();
  });

  it("should attempt auto login via refresh token on mount", async () => {
    vi.mocked(apiRefreshToken).mockResolvedValueOnce({ accessToken: "token-abc" });
    localStorage.setItem("username", "cacheduser");

    render(
      <AuthProvider>
        <ConsumerComponent />
      </AuthProvider>,
    );

    // Initial state is loading
    expect(screen.getByText("Loading...")).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByTestId("auth-state")).toHaveTextContent("authenticated");
    });

    expect(screen.getByTestId("username")).toHaveTextContent("cacheduser");
    expect(apiRefreshToken).toHaveBeenCalled();
  });

  it("should login user and set authentication state", async () => {
    // Fail auto-login on mount
    vi.mocked(apiRefreshToken).mockRejectedValueOnce(new Error("No refresh token"));
    vi.mocked(apiLogin).mockResolvedValueOnce({
      accessToken: "logged-in-token",
      username: "superman",
    });

    render(
      <AuthProvider>
        <ConsumerComponent />
      </AuthProvider>,
    );

    await waitFor(() => {
      expect(screen.getByTestId("auth-state")).toHaveTextContent("guest");
    });

    await act(async () => {
      screen.getByText("Login").click();
    });

    expect(screen.getByTestId("auth-state")).toHaveTextContent("authenticated");
    expect(screen.getByTestId("username")).toHaveTextContent("superman");
    expect(localStorage.getItem("username")).toBe("superman");
  });

  it("should logout user and clear local storage", async () => {
    // Auto-login succeeds on mount
    vi.mocked(apiRefreshToken).mockResolvedValueOnce({ accessToken: "token-abc" });
    vi.mocked(apiLogout).mockResolvedValueOnce();

    render(
      <AuthProvider>
        <ConsumerComponent />
      </AuthProvider>,
    );

    await waitFor(() => {
      expect(screen.getByTestId("auth-state")).toHaveTextContent("authenticated");
    });

    await act(async () => {
      screen.getByText("Logout").click();
    });

    expect(screen.getByTestId("auth-state")).toHaveTextContent("guest");
    expect(localStorage.getItem("username")).toBeNull();
  });

  it("should throw error if useAuth is used outside AuthProvider", () => {
    // Disable console.error to avoid test output noise
    const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {});
    expect(() => render(<ConsumerComponent />)).toThrow(
      "useAuth must be used within an AuthProvider",
    );
    consoleSpy.mockRestore();
  });
});
