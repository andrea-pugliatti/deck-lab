import { render } from "@testing-library/react";
import { useLocation } from "react-router";
import { beforeEach, describe, expect, it, vi } from "vitest";

import ScrollToTop from "./ScrollToTop";

vi.mock("react-router", () => ({
  useLocation: vi.fn(),
}));

describe("ScrollToTop component", () => {
  let scrollToSpy: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    scrollToSpy = vi.fn();
    window.scrollTo = scrollToSpy as unknown as typeof window.scrollTo;
  });

  it("should trigger window.scrollTo when pathname changes", () => {
    vi.mocked(useLocation).mockReturnValue({ pathname: "/home" } as unknown as ReturnType<
      typeof useLocation
    >);

    const { rerender } = render(<ScrollToTop />);
    expect(window.scrollTo).toHaveBeenCalledWith(0, 0);

    // change pathname
    vi.mocked(useLocation).mockReturnValue({ pathname: "/about" } as unknown as ReturnType<
      typeof useLocation
    >);
    rerender(<ScrollToTop />);
    expect(window.scrollTo).toHaveBeenCalledTimes(2);
  });
});
