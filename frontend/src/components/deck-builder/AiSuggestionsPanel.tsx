import { AlertCircle, RotateCcw, Sparkles, Wand2 } from "lucide-react";
import { useState } from "react";

import { fetchAiSuggestions } from "../../services/deck";
import type { Card, CardSection, DeckCardItem, Suggestion } from "../../types";
import LoadingSpinner from "../LoadingSpinner";
import Button from "../ui/Button";
import AiSuggestionItem from "./AiSuggestionItem";

export interface AiSuggestionsPanelProps {
  deckCards: DeckCardItem[];
  formatName: string;
  addCard: (card: Card, section: CardSection) => void;
}

export default function AiSuggestionsPanel({
  deckCards,
  formatName,
  addCard,
}: AiSuggestionsPanelProps) {
  const [loading, setLoading] = useState(false);
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [error, setError] = useState<string>();

  const fetchSuggestions = async () => {
    setLoading(true);
    setError(undefined);

    try {
      const currentCards = deckCards.map((c) => ({
        cardId: c.cardId,
        name: c.name,
        section: c.section,
        quantity: c.quantity,
      }));
      const data = await fetchAiSuggestions(formatName, currentCards);
      setSuggestions(data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not retrieve recommendations.");
    } finally {
      setLoading(false);
    }
  };

  const addSuggestedCard = (suggested: Suggestion) => {
    addCard(
      {
        id: suggested.cardId,
        name: suggested.name,
        type: suggested.type,
        imageUrlCropped: suggested.imageUrl,
        description: "",
        race: "",
        attribute: "",
      },
      suggested.section,
    );
  };

  return (
    <div className="bg-dark-surface border-border-dim rounded-2xl border p-5 shadow-md">
      <div className="border-border-dim/60 mb-4 flex items-center justify-between border-b pb-2">
        <h3 className="font-display flex items-center gap-2 text-sm font-bold text-white">
          <Sparkles className="text-cyan-accent h-4 w-4" />
          <span>AI Card Suggestions</span>
        </h3>
        <div className="flex items-center gap-2">
          {(suggestions.length > 0 || error) && (
            <Button
              variant="outline-red"
              size="sm"
              onClick={() => {
                setSuggestions([]);
                setError(undefined);
              }}
              className="flex items-center gap-1.5 px-3 py-1.5"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              <span>Reset</span>
            </Button>
          )}
          <Button
            variant="outline"
            size="sm"
            onClick={fetchSuggestions}
            isLoading={loading}
            disabled={loading}
            className="border-cyan-accent/20 hover:border-cyan-accent text-cyan-accent flex items-center gap-1.5 bg-cyan-950/10 px-3 py-1.5"
          >
            <Wand2 className="h-3.5 w-3.5" />
            <span>Analyze Synergy</span>
          </Button>
        </div>
      </div>

      {error && (
        <div className="mb-4 flex items-center gap-2 rounded-xl border border-red-800/60 bg-red-950/40 p-3 text-xs text-red-200">
          <AlertCircle className="h-4 w-4 shrink-0 text-red-500" />
          <span>{error}</span>
        </div>
      )}

      {loading && (
        <div className="flex items-center justify-center py-10">
          <LoadingSpinner size="sm" className="py-2" />
        </div>
      )}

      {!loading && suggestions.length === 0 && (
        <div className="py-6 text-center text-xs text-slate-400">
          Click <span className="text-cyan-accent font-semibold">Analyze Synergy</span> to get
          recommended cards based on your current deck layout.
        </div>
      )}

      {!loading && suggestions.length > 0 && (
        <div className="space-y-3">
          {suggestions.map((card) => (
            <AiSuggestionItem
              key={`${card.cardId}-${card.section}`}
              card={card}
              deckCards={deckCards}
              formatName={formatName}
              onAdd={addSuggestedCard}
            />
          ))}
        </div>
      )}
    </div>
  );
}
