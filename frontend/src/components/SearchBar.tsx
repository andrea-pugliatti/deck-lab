import { useState, useEffect, useRef } from "react";
import { Search } from "lucide-react";
import { useNavigate, Link } from "react-router";
import { useFetch } from "../hooks/useFetch";
import { useDebounce } from "../hooks/useDebounce";

interface SuggestionCard {
  id: number;
  name: string;
  type: string;
}

export default function SearchBar() {
  const [query, setQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [focusedIndex, setFocusedIndex] = useState(-1);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  const debouncedQuery = useDebounce(query, 300);

  const fetchUrl =
    debouncedQuery.trim().length >= 2
      ? `/api/cards?q=${encodeURIComponent(debouncedQuery.trim())}&size=5`
      : null;

  const { data, loading } = useFetch<{ content: SuggestionCard[] }>(fetchUrl);
  const cardSuggestions = data?.content || [];

  const staticSuggestions = [
    "Snake-Eye",
    "Tenpai Dragon",
    "Yubel",
    "Branded Despia",
    "Voiceless Voice",
  ];

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleSubmit = (e: React.SubmitEvent) => {
    e.preventDefault();
    if (query.trim()) {
      setIsOpen(false);
      navigate(`/cards?q=${encodeURIComponent(query.trim())}`);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
    setIsOpen(true);
    setFocusedIndex(-1);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isOpen || cardSuggestions.length === 0) return;

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setFocusedIndex((prev) => (prev + 1) % cardSuggestions.length);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setFocusedIndex((prev) => (prev - 1 + cardSuggestions.length) % cardSuggestions.length);
    } else if (e.key === "Enter" && focusedIndex >= 0) {
      e.preventDefault();
      const selected = cardSuggestions[focusedIndex];
      handleSuggestionClick(selected.name);
    } else if (e.key === "Escape") {
      setIsOpen(false);
    }
  };

  const handleSuggestionClick = (name: string) => {
    setQuery(name);
    setIsOpen(false);
    navigate(`/cards?q=${encodeURIComponent(name)}`);
  };

  return (
    <div className="w-full max-w-2xl mx-auto relative z-10" ref={dropdownRef}>
      <form
        onSubmit={handleSubmit}
        className="group relative flex items-center bg-dark-surface border border-border-dim rounded-lg px-5 transition-all duration-300 shadow-md hover:border-border-glow focus-within:border-cyan-accent focus-within:ring-4 focus-within:ring-cyan-accent/15 focus-within:bg-dark-surface-elevated"
      >
        <Search className="w-5 h-5 text-text-muted shrink-0 mr-3 transition-colors duration-200 group-focus-within:text-cyan-accent" />
        <input
          type="text"
          value={query}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          onFocus={() => setIsOpen(true)}
          className="w-full h-13 bg-transparent border-none outline-none text-white font-sans text-base placeholder-text-muted"
          placeholder="Search card names, archetypes, or card text..."
          aria-label="Search card database"
        />
        {loading && (
          <div className="w-4 h-4 border-2 border-cyan-accent/20 border-t-cyan-accent rounded-full animate-spin ml-2"></div>
        )}
      </form>

      {isOpen && query.trim().length >= 2 && (
        <div className="backdrop-blur-md bg-dark-surface/95 border border-border-dim rounded-lg shadow-xl mt-2 py-2 absolute z-50 w-full left-0 right-0 max-h-60 overflow-y-auto">
          {cardSuggestions.length > 0
            ? cardSuggestions.map((card, idx) => (
                <button
                  key={card.id}
                  onClick={() => handleSuggestionClick(card.name)}
                  className={`w-full text-left px-4 py-2.5 cursor-pointer flex items-center justify-between text-sm transition-all duration-150 border-none outline-none ${
                    focusedIndex === idx
                      ? "bg-cyan-accent/15 text-cyan-accent"
                      : "text-slate-300 hover:bg-cyan-accent/10 hover:text-cyan-accent"
                  }`}
                  type="button"
                >
                  <span className="font-semibold">{card.name}</span>
                  <span className="text-[10px] text-slate-500 uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-dark-surface-elevated border border-border-dim">
                    {card.type.replace(" Card", "").replace(" Monster", "")}
                  </span>
                </button>
              ))
            : !loading && (
                <div className="px-4 py-3 text-sm text-slate-500 text-center">
                  No matching cards found
                </div>
              )}
        </div>
      )}

      <div className="flex gap-3 items-center justify-center mt-5 flex-wrap">
        <span className="text-[10px] text-text-muted uppercase tracking-widest font-semibold">
          Trending:
        </span>
        {staticSuggestions.map((item) => (
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
