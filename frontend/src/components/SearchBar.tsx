import { Search } from "lucide-react";

export default function SearchBar() {
  return (
    <div className="w-full max-w-2xl mx-auto relative z-10">
      <div className="group relative flex items-center bg-dark-surface border border-border-dim rounded-lg px-5 transition-all duration-300 shadow-md hover:border-border-glow focus-within:border-cyan-accent focus-within:ring-4 focus-within:ring-cyan-accent/15 focus-within:bg-dark-surface-elevated">
        <Search className="w-5 h-5 text-text-muted shrink-0 mr-3 transition-colors duration-200 group-focus-within:text-cyan-accent" />
        <input
          type="text"
          className="w-full h-13 bg-transparent border-none outline-none text-white font-sans text-base placeholder-text-muted"
          placeholder="Search card names, archetypes, or card text..."
          aria-label="Search card database"
        />
      </div>
    </div>
  );
}
