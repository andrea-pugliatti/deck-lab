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
    <footer className="bg-dark-surface/30 border-border-dim mt-16 border-t py-12 text-slate-500">
      <div className="mx-auto mb-8 grid max-w-7xl grid-cols-1 gap-8 px-6 md:grid-cols-4">
        <div className="md:col-span-2">
          <Link to="/" className="mb-4 flex items-center gap-2 text-white no-underline">
            <img src="/logo.webp" className="h-20 w-20 rounded-full" alt="DeckLab Logo" />
            <span className="font-display text-gold-accent text-4xl font-bold tracking-widest">
              DECKLAB
            </span>
          </Link>
          <p className="max-w-sm text-sm text-slate-400">
            Construct, analyze, and simulate Yu-Gi-Oh! decks with advanced analytics and
            state-of-the-art dueling simulator. Built by duelists, for duelists.
          </p>
        </div>

        <div>
          <h4 className="mb-4 text-xs font-semibold tracking-wider text-white uppercase">
            Navigation
          </h4>
          <ul className="list-none space-y-2 p-0 text-sm">
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
          <h4 className="mb-4 text-xs font-semibold tracking-wider text-white uppercase">
            Legal & Info
          </h4>
          <p className="text-xs leading-relaxed text-slate-500">
            This project is an unofficial fan-made simulator. All card art, descriptions, and
            related assets are property of Konami Digital Entertainment and/or Shueisha.
          </p>
        </div>
      </div>

      <div className="border-border-dim/50 mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 border-t px-6 pt-6 text-xs sm:flex-row">
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
