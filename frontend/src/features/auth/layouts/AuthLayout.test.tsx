import { render, screen } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router";
import { describe, expect, it } from "vitest";

import AuthLayout from "./AuthLayout";

describe("AuthLayout component", () => {
  it("should render brand header and child outlets", () => {
    render(
      <MemoryRouter initialEntries={["/auth/login"]}>
        <Routes>
          <Route path="/auth" element={<AuthLayout />}>
            <Route path="login" element={<div data-testid="child">Login Credentials Form</div>} />
          </Route>
        </Routes>
      </MemoryRouter>,
    );

    expect(screen.getByText("DECKLAB")).toBeInTheDocument();
    expect(screen.getByTestId("child")).toHaveTextContent("Login Credentials Form");
  });
});
