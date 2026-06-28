import { Link, Outlet } from "react-router";

export default function AuthLayout() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-dark-bg px-6 py-12">
      <div className="max-w-md w-full flex flex-col items-center">
        {/* Brand Header */}
        <Link to="/" className="flex items-center gap-2 no-underline text-white mb-8">
          <img src="/logo.webp" className="w-20 h-20 rounded-full" alt="DeckLab Logo" />
          <span className="font-display text-4xl font-bold tracking-widest text-gold-accent">
            DECKLAB
          </span>
        </Link>

        {/* Credentials Form Box */}
        <div className="w-full bg-dark-surface border border-border-dim rounded-lg p-8 shadow-xl">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
