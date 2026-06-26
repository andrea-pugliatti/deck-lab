import { ArrowLeft, Calendar, Layers } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router";
import ErrorAlert from "../components/ErrorAlert";
import DeckSelector from "../components/hand-simulator/DeckSelector";
import SimulatorWorkspace from "../components/hand-simulator/SimulatorWorkspace";
import LoadingSpinner from "../components/LoadingSpinner";
import PageHeader from "../components/PageHeader";
import Button from "../components/ui/Button";
import { useFetch } from "../hooks/useFetch";
import type { Deck, SimulatorCardInstance } from "../types";
import { formatRelativeTime } from "../utils/date";

function shuffle<T>(array: T[]): T[] {
  const copy = [...array];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

export default function HandSimulator() {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const deckId = searchParams.get("deckId");

  const [hand, setHand] = useState<SimulatorCardInstance[]>([]);
  const [field, setField] = useState<SimulatorCardInstance[]>([]);
  const [graveyard, setGraveyard] = useState<SimulatorCardInstance[]>([]);
  const [banished, setBanished] = useState<SimulatorCardInstance[]>([]);
  const [remainingDeck, setRemainingDeck] = useState<SimulatorCardInstance[]>([]);

  const { data: deck, loading, error } = useFetch<Deck>(deckId ? `/api/decks/${deckId}` : null);

  const mainCardsCount =
    deck?.deckCards
      ?.filter((c) => c.section === "MAIN" || !c.section)
      .reduce((acc, c) => acc + (c.quantity || 0), 0) || 0;
  const extraCardsCount =
    deck?.deckCards
      ?.filter((c) => c.section === "EXTRA")
      .reduce((acc, c) => acc + (c.quantity || 0), 0) || 0;
  const sideCardsCount =
    deck?.deckCards
      ?.filter((c) => c.section === "SIDE")
      .reduce((acc, c) => acc + (c.quantity || 0), 0) || 0;
  const totalCount = mainCardsCount + extraCardsCount + sideCardsCount;

  const initSimulator = useCallback((targetDeck: Deck, startingHandSize: number = 5) => {
    if (!targetDeck || !targetDeck.deckCards) return;

    const flatMainCards: SimulatorCardInstance[] = [];
    targetDeck.deckCards.forEach((dc) => {
      if (dc.section === "MAIN" || !dc.section) {
        for (let i = 0; i < dc.quantity; i++) {
          flatMainCards.push({
            ...dc,
            uniqId: `${dc.cardId}-${i}-${Math.random().toString(36).substr(2, 9)}`,
          });
        }
      }
    });

    const shuffled = shuffle(flatMainCards);
    const initialHand = shuffled.slice(0, startingHandSize);
    const initialDeck = shuffled.slice(startingHandSize);

    setHand(initialHand);
    setRemainingDeck(initialDeck);
    setField([]);
    setGraveyard([]);
    setBanished([]);
  }, []);

  useEffect(() => {
    if (deck) {
      initSimulator(deck, 5);
    }
  }, [deck, initSimulator]);

  const handleDraw = (count: number) => {
    if (remainingDeck.length === 0) return;
    const drawn = remainingDeck.slice(0, count);
    const rest = remainingDeck.slice(count);

    setHand((prev) => [...prev, ...drawn]);
    setRemainingDeck(rest);
  };

  const handleShuffle = () => {
    setRemainingDeck((prev) => shuffle(prev));
  };

  const handleReset = (startingHandSize: number) => {
    if (deck) {
      initSimulator(deck, startingHandSize);
    }
  };

  const handleMoveCard = (
    card: SimulatorCardInstance,
    toZone: "hand" | "field" | "graveyard" | "banished" | "deck-top" | "deck-bottom",
  ) => {
    const filterFn = (c: SimulatorCardInstance) => c.uniqId !== card.uniqId;
    setHand((prev) => prev.filter(filterFn));
    setField((prev) => prev.filter(filterFn));
    setGraveyard((prev) => prev.filter(filterFn));
    setBanished((prev) => prev.filter(filterFn));
    setRemainingDeck((prev) => prev.filter(filterFn));

    switch (toZone) {
      case "hand":
        setHand((prev) => [...prev, card]);
        break;
      case "field":
        setField((prev) => [...prev, card]);
        break;
      case "graveyard":
        setGraveyard((prev) => [...prev, card]);
        break;
      case "banished":
        setBanished((prev) => [...prev, card]);
        break;
      case "deck-top":
        setRemainingDeck((prev) => [card, ...prev]);
        break;
      case "deck-bottom":
        setRemainingDeck((prev) => [...prev, card]);
        break;
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      {deckId && deck ? (
        <div className="space-y-8 animate-fade-in">
          <div className="flex justify-between items-center mb-8">
            <Button
              variant="ghost"
              onClick={() => navigate(-1)}
              className="group text-slate-400 font-normal px-2.5 py-1"
              type="button"
            >
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
              <span>Back</span>
            </Button>

            <Link
              to={`/decks/${deck.id}`}
              className="flex items-center gap-2 bg-dark-surface-elevated hover:bg-dark-surface border border-border-dim hover:border-cyan-accent text-slate-300 hover:text-cyan-accent px-4 py-2 rounded-lg text-xs font-semibold shadow-md transition-all duration-200 cursor-pointer no-underline"
            >
              Back to Deck Detail
            </Link>
          </div>

          <div className="bg-dark-surface border border-border-dim rounded-2xl p-6 md:p-8 mb-8 relative overflow-hidden shadow-lg">
            <div className="absolute inset-0 bg-radial from-cyan-accent/5 via-transparent to-transparent pointer-events-none"></div>
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-4">
              <div className="flex items-center gap-3">
                <span className="text-[10px] font-bold text-gold-accent uppercase tracking-wider bg-gold-accent/10 px-2.5 py-0.5 rounded border border-gold-accent/20">
                  {deck.formatName}
                </span>
                <span className="text-xs text-slate-500 font-semibold uppercase tracking-wider">
                  by {deck.creatorUsername || "Community"}
                </span>
              </div>
              <div className="flex items-center gap-4 text-xs text-slate-500">
                <span className="flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5" />
                  Updated {formatRelativeTime(deck.updatedAt)}
                </span>
                <span className="flex items-center gap-1">
                  <Layers className="w-3.5 h-3.5 text-cyan-accent" />
                  {totalCount} Cards Total
                </span>
              </div>
            </div>

            <h1 className="font-display text-2xl md:text-4xl font-black text-white mb-3">
              SIMULATING: {deck.name}
            </h1>
            <p className="text-sm md:text-base text-slate-400 max-w-3xl leading-relaxed font-light">
              {deck.description || "No description provided."}
            </p>
          </div>

          {loading ? (
            <LoadingSpinner size="lg" className="min-h-[40vh]" />
          ) : error ? (
            <ErrorAlert title="Failed to load simulator" message={error.message} />
          ) : (
            <>
              <SimulatorWorkspace
                hand={hand}
                field={field}
                graveyard={graveyard}
                banished={banished}
                remainingDeck={remainingDeck}
                onDraw={handleDraw}
                onShuffle={handleShuffle}
                onReset={handleReset}
                onMoveCard={handleMoveCard}
              />
            </>
          )}
        </div>
      ) : (
        <div className="animate-fade-in py-8">
          <PageHeader
            title="Hand Simulator"
            description="Simulate drawing starting hands, test card combos, and verify deck consistency."
          />
          <DeckSelector onSelect={(id) => setSearchParams({ deckId: String(id) })} />
        </div>
      )}
    </div>
  );
}
