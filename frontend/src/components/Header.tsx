import { Menu, X } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, NavLink } from "react-router";

import { useAuth } from "../context/AuthContext";
import Button, { getButtonClasses } from "./ui/Button";

/**
 * Representation of a single navigation link item.
 */
interface NavLinkItem {
  to: string;
  label: string;
  end?: boolean;
}

const NAV_LINKS: NavLinkItem[] = [
  { to: "/", label: "Home", end: true },
  { to: "/decks", label: "Public Decks" },
  { to: "/cards", label: "Card Database" },
  { to: "/simulator", label: "Hand Simulator" },
];

const linkClass = ({ isActive }: { isActive: boolean }) =>
  `no-underline text-sm font-medium tracking-wide relative py-1 transition-all duration-200 after:content-[''] after:absolute after:bottom-0 after:left-0 after:h-0.5 after:bg-cyan-accent ${
    isActive
      ? "text-cyan-accent after:w-full"
      : "text-slate-400 hover:text-cyan-hover after:w-0 hover:after:w-full after:transition-all after:duration-200"
  }`;

const mobileLinkClass = ({ isActive }: { isActive: boolean }) =>
  `no-underline text-base font-semibold tracking-wide block py-2 transition-all duration-200 ${
    isActive ? "text-cyan-accent" : "text-slate-300 hover:text-cyan-hover"
  }`;

/**
 * Header navigation bar component.
 * Displays navigation links, branding/logo, authentication status (Login/Logout buttons, user info),
 * and dynamic responsive mobile hamburger menu.
 */
export default function Header() {
  const { isAuthenticated, user, logout } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Auto-close mobile menu if user resizes browser to desktop view
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setIsMobileMenuOpen(false);
      }
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <header className="bg-dark-bg/85 border-b-border-dim fixed top-0 z-50 min-w-full border-b backdrop-blur-md transition-all duration-200">
      <div className="relative mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <Link to="/" viewTransition className="flex items-center gap-2 text-white no-underline">
          <img src="/logo.webp" className="h-12 w-12 rounded-full" alt="DeckLab Logo" />
          <span className="font-display text-gold-accent text-2xl font-bold tracking-widest">
            DECKLAB
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:block">
          <ul className="m-0 flex list-none items-center gap-8 p-0">
            {NAV_LINKS.map((link) => (
              <li key={link.to}>
                <NavLink to={link.to} end={link.end} className={linkClass} viewTransition>
                  {link.label}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>

        <div className="hidden items-center gap-4 md:flex">
          {isAuthenticated && user ? (
            <div className="flex items-center gap-4">
              <NavLink to="/my-decks" className={linkClass} viewTransition>
                My Decks
              </NavLink>
              <span className="bg-border-dim h-4 w-px"></span>
              <span className="text-xs font-semibold tracking-wider text-slate-300 uppercase">
                {user.username}
              </span>
              <Button
                variant="outline-red"
                size="sm"
                onClick={logout}
                className="font-sans font-semibold tracking-wider uppercase"
              >
                Logout
              </Button>
            </div>
          ) : (
            <Link
              to="/login"
              viewTransition
              className={`${getButtonClasses({ variant: "outline-gold", size: "md" })} font-sans tracking-wider uppercase`}
            >
              Login
            </Link>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="bg-dark-surface-elevated/40 border-border-dim/40 cursor-pointer rounded-lg border p-2 text-slate-400 transition-colors hover:text-white md:hidden"
          type="button"
          aria-label="Toggle Navigation Menu"
          aria-expanded={isMobileMenuOpen}
          aria-controls="mobile-nav-menu"
        >
          {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div
            id="mobile-nav-menu"
            className="bg-dark-bg/95 border-border-dim animate-in slide-in-from-top-4 absolute top-full right-0 left-0 z-50 border-b p-6 shadow-2xl backdrop-blur-lg duration-200 md:hidden"
          >
            <nav className="mb-6">
              <ul className="m-0 flex list-none flex-col gap-2.5 p-0">
                {NAV_LINKS.map((link) => (
                  <li key={link.to}>
                    <NavLink
                      to={link.to}
                      end={link.end}
                      className={mobileLinkClass}
                      onClick={() => setIsMobileMenuOpen(false)}
                      viewTransition
                    >
                      {link.label}
                    </NavLink>
                  </li>
                ))}
                {isAuthenticated && user && (
                  <li>
                    <NavLink
                      to="/my-decks"
                      className={mobileLinkClass}
                      onClick={() => setIsMobileMenuOpen(false)}
                      viewTransition
                    >
                      My Decks
                    </NavLink>
                  </li>
                )}
              </ul>
            </nav>

            <div className="border-border-dim/60 border-t pt-4">
              {isAuthenticated && user ? (
                <div className="flex items-center justify-between gap-4">
                  <span className="text-xs font-bold tracking-wider text-slate-400 uppercase">
                    {user.username}
                  </span>
                  <Button
                    variant="outline-red"
                    size="sm"
                    onClick={() => {
                      logout();
                      setIsMobileMenuOpen(false);
                    }}
                    className="font-sans font-semibold tracking-wider uppercase"
                  >
                    Logout
                  </Button>
                </div>
              ) : (
                <Link
                  to="/login"
                  onClick={() => setIsMobileMenuOpen(false)}
                  viewTransition
                  className={`${getButtonClasses({ variant: "outline-gold", size: "md" })} w-full font-sans tracking-wider uppercase`}
                >
                  Login / Register
                </Link>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
