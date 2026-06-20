import { useState } from "react";
import { Search } from "lucide-react";
import { useNavigate, Link } from "react-router";

export default function SearchBar() {
  const [query, setQuery] = useState("");
  const navigate = useNavigate();
  const suggestions = ["Snake-Eye", "Tenpai Dragon", "Yubel", "Branded Despia", "Voiceless Voice"];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      navigate(`/cards?q=${encodeURIComponent(query.trim())}`);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto relative z-10">
      <form
        onSubmit={handleSubmit}
        className="group relative flex items-center bg-dark-surface border border-border-dim rounded-lg px-5 transition-all duration-300 shadow-md hover:border-border-glow focus-within:border-cyan-accent focus-within:ring-4 focus-within:ring-cyan-accent/15 focus-within:bg-dark-surface-elevated"
      >
        <Search className="w-5 h-5 text-text-muted shrink-0 mr-3 transition-colors duration-200 group-focus-within:text-cyan-accent" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full h-13 bg-transparent border-none outline-none text-white font-sans text-base placeholder-text-muted"
          placeholder="Search card names, archetypes, or card text..."
          aria-label="Search card database"
        />
      </form>
      <div className="flex gap-3 items-center justify-center mt-5 flex-wrap">
        <span className="text-[10px] text-text-muted uppercase tracking-widest font-semibold">
          Trending:
        </span>
        {suggestions.map((item) => (
          <Link
            key={item}
            to={`/cards?q=${encodeURIComponent(item)}`}
            className="bg-dark-surface border border-border-dim text-text-secondary px-3 py-1 rounded-full text-xs no-underline transition-all duration-200 hover:border-cyan-accent hover:text-cyan-hover hover:bg-dark-surface-elevated cursor-pointer"
          >
            {item}
          </Link>
        ))}
      </div>
    </div>
  );
}
