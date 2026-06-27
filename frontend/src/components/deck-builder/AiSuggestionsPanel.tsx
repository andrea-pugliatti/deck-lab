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
        name: c.name,
        section: c.section,
        quantity: c.quantity,
      }));
      const data = await fetchAiSuggestions(formatName, currentCards);
      setSuggestions(data || []);
    } catch (err: any) {
      setError(err.message || "Could not retrieve recommendations.");
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
    <div className="bg-dark-surface border border-border-dim rounded-2xl p-5 shadow-md">
      <div className="flex justify-between items-center pb-2 border-b border-border-dim/60 mb-4">
        <h3 className="font-display text-sm font-bold text-white flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-cyan-accent" />
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
              className="px-3 py-1.5 flex items-center gap-1.5"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset</span>
            </Button>
          )}
          <Button
            variant="outline"
            size="sm"
            onClick={fetchSuggestions}
            isLoading={loading}
            disabled={loading}
            className="px-3 py-1.5 flex items-center gap-1.5 border-cyan-accent/20 hover:border-cyan-accent text-cyan-accent bg-cyan-950/10"
          >
            <Wand2 className="w-3.5 h-3.5" />
            <span>Analyze Synergy</span>
          </Button>
        </div>
      </div>

      {error && (
        <div className="p-3 bg-red-950/40 border border-red-800/60 rounded-xl text-red-200 text-xs flex gap-2 items-center mb-4">
          <AlertCircle className="w-4 h-4 text-red-500 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {loading && (
        <div className="flex justify-center items-center py-10">
          <LoadingSpinner size="sm" className="py-2" />
        </div>
      )}

      {!loading && suggestions.length === 0 && (
        <div className="text-center py-6 text-xs text-slate-400">
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
              onAdd={addSuggestedCard}
            />
          ))}
        </div>
      )}
    </div>
  );
}
