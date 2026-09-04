import { act } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import {
  login as apiLogin,
  logout as apiLogout,
  refreshToken as apiRefreshToken,
  register as apiRegister,
} from "../../../features/auth";
import {
  createTestQueryClient,
  render,
  renderWithClient,
  screen,
  waitFor,
} from "../../../test/setup";
import { AuthProvider, useAuth } from "./AuthContext";

vi.mock("../api/auth", () => ({
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
  let queryClient = createTestQueryClient();
  let clearSpy: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    vi.mocked(apiLogin).mockReset();
    vi.mocked(apiLogout).mockReset();
    vi.mocked(apiRefreshToken).mockReset();
    vi.mocked(apiRegister).mockReset();
    localStorage.clear();

    queryClient = createTestQueryClient();
    clearSpy = vi.spyOn(queryClient, "clear");
  });

  it("should attempt auto login via refresh token on mount", async () => {
    vi.mocked(apiRefreshToken).mockResolvedValueOnce({ accessToken: "token-abc" });
    localStorage.setItem("username", "cacheduser");

    renderWithClient(
      <AuthProvider>
        <ConsumerComponent />
      </AuthProvider>,
      queryClient,
    );

    expect(screen.getByText("Loading...")).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByTestId("auth-state")).toHaveTextContent("authenticated");
    });

    expect(screen.getByTestId("username")).toHaveTextContent("cacheduser");
    expect(apiRefreshToken).toHaveBeenCalled();
    expect(clearSpy).not.toHaveBeenCalled();
  });

  it("should login user and set authentication state", async () => {
    vi.mocked(apiRefreshToken).mockRejectedValueOnce(new Error("No refresh token"));
    vi.mocked(apiLogin).mockResolvedValueOnce({
      accessToken: "logged-in-token",
      username: "superman",
    });

    renderWithClient(
      <AuthProvider>
        <ConsumerComponent />
      </AuthProvider>,
      queryClient,
    );

    await waitFor(() => {
      expect(screen.getByTestId("auth-state")).toHaveTextContent("guest");
    });

    expect(clearSpy).toHaveBeenCalled();

    await act(async () => {
      screen.getByText("Login").click();
    });

    expect(screen.getByTestId("auth-state")).toHaveTextContent("authenticated");
    expect(screen.getByTestId("username")).toHaveTextContent("superman");
    expect(localStorage.getItem("username")).toBe("superman");
  });

  it("should logout user and clear local storage", async () => {
    vi.mocked(apiRefreshToken).mockResolvedValueOnce({ accessToken: "token-abc" });
    vi.mocked(apiLogout).mockResolvedValueOnce();
    localStorage.setItem("username", "cacheduser");

    renderWithClient(
      <AuthProvider>
        <ConsumerComponent />
      </AuthProvider>,
      queryClient,
    );

    await waitFor(() => {
      expect(screen.getByTestId("auth-state")).toHaveTextContent("authenticated");
    });

    expect(clearSpy).not.toHaveBeenCalled();

    await act(async () => {
      screen.getByText("Logout").click();
    });

    expect(screen.getByTestId("auth-state")).toHaveTextContent("guest");
    expect(localStorage.getItem("username")).toBeNull();
    expect(clearSpy).toHaveBeenCalled();
  });

  it("should throw error if useAuth is used outside AuthProvider", () => {
    const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {});
    expect(() => render(<ConsumerComponent />)).toThrow(
      "useAuth must be used within an AuthProvider",
    );
    consoleSpy.mockRestore();
  });
});
