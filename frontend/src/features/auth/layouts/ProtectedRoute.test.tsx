import { render, screen } from "@testing-library/react";
import { MemoryRouter, Route, Routes, useLocation } from "react-router";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { useAuth } from "../../../features/auth";
import type { AuthLocationState } from "../types";
import { isAuthLocationState } from "../types";
import ProtectedRoute from "./ProtectedRoute";

vi.mock("../context/AuthContext", () => ({
  useAuth: vi.fn(),
}));

describe("ProtectedRoute component", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should render loading spinner while authentication state is resolving", () => {
    vi.mocked(useAuth).mockReturnValue({
      isAuthenticated: false,
      loading: true,
    } as unknown as ReturnType<typeof useAuth>);

    const { container } = render(
      <MemoryRouter>
        <ProtectedRoute />
      </MemoryRouter>,
    );

    expect(container.querySelector(".animate-spin")).toBeInTheDocument();
  });

  it("should render Outlet if user is authenticated", () => {
    vi.mocked(useAuth).mockReturnValue({
      isAuthenticated: true,
      loading: false,
    } as unknown as ReturnType<typeof useAuth>);

    render(
      <MemoryRouter initialEntries={["/decks"]}>
        <Routes>
          <Route path="/decks" element={<ProtectedRoute />}>
            <Route index element={<div data-testid="protected">Deck View</div>} />
          </Route>
        </Routes>
      </MemoryRouter>,
    );

    expect(screen.getByTestId("protected")).toBeInTheDocument();
  });

  it("should redirect to login preserving attempted location state if user is not authenticated", () => {
    vi.mocked(useAuth).mockReturnValue({
      isAuthenticated: false,
      loading: false,
    } as unknown as ReturnType<typeof useAuth>);

    function LoginPage() {
      const location = useLocation();
      const state = isAuthLocationState(location.state)
        ? (location.state as AuthLocationState)
        : null;
      const stateFrom = typeof state?.from === "object" ? state.from : undefined;
      return <div data-testid="login">Login Page (from: {stateFrom?.pathname})</div>;
    }

    render(
      <MemoryRouter initialEntries={["/decks/create"]}>
        <Routes>
          <Route path="/decks/create" element={<ProtectedRoute />}>
            <Route index element={<div data-testid="protected">Create Deck</div>} />
          </Route>
          <Route path="/login" element={<LoginPage />} />
        </Routes>
      </MemoryRouter>,
    );

    expect(screen.queryByTestId("protected")).not.toBeInTheDocument();
    expect(screen.getByTestId("login")).toHaveTextContent("Login Page (from: /decks/create)");
  });
});
