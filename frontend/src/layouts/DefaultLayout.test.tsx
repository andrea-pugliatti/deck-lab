import { render, screen } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router";
import { describe, expect, it, vi } from "vitest";

import DefaultLayout from "./DefaultLayout";

vi.mock("../components/Header", () => ({
  default: () => <div data-testid="mock-header">Header</div>,
}));

vi.mock("../components/Footer", () => ({
  default: () => <div data-testid="mock-footer">Footer</div>,
}));

vi.mock("../components/ScrollToTop", () => ({
  default: () => null,
}));

describe("DefaultLayout component", () => {
  it("should render mock header, outlet content, and mock footer", () => {
    render(
      <MemoryRouter initialEntries={["/"]}>
        <Routes>
          <Route path="/" element={<DefaultLayout />}>
            <Route index element={<div data-testid="page-content">Home Content</div>} />
          </Route>
        </Routes>
      </MemoryRouter>,
    );

    expect(screen.getByTestId("mock-header")).toBeInTheDocument();
    expect(screen.getByTestId("page-content")).toHaveTextContent("Home Content");
    expect(screen.getByTestId("mock-footer")).toBeInTheDocument();
  });
});
