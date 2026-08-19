import { Suspense } from "react";
import { Outlet } from "react-router";

import Footer from "../components/Footer";
import Header from "../components/Header";
import LoadingSpinner from "../components/LoadingSpinner";
import ScrollToTop from "../components/ScrollToTop";

/**
 * DefaultLayout component.
 * Main layout wrapper for the application's standard pages.
 * Integrates the {@link Header}, {@link Footer}, a container for nested page views via {@link Outlet},
 * and a {@link ScrollToTop} trigger for seamless page transitions.
 *
 * @returns A JSX element containing the standard application layout structure.
 */
export default function DefaultLayout() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        <Suspense fallback={<LoadingSpinner size="lg" className="min-h-[50vh]" />}>
          <Outlet />
        </Suspense>
      </main>
      <ScrollToTop />
      <Footer />
    </div>
  );
}
