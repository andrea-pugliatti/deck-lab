import { Link, Outlet } from "react-router";

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
    <div className="bg-dark-bg flex min-h-screen flex-col items-center justify-center px-6 py-12">
      <div className="flex w-full max-w-md flex-col items-center">
        {/* Brand Header */}
        <Link to="/" className="mb-8 flex items-center gap-2 text-white no-underline">
          <img src="/logo.webp" className="h-20 w-20 rounded-full" alt="DeckLab Logo" />
          <span className="font-display text-gold-accent text-4xl font-bold tracking-widest">
            DECKLAB
          </span>
        </Link>

        {/* Credentials Form Box */}
        <div className="bg-dark-surface border-border-dim w-full rounded-lg border p-8 shadow-xl">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
