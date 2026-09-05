import { fireEvent, render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { useAuth } from "../../features/auth";
import Header from "./Header";

vi.mock("../../features/auth", () => ({
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
    expect(toggleBtn).toHaveClass("focus-visible:outline-hidden");
    expect(toggleBtn).toHaveClass("focus-visible:ring-2");
    expect(toggleBtn).toHaveClass("focus-visible:ring-cyan-accent");
    expect(container.querySelector("#mobile-nav-menu")).not.toBeInTheDocument();

    // Open menu
    fireEvent.click(toggleBtn);
    expect(screen.getByText("Login / Register")).toBeInTheDocument();

    // Close menu
    fireEvent.click(toggleBtn);
    expect(screen.queryByText("Login / Register")).not.toBeInTheDocument();
  });

  describe("NavLink active matching (section hubs vs exact page matches)", () => {
    it("should highlight Home only on exact / route", () => {
      vi.mocked(useAuth).mockReturnValue({
        isAuthenticated: false,
        user: undefined,
        logout: vi.fn(),
        login: vi.fn(),
        register: vi.fn(),
        loading: false,
      });

      const { unmount } = render(
        <MemoryRouter initialEntries={["/"]}>
          <Header />
        </MemoryRouter>,
      );

      const homeLinks = screen.getAllByRole("link", { name: "Home" });
      expect(homeLinks[0]).toHaveAttribute("aria-current", "page");
      expect(screen.getAllByRole("link", { name: "Public Decks" })[0]).not.toHaveAttribute(
        "aria-current",
      );

      unmount();

      render(
        <MemoryRouter initialEntries={["/cards"]}>
          <Header />
        </MemoryRouter>,
      );

      expect(screen.getAllByRole("link", { name: "Home" })[0]).not.toHaveAttribute("aria-current");
    });

    it("should highlight Card Database on both /cards hub and child /cards/:id routes", () => {
      vi.mocked(useAuth).mockReturnValue({
        isAuthenticated: false,
        user: undefined,
        logout: vi.fn(),
        login: vi.fn(),
        register: vi.fn(),
        loading: false,
      });

      const { unmount } = render(
        <MemoryRouter initialEntries={["/cards"]}>
          <Header />
        </MemoryRouter>,
      );

      expect(screen.getAllByRole("link", { name: "Card Database" })[0]).toHaveAttribute(
        "aria-current",
        "page",
      );

      unmount();

      render(
        <MemoryRouter initialEntries={["/cards/46986414"]}>
          <Header />
        </MemoryRouter>,
      );

      expect(screen.getAllByRole("link", { name: "Card Database" })[0]).toHaveAttribute(
        "aria-current",
        "page",
      );
    });

    it("should highlight Public Decks on both /decks hub and child /decks/:id routes", () => {
      vi.mocked(useAuth).mockReturnValue({
        isAuthenticated: false,
        user: undefined,
        logout: vi.fn(),
        login: vi.fn(),
        register: vi.fn(),
        loading: false,
      });

      const { unmount } = render(
        <MemoryRouter initialEntries={["/decks"]}>
          <Header />
        </MemoryRouter>,
      );

      expect(screen.getAllByRole("link", { name: "Public Decks" })[0]).toHaveAttribute(
        "aria-current",
        "page",
      );

      unmount();

      render(
        <MemoryRouter initialEntries={["/decks/42"]}>
          <Header />
        </MemoryRouter>,
      );

      expect(screen.getAllByRole("link", { name: "Public Decks" })[0]).toHaveAttribute(
        "aria-current",
        "page",
      );
    });

    it("should highlight Hand Simulator only on exact /simulator route", () => {
      vi.mocked(useAuth).mockReturnValue({
        isAuthenticated: false,
        user: undefined,
        logout: vi.fn(),
        login: vi.fn(),
        register: vi.fn(),
        loading: false,
      });

      const { unmount } = render(
        <MemoryRouter initialEntries={["/simulator"]}>
          <Header />
        </MemoryRouter>,
      );

      expect(screen.getAllByRole("link", { name: "Hand Simulator" })[0]).toHaveAttribute(
        "aria-current",
        "page",
      );

      unmount();

      render(
        <MemoryRouter initialEntries={["/simulator/subpath"]}>
          <Header />
        </MemoryRouter>,
      );

      expect(screen.getAllByRole("link", { name: "Hand Simulator" })[0]).not.toHaveAttribute(
        "aria-current",
      );
    });

    it("should highlight My Decks only on exact /my-decks route when authenticated", () => {
      vi.mocked(useAuth).mockReturnValue({
        isAuthenticated: true,
        user: { username: "duelist", email: "duelist@example.com" },
        logout: vi.fn(),
        login: vi.fn(),
        register: vi.fn(),
        loading: false,
      });

      const { unmount } = render(
        <MemoryRouter initialEntries={["/my-decks"]}>
          <Header />
        </MemoryRouter>,
      );

      expect(screen.getAllByRole("link", { name: "My Decks" })[0]).toHaveAttribute(
        "aria-current",
        "page",
      );

      unmount();

      render(
        <MemoryRouter initialEntries={["/my-decks/subpath"]}>
          <Header />
        </MemoryRouter>,
      );

      expect(screen.getAllByRole("link", { name: "My Decks" })[0]).not.toHaveAttribute(
        "aria-current",
      );
    });
  });
});
