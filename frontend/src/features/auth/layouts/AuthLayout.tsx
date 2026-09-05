import { Suspense } from "react";
import { Link, Outlet } from "react-router";

import LoadingSpinner from "../../../components/feedback/LoadingSpinner";

/**
 * AuthLayout component.
 * Layout wrapper for authentication routes (e.g. Login, Register).
 * Renders a centered layout containing the brand header logo and a card container
 * holding the route's nested {@link Outlet} content.
 *
 * @returns A JSX element wrapping the authentication page layout.
 */
export default function AuthLayout() {
  return (
    <div className="bg-dark-bg flex min-h-screen flex-col items-center justify-center px-4 py-8 sm:px-6 sm:py-12">
      <div className="flex w-full max-w-md flex-col items-center">
        {/* Brand Header */}
        <Link to="/" className="mb-8 flex items-center gap-2 text-white no-underline">
          <img src="/logo.webp" className="size-20 rounded-full" alt="DeckLab Logo" />
          <span className="font-display text-gold-accent text-4xl font-bold tracking-widest">
            DECKLAB
          </span>
        </Link>

        {/* Credentials Form Box */}
        <div className="bg-dark-surface border-border-dim w-full rounded-lg border p-6 shadow-xl sm:p-8">
          <Suspense fallback={<LoadingSpinner size="md" className="py-8" />}>
            <Outlet />
          </Suspense>
        </div>
      </div>
    </div>
  );
}
