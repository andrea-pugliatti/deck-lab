import { BookOpen, Search } from "lucide-react";
import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { useFetch } from "../../hooks/useFetch";
import { getDecksEndpoint, getFormatsEndpoint } from "../../services/deck";
import type { Deck } from "../../types";
import DeckCard from "../deck/DeckCard";
import ErrorAlert from "../ErrorAlert";
import LoadingSpinner from "../LoadingSpinner";
import Input from "../ui/Input";

interface DeckSelectorProps {
  onSelect: (deckId: number) => void;
}

export default function DeckSelector({ onSelect }: DeckSelectorProps) {
  const { user, isAuthenticated } = useAuth();
  const [activeTab, setActiveTab] = useState<"my-decks" | "community">("community");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFormat, setSelectedFormat] = useState("ALL");

  useEffect(() => {
    if (isAuthenticated) {
      setActiveTab("my-decks");
    } else {
      setActiveTab("community");
    }
  }, [isAuthenticated]);

  const { data: formatsData } = useFetch<string[]>(getFormatsEndpoint());
  const formats = formatsData
    ? ["ALL", ...formatsData]
    : ["ALL", "TCG", "OCG", "Goat", "Speed Duel"];

  const {
    data: myDecks,
    loading: loadingMy,
    error: errorMy,
    refetch: refetchMy,
  } = useFetch<Deck[]>(isAuthenticated && user?.username ? getDecksEndpoint(user.username) : null);

  const {
    data: publicDecks,
    loading: loadingPublic,
    error: errorPublic,
    refetch: refetchPublic,
  } = useFetch<Deck[]>(getDecksEndpoint());

  const decksToFilter = activeTab === "my-decks" ? myDecks || [] : publicDecks || [];
  const isLoading = activeTab === "my-decks" ? loadingMy : loadingPublic;
  const error = activeTab === "my-decks" ? errorMy : errorPublic;
  const refetch = activeTab === "my-decks" ? refetchMy : refetchPublic;

  const filteredDecks = decksToFilter.filter((deck) => {
    const matchesFormat =
      selectedFormat === "ALL" || deck.formatName.toLowerCase() === selectedFormat.toLowerCase();

    const matchesSearch =
      deck.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (deck.description && deck.description.toLowerCase().includes(searchQuery.toLowerCase()));

    return matchesFormat && matchesSearch;
  });

  return (
    <div className="max-w-4xl mx-auto bg-dark-surface border border-border-dim rounded-2xl p-6 md:p-8 shadow-xl relative overflow-hidden">
      <div className="absolute inset-0 bg-radial from-gold-accent/5 via-transparent to-transparent pointer-events-none"></div>

      <div className="text-center mb-8">
        <h2 className="font-display text-2xl md:text-3xl font-black text-white mb-2">
          SELECT A DECK
        </h2>
        <p className="text-sm text-slate-400 max-w-md mx-auto leading-relaxed">
          Choose one of your custom deck builds or browse community decks to begin simulating test
          hands.
        </p>
      </div>

      <div className="flex border-b border-border-dim mb-6">
        {isAuthenticated && (
          <button
            onClick={() => setActiveTab("my-decks")}
            className={`px-6 py-3 font-semibold text-xs uppercase tracking-wider border-b-2 transition-all duration-200 cursor-pointer ${
              activeTab === "my-decks"
                ? "border-gold-accent text-gold-accent"
                : "border-transparent text-slate-500 hover:text-slate-300"
            }`}
          >
            My Decks
          </button>
        )}
        <button
          onClick={() => setActiveTab("community")}
          className={`px-6 py-3 font-semibold text-xs uppercase tracking-wider border-b-2 transition-all duration-200 cursor-pointer ${
            activeTab === "community"
              ? "border-gold-accent text-gold-accent"
              : "border-transparent text-slate-500 hover:text-slate-300"
          }`}
        >
          Community Decks
        </button>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="flex-1">
          <Input
            type="text"
            placeholder="Search decks..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            icon={<Search className="w-4 h-4 text-slate-500" />}
          />
        </div>
        <div className="sm:w-48">
          <select
            value={selectedFormat}
            onChange={(e) => setSelectedFormat(e.target.value)}
            className="bg-dark-surface-elevated border border-border-dim rounded px-3 py-2.5 text-xs font-bold text-slate-200 w-full outline-none focus:border-cyan-accent cursor-pointer"
          >
            {formats.map((fmt) => (
              <option key={fmt} value={fmt}>
                {fmt === "ALL" ? "All Formats" : fmt}
              </option>
            ))}
          </select>
        </div>
      </div>

      {isLoading ? (
        <div className="py-12">
          <LoadingSpinner />
        </div>
      ) : error ? (
        <ErrorAlert title="Failed to load decks" message={error.message} onRetry={refetch} />
      ) : filteredDecks.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-100 overflow-y-auto pr-1">
          {filteredDecks.map((deck) => {
            const cardCount = deck.deckCards?.reduce((acc, c) => acc + (c.quantity || 0), 0) || 0;
            return (
              <DeckCard
                key={deck.id}
                id={deck.id}
                name={deck.name}
                description={deck.description}
                formatName={deck.formatName}
                cardCount={cardCount}
                updatedAt={deck.updatedAt}
                creatorUsername={deck.creatorUsername}
                onSelect={onSelect}
              />
            );
          })}
        </div>
      ) : (
        <div className="text-center py-12 border border-dashed border-border-dim rounded-xl bg-dark-surface-elevated/10">
          <BookOpen className="w-8 h-8 text-slate-600 mx-auto mb-2" />
          <p className="text-slate-400 text-sm font-semibold">No decks found</p>
          <p className="text-slate-500 text-xs mt-1">Try adjusting your filters or search term.</p>
        </div>
      )}
    </div>
  );
}
