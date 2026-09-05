import { render, screen, waitFor } from "@testing-library/react";
import type React from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import App from "./App";
import { useAuth } from "./features/auth";

vi.mock("./features/auth/context/AuthContext", () => ({
  useAuth: vi.fn(),
  AuthProvider: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));

vi.mock("./features/cards/pages/Cards", () => ({
  default: () => <div data-testid="cards-page">Cards Page</div>,
}));

vi.mock("./features/cards/pages/CardDetail", () => ({
  default: () => <div data-testid="card-detail-page">Card Detail Page</div>,
}));

vi.mock("./features/decks/pages/Decks", () => ({
  default: ({ initialTab }: { initialTab?: string }) => (
    <div data-testid="decks-page">Decks Page {initialTab ?? "public"}</div>
  ),
}));

vi.mock("./features/decks/pages/DeckDetail", () => ({
  default: () => <div data-testid="deck-detail-page">Deck Detail Page</div>,
}));

vi.mock("./features/deck-builder/pages/DeckBuilder", () => ({
  default: () => <div data-testid="deck-builder-page">Deck Builder Page</div>,
}));

vi.mock("./features/simulator/pages/HandSimulator", () => ({
  default: () => <div data-testid="simulator-page">Simulator Page</div>,
}));

vi.mock("./features/home/pages/Home", () => ({
  default: () => <div data-testid="home-page">Home Page</div>,
}));

vi.mock("./features/auth/pages/Login", () => ({
  default: () => <div data-testid="login-page">Login Page</div>,
}));

vi.mock("./features/auth/pages/Register", () => ({
  default: () => <div data-testid="register-page">Register Page</div>,
}));

vi.mock("./pages/NotFound", () => ({
  default: () => <div data-testid="not-found-page">Not Found Page</div>,
}));

describe("App Route Hierarchy - Deck Routes", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    window.scrollTo = vi.fn();
  });

  describe("when authenticated", () => {
    beforeEach(() => {
      vi.mocked(useAuth).mockReturnValue({
        isAuthenticated: true,
        loading: false,
        user: { username: "duelist", email: "duelist@example.com" },
        accessToken: "fake-jwt",
        login: vi.fn(),
        register: vi.fn(),
        logout: vi.fn(),
      });
    });

    it("renders Decks catalog at /decks", async () => {
      window.history.pushState({}, "", "/decks");
      render(<App />);

      await waitFor(() => {
        expect(screen.getByTestId("decks-page")).toBeInTheDocument();
      });
      expect(screen.getByTestId("decks-page")).toHaveTextContent("Decks Page public");
    });

    it("renders DeckDetail at /decks/:id", async () => {
      window.history.pushState({}, "", "/decks/123");
      render(<App />);

      await waitFor(() => {
        expect(screen.getByTestId("deck-detail-page")).toBeInTheDocument();
      });
    });

    it("renders DeckBuilder at protected route /decks/create", async () => {
      window.history.pushState({}, "", "/decks/create");
      render(<App />);

      await waitFor(() => {
        expect(screen.getByTestId("deck-builder-page")).toBeInTheDocument();
      });
    });

    it("renders DeckBuilder at protected route /decks/:id/edit", async () => {
      window.history.pushState({}, "", "/decks/123/edit");
      render(<App />);

      await waitFor(() => {
        expect(screen.getByTestId("deck-builder-page")).toBeInTheDocument();
      });
    });

    it("renders user decks at protected route /my-decks", async () => {
      window.history.pushState({}, "", "/my-decks");
      render(<App />);

      await waitFor(() => {
        expect(screen.getByTestId("decks-page")).toBeInTheDocument();
      });
      expect(screen.getByTestId("decks-page")).toHaveTextContent("Decks Page user");
    });
  });

  describe("when unauthenticated", () => {
    beforeEach(() => {
      vi.mocked(useAuth).mockReturnValue({
        isAuthenticated: false,
        loading: false,
        user: undefined,
        accessToken: undefined,
        login: vi.fn(),
        register: vi.fn(),
        logout: vi.fn(),
      });
    });

    it("allows public access to /decks catalog", async () => {
      window.history.pushState({}, "", "/decks");
      render(<App />);

      await waitFor(() => {
        expect(screen.getByTestId("decks-page")).toBeInTheDocument();
      });
    });

    it("allows public access to /decks/:id", async () => {
      window.history.pushState({}, "", "/decks/456");
      render(<App />);

      await waitFor(() => {
        expect(screen.getByTestId("deck-detail-page")).toBeInTheDocument();
      });
    });

    it("redirects /decks/create to /login", async () => {
      window.history.pushState({}, "", "/decks/create");
      render(<App />);

      await waitFor(() => {
        expect(screen.getByTestId("login-page")).toBeInTheDocument();
      });
      expect(screen.queryByTestId("deck-builder-page")).not.toBeInTheDocument();
    });

    it("redirects /decks/:id/edit to /login", async () => {
      window.history.pushState({}, "", "/decks/456/edit");
      render(<App />);

      await waitFor(() => {
        expect(screen.getByTestId("login-page")).toBeInTheDocument();
      });
      expect(screen.queryByTestId("deck-builder-page")).not.toBeInTheDocument();
    });

    it("redirects /my-decks to /login", async () => {
      window.history.pushState({}, "", "/my-decks");
      render(<App />);

      await waitFor(() => {
        expect(screen.getByTestId("login-page")).toBeInTheDocument();
      });
      expect(screen.queryByTestId("decks-page")).not.toBeInTheDocument();
    });
  });
});
