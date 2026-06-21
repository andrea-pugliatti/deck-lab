import { useState } from "react";
import DeckListItem from "../components/DeckListItem";
import PageHeader from "../components/PageHeader";
import FormatSelector from "../components/FormatSelector";
import { Search, Plus, Filter } from "lucide-react";
import { useFetch } from "../hooks/useFetch";
import { useAuth } from "../context/AuthContext";
import type { BackendDeck } from "../types";

function formatRelativeTime(dateString?: string): string {
  if (!dateString) return "some time ago";
  try {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 1) return "just now";
    if (diffMins < 60) return `${diffMins} minute${diffMins > 1 ? "s" : ""} ago`;
    if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? "s" : ""} ago`;
    if (diffDays < 30) return `${diffDays} day${diffDays > 1 ? "s" : ""} ago`;

    return date.toLocaleDateString();
  } catch {
    return "recently";
  }
}

export default function MyDecks() {
  const { user } = useAuth();
  const [selectedFormat, setSelectedFormat] = useState("ALL");
  const [searchQuery, setSearchQuery] = useState("");
  const formats = ["ALL", "TCG", "OCG", "Goat", "Speed Duel"];

  const { data, loading, error } = useFetch<BackendDeck[]>(
    user?.username ? `/api/decks?username=${encodeURIComponent(user.username)}` : null,
  );
  const decks = data || [];

  const filteredDecks = decks.filter((deck) => {
    const matchesFormat =
      selectedFormat === "ALL" || deck.formatName.toLowerCase() === selectedFormat.toLowerCase();

    const matchesSearch =
      deck.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (deck.description && deck.description.toLowerCase().includes(searchQuery.toLowerCase()));

    return matchesFormat && matchesSearch;
  });

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      <PageHeader
        title="My Decks"
        description="Create, edit, and manage your deck builds and format experiments."
      >
        <button
          className="flex items-center gap-2 bg-gold-accent hover:bg-gold-hover text-dark-bg px-5 py-2.5 rounded font-sans font-semibold text-sm cursor-pointer shadow-md transition-all duration-300 transform hover:-translate-y-0.5"
          type="button"
        >
          <Plus className="w-4 h-4" />
          Construct Deck
        </button>
      </PageHeader>

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <FormatSelector
          selectedFormat={selectedFormat}
          setSelectedFormat={setSelectedFormat}
          formats={formats}
        />

        <div className="group relative flex items-center bg-dark-surface border border-border-dim rounded px-4 py-2 w-full md:max-w-xs transition-all duration-300 hover:border-border-glow focus-within:border-cyan-accent">
          <Search className="w-4 h-4 text-slate-500 mr-2 group-focus-within:text-cyan-accent" />
          <input
            type="text"
            placeholder="Search my decks..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="bg-transparent border-none outline-none text-sm text-white placeholder-slate-500 w-full"
          />
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-20">
          <div className="w-10 h-10 border-4 border-cyan-accent/20 border-t-cyan-accent rounded-full animate-spin"></div>
        </div>
      ) : error ? (
        <div className="text-center py-12 bg-red-950/10 border border-red-500/20 rounded-lg p-6">
          <p className="text-red-400 font-semibold mb-2">Failed to load decks</p>
          <p className="text-xs text-slate-500 mb-4">{error.message}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-red-500/20 hover:bg-red-500/40 text-red-200 border border-red-500/50 rounded text-xs transition-colors duration-200 cursor-pointer"
            type="button"
          >
            Retry
          </button>
        </div>
      ) : filteredDecks.length > 0 ? (
        <div className="space-y-4">
          {filteredDecks.map((deck) => {
            const cardCount = deck.deckCards?.reduce((acc, c) => acc + (c.quantity || 0), 0) || 0;
            return (
              <DeckListItem
                key={deck.id}
                id={deck.id}
                name={deck.name}
                description={deck.description}
                formatName={deck.formatName}
                cardCount={cardCount}
                updatedAt={formatRelativeTime(deck.updatedAt)}
                showActions={true}
              />
            );
          })}
        </div>
      ) : (
        <div className="text-center py-16 border border-dashed border-border-dim rounded-lg bg-dark-surface/10">
          <Filter className="w-8 h-8 text-slate-600 mx-auto mb-3" />
          <p className="text-slate-400 text-sm mb-1">No decks found matching the filter.</p>
          <p className="text-slate-600 text-xs">
            Try selecting a different format or start a new build.
          </p>
        </div>
      )}
    </div>
  );
}
