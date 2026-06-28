import { BookOpen, Search } from "lucide-react";
import { useState } from "react";

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

  const [prevIsAuthenticated, setPrevIsAuthenticated] = useState(isAuthenticated);

  if (isAuthenticated !== prevIsAuthenticated) {
    setPrevIsAuthenticated(isAuthenticated);
    setActiveTab(isAuthenticated ? "my-decks" : "community");
  }

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
    <div className="bg-dark-surface border-border-dim relative mx-auto max-w-4xl overflow-hidden rounded-2xl border p-6 shadow-xl md:p-8">
      <div className="from-gold-accent/5 pointer-events-none absolute inset-0 bg-radial via-transparent to-transparent"></div>

      <div className="mb-8 text-center">
        <h2 className="font-display mb-2 text-2xl font-black text-white md:text-3xl">
          SELECT A DECK
        </h2>
        <p className="mx-auto max-w-md text-sm leading-relaxed text-slate-400">
          Choose one of your custom deck builds or browse community decks to begin simulating test
          hands.
        </p>
      </div>

      <div className="border-border-dim mb-6 flex border-b">
        {isAuthenticated && (
          <button
            onClick={() => setActiveTab("my-decks")}
            className={`cursor-pointer border-b-2 px-6 py-3 text-xs font-semibold tracking-wider uppercase transition-all duration-200 ${
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
          className={`cursor-pointer border-b-2 px-6 py-3 text-xs font-semibold tracking-wider uppercase transition-all duration-200 ${
            activeTab === "community"
              ? "border-gold-accent text-gold-accent"
              : "border-transparent text-slate-500 hover:text-slate-300"
          }`}
        >
          Community Decks
        </button>
      </div>

      <div className="mb-6 flex flex-col gap-4 sm:flex-row">
        <div className="flex-1">
          <Input
            type="text"
            placeholder="Search decks..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            icon={<Search className="h-4 w-4 text-slate-500" />}
          />
        </div>
        <div className="sm:w-48">
          <select
            value={selectedFormat}
            onChange={(e) => setSelectedFormat(e.target.value)}
            className="bg-dark-surface-elevated border-border-dim focus:border-cyan-accent w-full cursor-pointer rounded border px-3 py-2.5 text-xs font-bold text-slate-200 outline-none"
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
        <div className="grid max-h-100 grid-cols-1 gap-4 overflow-y-auto pr-1 md:grid-cols-2">
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
        <div className="border-border-dim bg-dark-surface-elevated/10 rounded-xl border border-dashed py-12 text-center">
          <BookOpen className="mx-auto mb-2 h-8 w-8 text-slate-600" />
          <p className="text-sm font-semibold text-slate-400">No decks found</p>
          <p className="mt-1 text-xs text-slate-500">Try adjusting your filters or search term.</p>
        </div>
      )}
    </div>
  );
}
