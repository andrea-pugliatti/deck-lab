import { Link } from "react-router";

const NAV_LINKS = [
  { to: "/", label: "Home", end: true },
  { to: "/decks", label: "Public Decks" },
  { to: "/cards", label: "Card Database" },
  { to: "/simulator", label: "Hand Simulator" },
];

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-dark-surface/30 border-t border-border-dim text-slate-500 py-12 mt-16">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
        <div className="md:col-span-2">
          <Link to="/" className="flex items-center gap-2 no-underline text-white mb-4">
            <img src="/logo.webp" className="w-20 h-20 rounded-full" alt="DeckLab Logo" />
            <span className="font-display text-4xl font-bold tracking-widest text-gold-accent">
              DECKLAB
            </span>
          </Link>
          <p className="text-sm text-slate-400 max-w-sm">
            Construct, analyze, and simulate Yu-Gi-Oh! decks with advanced analytics and
            state-of-the-art dueling simulator. Built by duelists, for duelists.
          </p>
        </div>

        <div>
          <h4 className="text-xs font-semibold text-white uppercase tracking-wider mb-4">
            Navigation
          </h4>
          <ul className="space-y-2 list-none p-0 text-sm">
            {NAV_LINKS.map((link) => (
              <li key={link.to}>
                <Link
                  to={link.to}
                  className="hover:text-cyan-hover transition-colors duration-200"
                  viewTransition
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="text-xs font-semibold text-white uppercase tracking-wider mb-4">
            Legal & Info
          </h4>
          <p className="text-xs text-slate-500 leading-relaxed">
            This project is an unofficial fan-made simulator. All card art, descriptions, and
            related assets are property of Konami Digital Entertainment and/or Shueisha.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 pt-6 border-t border-border-dim/50 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs">
        <p>&copy; {currentYear} DeckLab. All rights reserved.</p>
        <div className="flex gap-4">
          <a href="#privacy" className="hover:text-cyan-hover transition-colors duration-200">
            Privacy Policy
          </a>
          <a href="#terms" className="hover:text-cyan-hover transition-colors duration-200">
            Terms of Service
          </a>
        </div>
      </div>
    </footer>
  );
}
