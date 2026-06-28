import { Menu, X } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, NavLink } from "react-router";
import { useAuth } from "../context/AuthContext";
import Button, { getButtonClasses } from "./ui/Button";

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
    <header className="fixed min-w-full top-0 z-50 bg-dark-bg/85 backdrop-blur-md border-b border-b-border-dim transition-all duration-200">
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center relative">
        <Link to="/" viewTransition className="flex items-center gap-2 no-underline text-white">
          <img src="/logo.webp" className="w-12 h-12 rounded-full" alt="DeckLab Logo" />
          <span className="font-display text-2xl font-bold tracking-widest text-gold-accent">
            DECKLAB
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:block">
          <ul className="flex items-center gap-8 list-none m-0 p-0">
            {NAV_LINKS.map((link) => (
              <li key={link.to}>
                <NavLink to={link.to} end={link.end} className={linkClass} viewTransition>
                  {link.label}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>

        <div className="hidden md:flex items-center gap-4">
          {isAuthenticated && user ? (
            <div className="flex items-center gap-4">
              <NavLink to="/my-decks" className={linkClass} viewTransition>
                My Decks
              </NavLink>
              <span className="w-px h-4 bg-border-dim"></span>
              <span className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
                {user.username}
              </span>
              <Button
                variant="outline-red"
                size="sm"
                onClick={logout}
                className="uppercase tracking-wider font-sans font-semibold"
              >
                Logout
              </Button>
            </div>
          ) : (
            <Link
              to="/login"
              viewTransition
              className={`${getButtonClasses({ variant: "outline-gold", size: "md" })} uppercase tracking-wider font-sans`}
            >
              Login
            </Link>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="md:hidden text-slate-400 hover:text-white p-2 rounded-lg transition-colors cursor-pointer bg-dark-surface-elevated/40 border border-border-dim/40"
          type="button"
          aria-label="Toggle Navigation Menu"
          aria-expanded={isMobileMenuOpen}
          aria-controls="mobile-nav-menu"
        >
          {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div
            id="mobile-nav-menu"
            className="absolute top-full left-0 right-0 z-50 bg-dark-bg/95 backdrop-blur-lg border-b border-border-dim shadow-2xl p-6 md:hidden animate-in slide-in-from-top-4 duration-200"
          >
            <nav className="mb-6">
              <ul className="flex flex-col gap-2.5 list-none m-0 p-0">
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

            <div className="pt-4 border-t border-border-dim/60">
              {isAuthenticated && user ? (
                <div className="flex justify-between items-center gap-4">
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                    {user.username}
                  </span>
                  <Button
                    variant="outline-red"
                    size="sm"
                    onClick={() => {
                      logout();
                      setIsMobileMenuOpen(false);
                    }}
                    className="uppercase tracking-wider font-sans font-semibold"
                  >
                    Logout
                  </Button>
                </div>
              ) : (
                <Link
                  to="/login"
                  onClick={() => setIsMobileMenuOpen(false)}
                  viewTransition
                  className={`${getButtonClasses({ variant: "outline-gold", size: "md" })} uppercase tracking-wider font-sans w-full`}
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
