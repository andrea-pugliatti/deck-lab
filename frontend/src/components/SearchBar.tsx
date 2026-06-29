import { Search } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router";

import { useDebounce } from "../hooks/useDebounce";
import { useFetch } from "../hooks/useFetch";
import { getCardSuggestionsEndpoint } from "../services/card";

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
      ? getCardSuggestionsEndpoint(debouncedQuery.trim())
      : undefined;

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
    <div className="relative z-10 mx-auto w-full max-w-2xl" ref={dropdownRef}>
      <form
        onSubmit={handleSubmit}
        className="group bg-dark-surface/60 border-border-dim/80 hover:border-cyan-accent/50 focus-within:border-cyan-accent focus-within:ring-cyan-accent/10 focus-within:bg-dark-surface-elevated relative flex items-center rounded-xl border px-5 shadow-[0_4px_20px_rgba(0,0,0,0.25)] backdrop-blur-md transition-all duration-300 focus-within:ring-4"
      >
        <Search className="group-focus-within:text-cyan-accent mr-3 h-5 w-5 shrink-0 text-slate-400 transition-colors duration-200" />
        <input
          type="text"
          value={query}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          onFocus={() => setIsOpen(true)}
          className="h-13 w-full border-none bg-transparent font-sans text-base text-white placeholder-slate-500 outline-none"
          placeholder="Search card names, archetypes, or card text..."
          aria-label="Search card database"
        />
        {loading && (
          <div className="border-cyan-accent/20 border-t-cyan-accent ml-2 h-4 w-4 animate-spin rounded-full border-2"></div>
        )}
      </form>

      {isOpen && query.trim().length >= 2 && (
        <div className="bg-dark-surface/95 border-border-dim absolute right-0 left-0 z-50 mt-2 max-h-60 w-full overflow-y-auto rounded-lg border py-2 shadow-xl backdrop-blur-md">
          {cardSuggestions.length > 0
            ? cardSuggestions.map((card, idx) => (
                <button
                  key={card.id}
                  onClick={() => handleSuggestionClick(card.name)}
                  className={`flex w-full cursor-pointer items-center justify-between border-none px-4 py-2.5 text-left text-sm transition-all duration-150 outline-none ${
                    focusedIndex === idx
                      ? "bg-cyan-accent/15 text-cyan-accent"
                      : "hover:bg-cyan-accent/10 hover:text-cyan-accent text-slate-300"
                  }`}
                  type="button"
                >
                  <span className="font-semibold">{card.name}</span>
                  <span className="bg-dark-surface-elevated border-border-dim rounded border px-2 py-0.5 text-[10px] font-bold tracking-wider text-slate-500 uppercase">
                    {card.type.replace(" Card", "").replace(" Monster", "")}
                  </span>
                </button>
              ))
            : !loading && (
                <div className="px-4 py-3 text-center text-sm text-slate-500">
                  No matching cards found
                </div>
              )}
        </div>
      )}

      <div className="mt-5 flex flex-wrap items-center justify-center gap-2.5">
        <span className="mr-1 text-[10px] font-semibold tracking-widest text-slate-500 uppercase">
          Trending:
        </span>
        {staticSuggestions.map((item) => (
          <Link
            key={item}
            to={`/cards?q=${encodeURIComponent(item)}`}
            className="bg-dark-surface-elevated/40 border-border-dim/60 hover:border-cyan-accent hover:text-cyan-accent hover:bg-cyan-accent/5 cursor-pointer rounded-full border px-3.5 py-1.5 text-xs text-slate-300 no-underline shadow-sm backdrop-blur-sm transition-all duration-200 hover:scale-105 hover:shadow-cyan-950/20"
          >
            {item}
          </Link>
        ))}
      </div>
    </div>
  );
}
