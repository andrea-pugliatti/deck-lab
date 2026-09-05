import { fireEvent, render, screen } from "@testing-library/react";
import { MemoryRouter, useSearchParams } from "react-router";
import { beforeEach, describe, expect, it, vi } from "vitest";

import Pagination from "./Pagination";

vi.mock("react-router", async (importOriginal) => {
  const actual = await importOriginal<typeof import("react-router")>();
  return {
    ...actual,
    useSearchParams: vi.fn(),
  };
});

describe("Pagination component", () => {
  const setSearchParamsMock = vi.fn();

  beforeEach(() => {
    setSearchParamsMock.mockReset();
    vi.mocked(useSearchParams).mockReturnValue([new URLSearchParams(), setSearchParamsMock]);
  });

  describe("Link-based pagination (default mode)", () => {
    it("should render nav element and page description details", () => {
      render(
        <MemoryRouter>
          <Pagination page={0} totalPages={10} />
        </MemoryRouter>,
      );

      expect(screen.getByRole("navigation", { name: "Pagination" })).toBeInTheDocument();
      expect(screen.getByText("Page 1 of 10")).toBeInTheDocument();
    });

    it("should render disabled previous span and enabled next link on first page", () => {
      render(
        <MemoryRouter>
          <Pagination page={0} totalPages={5} />
        </MemoryRouter>,
      );

      const prevDisabled = screen.getByLabelText("Previous page (disabled)");
      expect(prevDisabled).toHaveAttribute("aria-disabled", "true");

      const nextLink = screen.getByRole("link", { name: "Next page" });
      expect(nextLink).toHaveAttribute("href", "/?page=1");
    });

    it("should render both links when on a middle page and preserve existing search params", () => {
      const initialParams = new URLSearchParams({ q: "dragon", type: "Monster" });
      vi.mocked(useSearchParams).mockReturnValue([initialParams, setSearchParamsMock]);

      render(
        <MemoryRouter>
          <Pagination page={2} totalPages={5} />
        </MemoryRouter>,
      );

      const prevLink = screen.getByRole("link", { name: "Previous page" });
      expect(prevLink).toHaveAttribute("href", "/?q=dragon&type=Monster&page=1");

      const nextLink = screen.getByRole("link", { name: "Next page" });
      expect(nextLink).toHaveAttribute("href", "/?q=dragon&type=Monster&page=3");
    });

    it("should remove page parameter when previous link leads to page 0", () => {
      const initialParams = new URLSearchParams({ q: "dragon", page: "1" });
      vi.mocked(useSearchParams).mockReturnValue([initialParams, setSearchParamsMock]);

      render(
        <MemoryRouter>
          <Pagination page={1} totalPages={5} />
        </MemoryRouter>,
      );

      const prevLink = screen.getByRole("link", { name: "Previous page" });
      expect(prevLink).toHaveAttribute("href", "/?q=dragon");
    });

    it("should return clean url with no trailing question mark when navigating to page 0 with no remaining params", () => {
      const initialParams = new URLSearchParams({ page: "1" });
      vi.mocked(useSearchParams).mockReturnValue([initialParams, setSearchParamsMock]);

      render(
        <MemoryRouter>
          <Pagination page={1} totalPages={5} />
        </MemoryRouter>,
      );

      const prevLink = screen.getByRole("link", { name: "Previous page" });
      expect(prevLink).toHaveAttribute("href", "/");
    });

    it("should render disabled next span on last page", () => {
      render(
        <MemoryRouter>
          <Pagination page={4} totalPages={5} />
        </MemoryRouter>,
      );

      const nextDisabled = screen.getByLabelText("Next page (disabled)");
      expect(nextDisabled).toHaveAttribute("aria-disabled", "true");

      const prevLink = screen.getByRole("link", { name: "Previous page" });
      expect(prevLink).toHaveAttribute("href", "/?page=3");
    });

    it("should use custom getPageUrl when provided", () => {
      const customGetUrl = vi.fn((p: number) => `/custom/route?p=${p}`);

      render(
        <MemoryRouter>
          <Pagination page={1} totalPages={3} getPageUrl={customGetUrl} />
        </MemoryRouter>,
      );

      const prevLink = screen.getByRole("link", { name: "Previous page" });
      const nextLink = screen.getByRole("link", { name: "Next page" });

      expect(prevLink).toHaveAttribute("href", "/custom/route?p=0");
      expect(nextLink).toHaveAttribute("href", "/custom/route?p=2");
    });

    it("should return null when totalPages is 0", () => {
      const { container } = render(
        <MemoryRouter>
          <Pagination page={0} totalPages={0} />
        </MemoryRouter>,
      );

      expect(container).toBeEmptyDOMElement();
    });
  });

  describe("Button-based pagination (when onPageChange is provided without getPageUrl)", () => {
    it("should disable previous button on first page and call onPageChange on next click", () => {
      const handlePageChange = vi.fn();
      render(
        <MemoryRouter>
          <Pagination page={0} totalPages={5} onPageChange={handlePageChange} />
        </MemoryRouter>,
      );

      const prevBtn = screen.getByRole("button", { name: "Previous page" });
      const nextBtn = screen.getByRole("button", { name: "Next page" });

      expect(prevBtn).toBeDisabled();
      expect(nextBtn).not.toBeDisabled();

      fireEvent.click(nextBtn);
      expect(handlePageChange).toHaveBeenCalledWith(1);
    });

    it("should disable next button on last page and call onPageChange on previous click", () => {
      const handlePageChange = vi.fn();
      render(
        <MemoryRouter>
          <Pagination page={4} totalPages={5} onPageChange={handlePageChange} />
        </MemoryRouter>,
      );

      const prevBtn = screen.getByRole("button", { name: "Previous page" });
      const nextBtn = screen.getByRole("button", { name: "Next page" });

      expect(prevBtn).not.toBeDisabled();
      expect(nextBtn).toBeDisabled();

      fireEvent.click(prevBtn);
      expect(handlePageChange).toHaveBeenCalledWith(3);
    });
  });
});
