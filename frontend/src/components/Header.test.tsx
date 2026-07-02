import { fireEvent, render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { useAuth } from "../context/AuthContext";
import Header from "./Header";

vi.mock("../context/AuthContext", () => ({
  useAuth: vi.fn(),
}));

describe("Header component", () => {
  beforeEach(() => {
    vi.mocked(useAuth).mockReset();
  });

  it("should render navigation links and login button when user is anonymous", () => {
    vi.mocked(useAuth).mockReturnValue({
      isAuthenticated: false,
      user: undefined,
      logout: vi.fn(),
      login: vi.fn(),
      register: vi.fn(),
      loading: false,
    });

    render(
      <MemoryRouter>
        <Header />
      </MemoryRouter>,
    );

    expect(screen.getByText("Public Decks")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Login" })).toBeInTheDocument();
    expect(screen.queryByText("My Decks")).not.toBeInTheDocument();
  });

  it("should render user options and logout button when user is authenticated", () => {
    const handleLogout = vi.fn();
    vi.mocked(useAuth).mockReturnValue({
      isAuthenticated: true,
      user: { username: "joey_wheeler", email: "joey@duelist.com" },
      logout: handleLogout,
      login: vi.fn(),
      register: vi.fn(),
      loading: false,
    });

    render(
      <MemoryRouter>
        <Header />
      </MemoryRouter>,
    );

    expect(screen.getByText("My Decks")).toBeInTheDocument();
    expect(screen.getByText("joey_wheeler")).toBeInTheDocument();
    const logoutBtn = screen.getByRole("button", { name: "Logout" });
    expect(logoutBtn).toBeInTheDocument();

    fireEvent.click(logoutBtn);
    expect(handleLogout).toHaveBeenCalledTimes(1);
  });

  it("should toggle mobile navigation menu when button is clicked", () => {
    vi.mocked(useAuth).mockReturnValue({
      isAuthenticated: false,
      user: undefined,
      logout: vi.fn(),
      login: vi.fn(),
      register: vi.fn(),
      loading: false,
    });

    const { container } = render(
      <MemoryRouter>
        <Header />
      </MemoryRouter>,
    );

    const toggleBtn = screen.getByLabelText("Toggle Navigation Menu");
    expect(container.querySelector("#mobile-nav-menu")).not.toBeInTheDocument();

    // Open menu
    fireEvent.click(toggleBtn);
    expect(screen.getByText("Login / Register")).toBeInTheDocument();

    // Close menu
    fireEvent.click(toggleBtn);
    expect(screen.queryByText("Login / Register")).not.toBeInTheDocument();
  });
});
