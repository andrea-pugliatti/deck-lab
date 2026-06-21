import { FlaskConical } from "lucide-react";
import { NavLink, Link } from "react-router";
import { useAuth } from "../context/AuthContext";

export default function Header() {
  const { isAuthenticated, user, logout } = useAuth();
  const linkClass = ({ isActive }: { isActive: boolean }) =>
    `no-underline text-sm font-medium tracking-wide relative py-1 transition-all duration-200 after:content-[''] after:absolute after:bottom-0 after:left-0 after:h-[2px] after:bg-cyan-accent ${
      isActive
        ? "text-cyan-accent after:w-full"
        : "text-slate-400 hover:text-cyan-hover after:w-0 hover:after:w-full after:transition-all after:duration-200"
    }`;

  return (
    <header className="sticky top-0 z-50 bg-dark-bg/85 backdrop-blur-md border-b border-b-border-dim transition-all duration-200">
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
        <Link to="/" className="flex items-center gap-2 no-underline text-white">
          <FlaskConical className="w-6 h-6 text-gold-accent drop-shadow-[0_0_4px_rgba(212,175,55,0.25)]" />
          <span className="font-display text-2xl font-bold tracking-widest text-gold-accent">
            DECKLAB
          </span>
        </Link>

        <nav>
          <ul className="hidden md:flex items-center gap-8 list-none m-0 p-0">
            <li>
              <NavLink to="/" end className={linkClass}>
                Home
              </NavLink>
            </li>
            <li>
              <NavLink to="/decks" className={linkClass}>
                Decks
              </NavLink>
            </li>
            <li>
              <NavLink to="/cards" className={linkClass}>
                Cards
              </NavLink>
            </li>
            <li>
              <a
                href="#simulator"
                className="no-underline text-sm font-medium tracking-wide relative py-1 text-slate-400 hover:text-cyan-hover transition-all duration-200"
              >
                Hand Simulator
              </a>
            </li>
          </ul>
        </nav>

        <div className="flex items-center gap-4">
          {isAuthenticated && user ? (
            <div className="flex items-center gap-4">
              <NavLink to="/my-decks" className={linkClass}>
                My Decks
              </NavLink>
              <span className="w-px h-4 bg-border-dim"></span>
              <span className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
                {user.username}
              </span>
              <button
                onClick={logout}
                className="bg-transparent text-red-400 hover:text-red-300 border border-red-500/30 hover:border-red-500/60 px-4 py-1.5 rounded font-sans font-semibold text-[10px] uppercase tracking-wider cursor-pointer"
              >
                Logout
              </button>
            </div>
          ) : (
            <Link
              to="/login"
              className="inline-block bg-transparent text-gold-accent border border-gold-accent px-5 py-2 rounded font-sans font-semibold text-xs uppercase tracking-wider cursor-pointer hover:bg-gold-accent hover:text-dark-bg hover:shadow-[0_0_15px_rgba(212,175,55,0.2)] no-underline"
            >
              Login
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
