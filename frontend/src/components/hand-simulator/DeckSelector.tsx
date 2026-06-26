import { BookOpen, Layers, Search, User } from "lucide-react";
import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { useFetch } from "../../hooks/useFetch";
import { getDecksEndpoint, getFormatsEndpoint } from "../../services/deck";
import type { Deck } from "../../types";
import ErrorAlert from "../ErrorAlert";
import LoadingSpinner from "../LoadingSpinner";
import Badge from "../ui/Badge";
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
              <div
                key={deck.id}
                className="bg-dark-surface-elevated/40 hover:bg-dark-surface-elevated border border-border-dim hover:border-gold-accent/40 rounded-xl p-5 flex flex-col justify-between gap-4 transition-all duration-200 group"
              >
                <div>
                  <div className="flex justify-between items-start gap-2 mb-2">
                    <h3 className="font-display text-base font-bold text-white group-hover:text-gold-accent transition-colors line-clamp-1">
                      {deck.name}
                    </h3>
                    <Badge
                      variant={deck.formatName.toLowerCase().includes("tcg") ? "cyan" : "gold"}
                    >
                      {deck.formatName}
                    </Badge>
                  </div>
                  <p className="text-xs text-slate-400 line-clamp-2 min-h-8 mb-3 leading-relaxed">
                    {deck.description || "No description provided."}
                  </p>
                </div>

                <div className="flex items-center justify-between border-t border-border-dim/40 pt-3 text-[10px] text-slate-500 font-semibold uppercase tracking-wider">
                  <div className="flex gap-4">
                    <span className="flex items-center gap-1">
                      <Layers className="w-3.5 h-3.5" />
                      {cardCount} Cards
                    </span>
                    <span className="flex items-center gap-1">
                      <User className="w-3.5 h-3.5" />
                      {deck.creatorUsername || "Community"}
                    </span>
                  </div>
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={() => onSelect(deck.id)}
                    className="font-bold uppercase tracking-wider text-[9px] px-3.5 py-1.5 rounded-lg group-hover:shadow-[0_0_12px_rgba(226,197,111,0.25)] transition-all"
                  >
                    Select
                  </Button>
                </div>
              </div>
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
