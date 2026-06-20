import { Outlet, Link } from "react-router";
import { FlaskConical } from "lucide-react";

export default function AuthLayout() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-dark-bg px-6 py-12">
      <div className="max-w-md w-full flex flex-col items-center">
        {/* Brand Header */}
        <Link to="/" className="flex items-center gap-2 no-underline text-white mb-8">
          <FlaskConical className="w-8 h-8 text-gold-accent drop-shadow-[0_0_4px_rgba(212,175,55,0.25)]" />
          <span className="font-display text-3xl font-bold tracking-widest text-gold-accent">
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
