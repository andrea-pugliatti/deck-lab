import { BookOpen, Globe, Search, Shuffle, User } from "lucide-react";
import { useState } from "react";

import { useAuth } from "../../context/AuthContext";
import { useFetch } from "../../hooks/useFetch";
import { getDecksEndpoint, getFormatsEndpoint } from "../../services/deck";
import type { Deck } from "../../types";
import DeckCard from "../deck/DeckCard";
import EmptyState from "../EmptyState";
import ErrorAlert from "../ErrorAlert";
import LoadingSpinner from "../LoadingSpinner";
import Button from "../ui/Button";
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

  const selectRandomDeck = () => {
    if (filteredDecks.length > 0) {
      const randomIndex = Math.floor(Math.random() * filteredDecks.length);
      onSelect(filteredDecks[randomIndex].id);
    }
  };

  return (
    <div className="grid w-full grid-cols-1 items-start gap-6 lg:grid-cols-12">
      {/* Left Column */}
      <aside className="bg-dark-surface border-border-dim flex h-fit flex-col rounded-2xl border p-5 lg:sticky lg:top-24 lg:col-span-4">
        <h2 className="border-border-dim/60 mb-4 border-b pb-2.5 text-lg font-bold tracking-wide text-white uppercase">
          Select A Deck
        </h2>
        <p className="mb-6 text-xs leading-relaxed font-light text-slate-400">
          Choose one of your custom deck builds or browse community decks to begin simulating test
          hands.
        </p>

        <div className="flex flex-col gap-1">
          {isAuthenticated && (
            <button
              onClick={() => setActiveTab("my-decks")}
              className={`flex w-full cursor-pointer items-center gap-3 rounded-r-xl border-l-2 px-4 py-3.5 text-left text-xs font-bold tracking-wider uppercase transition-all duration-200 ${
                activeTab === "my-decks"
                  ? "bg-gold-accent/5 border-l-gold-accent text-gold-accent"
                  : "hover:bg-dark-surface-elevated/30 border-l-transparent text-slate-400 hover:text-slate-200"
              }`}
            >
              <User className="h-4 w-4" />
              <span>My Decks</span>
            </button>
          )}
          <button
            onClick={() => setActiveTab("community")}
            className={`flex w-full cursor-pointer items-center gap-3 rounded-r-xl border-l-2 px-4 py-3.5 text-left text-xs font-bold tracking-wider uppercase transition-all duration-200 ${
              activeTab === "community"
                ? "bg-gold-accent/5 border-l-gold-accent text-gold-accent"
                : "hover:bg-dark-surface-elevated/30 border-l-transparent text-slate-400 hover:text-slate-200"
            }`}
          >
            <Globe className="h-4 w-4" />
            <span>Community Decks</span>
          </button>
        </div>

        <div className="border-border-dim/60 mt-6 border-t p-4">
          <p className="mb-2.5 text-[10px] font-bold tracking-widest text-slate-500 uppercase">
            Feeling Lucky?
          </p>
          <Button
            type="button"
            variant="primary"
            onClick={selectRandomDeck}
            disabled={filteredDecks.length === 0}
            className="flex w-full items-center justify-center gap-2 py-3 text-xs font-bold tracking-wider uppercase shadow-md hover:shadow-[0_2px_30px_rgba(226,197,111,0.16)]"
          >
            <Shuffle className="h-4 w-4" />
            <span>Random Deck</span>
          </Button>
        </div>
      </aside>

      {/* Right Column */}
      <div className="flex flex-col lg:col-span-8">
        <div className="mb-6 flex flex-col gap-4 sm:flex-row">
          <div className="flex-1">
            <Input
              type="text"
              placeholder="Search decks..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              icon={<Search className="h-4 w-4 text-slate-500" />}
              className="bg-dark-surface-elevated border-border-dim focus:border-cyan-accent w-full"
            />
          </div>
          <div className="sm:w-48">
            <select
              value={selectedFormat}
              onChange={(e) => setSelectedFormat(e.target.value)}
              className="bg-dark-surface-elevated border-border-dim focus:border-cyan-accent w-full cursor-pointer rounded border px-3 py-2 text-sm text-slate-200 outline-none"
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
          <div className="flex flex-1 items-center justify-center py-12">
            <LoadingSpinner />
          </div>
        ) : error ? (
          <div className="py-8">
            <ErrorAlert title="Failed to load decks" message={error.message} onRetry={refetch} />
          </div>
        ) : filteredDecks.length > 0 ? (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
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
          <EmptyState
            icon={BookOpen}
            title="No decks found"
            description="Try adjusting your filters or search term."
          />
        )}
      </div>
    </div>
  );
}
