import { FlaskConical } from "lucide-react";

export default function Header() {
  return (
    <header className="sticky top-0 z-50 bg-dark-bg/85 backdrop-blur-md border-b border-border-dim transition-all duration-200">
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
        <a href="/" className="flex items-center gap-2 no-underline text-white">
          <FlaskConical className="w-6 h-6 text-gold-accent drop-shadow-[0_0_4px_rgba(212,175,55,0.25)]" />
          <span className="font-display text-2xl font-bold tracking-widest text-gold-accent">
            DECKLAB
          </span>
        </a>

        <nav>
          <ul className="hidden md:flex items-center gap-8 list-none">
            <li>
              <a
                href="/"
                className="no-underline text-cyan-accent text-sm font-medium tracking-wide relative py-1 transition-all duration-200 after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-full after:h-0.5 after:bg-cyan-accent"
              >
                Home
              </a>
            </li>
            <li>
              <a
                href="#decks"
                className="no-underline text-text-secondary text-sm font-medium tracking-wide relative py-1 transition-all duration-200 hover:text-cyan-hover after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-cyan-accent hover:after:w-full after:transition-all after:duration-200"
              >
                Decks
              </a>
            </li>
            <li>
              <a
                href="#cards"
                className="no-underline text-text-secondary text-sm font-medium tracking-wide relative py-1 transition-all duration-200 hover:text-cyan-hover after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-cyan-accent hover:after:w-full after:transition-all after:duration-200"
              >
                Cards
              </a>
            </li>
            <li>
              <a
                href="#simulator"
                className="no-underline text-text-secondary text-sm font-medium tracking-wide relative py-1 transition-all duration-200 hover:text-cyan-hover after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-cyan-accent hover:after:w-full after:transition-all after:duration-200"
              >
                Hand Simulator
              </a>
            </li>
          </ul>
        </nav>

        <div>
          <a
            href="#login"
            className="inline-block bg-transparent text-gold-accent border border-gold-accent px-5 py-2 rounded font-sans font-semibold text-xs uppercase tracking-wider cursor-pointer hover:bg-gold-accent hover:text-dark-bg hover:shadow-[0_0_15px_rgba(212,175,55,0.2)] transition-all duration-300 transform hover:-translate-y-0.5 no-underline"
          >
            Login
          </a>
        </div>
      </div>
    </header>
  );
}
