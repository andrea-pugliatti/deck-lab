import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter, useNavigate } from "react-router";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { useAuth } from "../context/AuthContext";
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
    vi.mocked(useAuth).mockReturnValue({ login: loginMock } as any);
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

  it("should handle successful submission and navigate", async () => {
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
      expect(navigateMock).toHaveBeenCalledWith("/decks");
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
