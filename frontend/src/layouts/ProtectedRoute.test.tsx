import { render, screen } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { useAuth } from "../context/AuthContext";
import ProtectedRoute from "./ProtectedRoute";

vi.mock("../context/AuthContext", () => ({
  useAuth: vi.fn(),
}));

describe("ProtectedRoute component", () => {
  beforeEach(() => {
    vi.mocked(useAuth).mockReset();
  });

  it("should render loading spinner while auth status is loading", () => {
    vi.mocked(useAuth).mockReturnValue({
      isAuthenticated: false,
      loading: true,
    } as any);

    const { container } = render(
      <MemoryRouter>
        <ProtectedRoute />
      </MemoryRouter>,
    );

    const spinner = container.querySelector(".animate-spin");
    expect(spinner).toBeInTheDocument();
  });

  it("should render child route elements if user is authenticated", () => {
    vi.mocked(useAuth).mockReturnValue({
      isAuthenticated: true,
      loading: false,
    } as any);

    render(
      <MemoryRouter initialEntries={["/admin"]}>
        <Routes>
          <Route path="/admin" element={<ProtectedRoute />}>
            <Route index element={<div data-testid="protected">Dashboard</div>} />
          </Route>
        </Routes>
      </MemoryRouter>,
    );

    expect(screen.getByTestId("protected")).toHaveTextContent("Dashboard");
  });

  it("should redirect to login if user is not authenticated", () => {
    vi.mocked(useAuth).mockReturnValue({
      isAuthenticated: false,
      loading: false,
    } as any);

    render(
      <MemoryRouter initialEntries={["/admin"]}>
        <Routes>
          <Route path="/admin" element={<ProtectedRoute />}>
            <Route index element={<div data-testid="protected">Dashboard</div>} />
          </Route>
          <Route path="/login" element={<div data-testid="login">Login Page</div>} />
        </Routes>
      </MemoryRouter>,
    );

    expect(screen.queryByTestId("protected")).not.toBeInTheDocument();
    expect(screen.getByTestId("login")).toHaveTextContent("Login Page");
  });
});
