import { Suspense } from "react";
import { Outlet } from "react-router";

import LoadingSpinner from "../../components/feedback/LoadingSpinner";
import Footer from "../../components/layout/Footer";
import Header from "../../components/layout/Header";
import ScrollToTop from "../../components/layout/ScrollToTop";

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
