import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter, useNavigate } from "react-router";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { useAuth } from "../context/AuthContext";
import Register from "./Register";

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

describe("Register page component", () => {
  const registerMock = vi.fn();
  const navigateMock = vi.fn();

  beforeEach(() => {
    registerMock.mockReset();
    navigateMock.mockReset();
    vi.mocked(useAuth).mockReturnValue({ register: registerMock } as any);
    vi.mocked(useNavigate).mockReturnValue(navigateMock);
  });

  it("should render registration fields", () => {
    render(
      <MemoryRouter>
        <Register />
      </MemoryRouter>,
    );

    expect(screen.getByPlaceholderText(/e.g. SetoKaiba/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/e.g. kaiba@corp.com/i)).toBeInTheDocument();
    expect(screen.getAllByPlaceholderText("••••••••")).toHaveLength(2);
  });

  it("should block submission if passwords do not match", async () => {
    render(
      <MemoryRouter>
        <Register />
      </MemoryRouter>,
    );

    fireEvent.change(screen.getByPlaceholderText(/e.g. SetoKaiba/i), { target: { value: "yugi" } });
    fireEvent.change(screen.getByPlaceholderText(/e.g. kaiba@corp.com/i), {
      target: { value: "yugi@mutou.com" },
    });
    const pwInputs = screen.getAllByPlaceholderText("••••••••");
    fireEvent.change(pwInputs[0], { target: { value: "pass1" } });
    fireEvent.change(pwInputs[1], { target: { value: "pass2" } });

    fireEvent.click(screen.getByRole("button", { name: "Create Account" }));

    expect(screen.getByText("Passwords do not match")).toBeInTheDocument();
    expect(registerMock).not.toHaveBeenCalled();
  });

  it("should call register and navigate on success", async () => {
    registerMock.mockResolvedValueOnce(undefined);

    render(
      <MemoryRouter>
        <Register />
      </MemoryRouter>,
    );

    fireEvent.change(screen.getByPlaceholderText(/e.g. SetoKaiba/i), { target: { value: "yugi" } });
    fireEvent.change(screen.getByPlaceholderText(/e.g. kaiba@corp.com/i), {
      target: { value: "yugi@mutou.com" },
    });
    const pwInputs = screen.getAllByPlaceholderText("••••••••");
    fireEvent.change(pwInputs[0], { target: { value: "pass1" } });
    fireEvent.change(pwInputs[1], { target: { value: "pass1" } });

    fireEvent.click(screen.getByRole("button", { name: "Create Account" }));

    expect(registerMock).toHaveBeenCalledWith("yugi", "yugi@mutou.com", "pass1");
    await waitFor(() => {
      expect(navigateMock).toHaveBeenCalledWith("/decks");
    });
  });
});
