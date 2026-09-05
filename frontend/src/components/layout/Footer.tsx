import { Link } from "react-router";

interface FooterNavLink {
  to: string;
  label: string;
}

const NAV_LINKS: FooterNavLink[] = [
  { to: "/", label: "Home" },
  { to: "/decks", label: "Public Decks" },
  { to: "/cards", label: "Card Database" },
  { to: "/simulator", label: "Hand Simulator" },
];

/**
 * Footer component displayed at the bottom of pages.
 * Renders logo, navigation links, copyright info, and legal disclaimer.
 */
export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-dark-surface/30 border-border-dim mt-16 border-t py-12 text-slate-500">
      <div className="mx-auto mb-8 grid max-w-7xl grid-cols-1 gap-8 px-6 md:grid-cols-4">
        <div className="md:col-span-2">
          <Link
            to="/"
            viewTransition
            className="focus-visible:ring-cyan-accent mb-4 flex items-center gap-2 rounded text-white no-underline focus-visible:ring-2 focus-visible:outline-hidden"
          >
            <img src="/logo.webp" className="h-20 w-20 rounded-full" alt="DeckLab Logo" />
            <span className="font-display text-gold-accent text-4xl font-bold tracking-wide">
              DeckLab
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
                  className="hover:text-cyan-hover focus-visible:ring-cyan-accent rounded transition-colors duration-200 focus-visible:ring-2 focus-visible:outline-hidden"
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
          <button
            type="button"
            onClick={() => alert("Privacy policy is coming soon.")}
            className="hover:text-cyan-hover focus-visible:ring-cyan-accent cursor-pointer rounded border-none bg-transparent p-0 text-slate-500 transition-colors duration-200 focus-visible:ring-2 focus-visible:outline-hidden"
          >
            Privacy Policy
          </button>
          <button
            type="button"
            onClick={() => alert("Terms of service are coming soon.")}
            className="hover:text-cyan-hover focus-visible:ring-cyan-accent cursor-pointer rounded border-none bg-transparent p-0 text-slate-500 transition-colors duration-200 focus-visible:ring-2 focus-visible:outline-hidden"
          >
            Terms of Service
          </button>
        </div>
      </div>
    </footer>
  );
}
