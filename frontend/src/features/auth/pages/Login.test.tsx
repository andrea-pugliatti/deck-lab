import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter, useNavigate } from "react-router";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { useAuth } from "../../../features/auth";
import Login from "./Login";

vi.mock("../context/AuthContext", () => ({
  useAuth: vi.fn(),
}));

vi.mock("react-router", async (importOriginal) => {
  const actual = await importOriginal<typeof import("react-router")>();
  return {
    ...actual,
    useNavigate: vi.fn(),
  };
});

describe("Login page component", () => {
  const loginMock = vi.fn();
  const navigateMock = vi.fn();

  beforeEach(() => {
    loginMock.mockReset();
    navigateMock.mockReset();
    vi.mocked(useAuth).mockReturnValue({ login: loginMock } as unknown as ReturnType<
      typeof useAuth
    >);
    vi.mocked(useNavigate).mockReturnValue(navigateMock);
  });

  it("should render username and password fields", () => {
    render(
      <MemoryRouter>
        <Login />
      </MemoryRouter>,
    );

    expect(screen.getByPlaceholderText(/e.g. SetoKaiba/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText("••••••••")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Enter the Lab" })).toBeInTheDocument();
  });

  it("should handle successful submission and navigate to /decks by default", async () => {
    loginMock.mockResolvedValueOnce(undefined);

    render(
      <MemoryRouter>
        <Login />
      </MemoryRouter>,
    );

    fireEvent.change(screen.getByPlaceholderText(/e.g. SetoKaiba/i), {
      target: { value: "kaiba" },
    });
    fireEvent.change(screen.getByPlaceholderText("••••••••"), {
      target: { value: "rules" },
    });
    fireEvent.click(screen.getByRole("button", { name: "Enter the Lab" }));

    expect(loginMock).toHaveBeenCalledWith("kaiba", "rules");
    await waitFor(() => {
      expect(navigateMock).toHaveBeenCalledWith("/decks", {
        replace: true,
        viewTransition: true,
      });
    });
  });

  it("should redirect to location.state.from when redirected from a protected route", async () => {
    loginMock.mockResolvedValueOnce(undefined);

    render(
      <MemoryRouter
        initialEntries={[
          {
            pathname: "/login",
            state: { from: { pathname: "/decks/create", search: "?format=Goat" } },
          },
        ]}
      >
        <Login />
      </MemoryRouter>,
    );

    fireEvent.change(screen.getByPlaceholderText(/e.g. SetoKaiba/i), {
      target: { value: "kaiba" },
    });
    fireEvent.change(screen.getByPlaceholderText("••••••••"), {
      target: { value: "rules" },
    });
    fireEvent.click(screen.getByRole("button", { name: "Enter the Lab" }));

    expect(loginMock).toHaveBeenCalledWith("kaiba", "rules");
    await waitFor(() => {
      expect(navigateMock).toHaveBeenCalledWith("/decks/create?format=Goat", {
        replace: true,
        viewTransition: true,
      });
    });
  });

  it("should render error message when login fails", async () => {
    loginMock.mockRejectedValueOnce(new Error("Incorrect password"));

    render(
      <MemoryRouter>
        <Login />
      </MemoryRouter>,
    );

    fireEvent.change(screen.getByPlaceholderText(/e.g. SetoKaiba/i), {
      target: { value: "kaiba" },
    });
    fireEvent.change(screen.getByPlaceholderText("••••••••"), {
      target: { value: "wrong" },
    });
    fireEvent.click(screen.getByRole("button", { name: "Enter the Lab" }));

    await waitFor(() => {
      expect(screen.getByText("Incorrect password")).toBeInTheDocument();
    });
    expect(navigateMock).not.toHaveBeenCalled();
  });
});
