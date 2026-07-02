import { render } from "@testing-library/react";
import { useLocation } from "react-router";
import { beforeEach, describe, expect, it, vi } from "vitest";

import ScrollToTop from "./ScrollToTop";

vi.mock("react-router", () => ({
  useLocation: vi.fn(),
}));

describe("ScrollToTop component", () => {
  beforeEach(() => {
    vi.stubGlobal("window", {
      scrollTo: vi.fn(),
    });
  });

  it("should trigger window.scrollTo when pathname changes", () => {
    vi.mocked(useLocation).mockReturnValue({ pathname: "/home" } as any);

    const { rerender } = render(<ScrollToTop />);
    expect(window.scrollTo).toHaveBeenCalledWith(0, 0);

    // change pathname
    vi.mocked(useLocation).mockReturnValue({ pathname: "/about" } as any);
    rerender(<ScrollToTop />);
    expect(window.scrollTo).toHaveBeenCalledTimes(2);
  });
});
