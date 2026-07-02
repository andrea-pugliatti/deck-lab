import { useEffect } from "react";
import { useLocation } from "react-router";

/**
 * A utility component that scrolls the window viewport back to the top (0, 0)
 * whenever the application's URL pathname changes.
 *
 * Renders nothing (`null`). Place it inside the router layout tree.
 */
export default function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}
