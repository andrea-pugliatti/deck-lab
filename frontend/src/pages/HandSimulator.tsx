import { ArrowLeft, Calendar, Layers } from "lucide-react";
import { Link, useNavigate, useSearchParams } from "react-router";

import ErrorAlert from "../components/ErrorAlert";
import DeckSelector from "../components/hand-simulator/DeckSelector";
import SimulatorWorkspace from "../components/hand-simulator/SimulatorWorkspace";
import LoadingSpinner from "../components/LoadingSpinner";
import PageHeader from "../components/PageHeader";
import Button from "../components/ui/Button";
import { useFetch } from "../hooks/useFetch";
import { getDeckEndpoint } from "../services/deck";
import type { Deck } from "../types";
import { formatRelativeTime } from "../utils/date";

export default function HandSimulator() {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const deckId = searchParams.get("deckId");

  const {
    data: deck,
    loading,
    error,
  } = useFetch<Deck>(deckId ? getDeckEndpoint(deckId) : undefined);

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

  return (
    <div className="mx-auto max-w-7xl px-6 py-12">
      {deckId && deck ? (
        <div className="animate-fade-in space-y-8">
          <div className="mb-8 flex items-center justify-between">
            <Button
              variant="ghost"
              onClick={() => navigate(-1)}
              className="group px-2.5 py-1 font-normal text-slate-400"
              type="button"
            >
              <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
              <span>Back</span>
            </Button>

            <Link
              to={`/decks/${deck.id}`}
              viewTransition
              className="bg-dark-surface-elevated hover:bg-dark-surface border-border-dim hover:border-cyan-accent hover:text-cyan-accent flex cursor-pointer items-center gap-2 rounded-lg border px-4 py-2 text-xs font-semibold text-slate-300 no-underline shadow-md transition-all duration-200"
            >
              Back to Deck Detail
            </Link>
          </div>

          <div className="bg-dark-surface border-border-dim relative mb-8 overflow-hidden rounded-2xl border p-6 shadow-lg md:p-8">
            <div className="from-cyan-accent/5 pointer-events-none absolute inset-0 bg-radial via-transparent to-transparent"></div>
            <div className="mb-4 flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
              <div className="flex items-center gap-3">
                <span className="text-gold-accent bg-gold-accent/10 border-gold-accent/20 rounded border px-2.5 py-0.5 text-[10px] font-bold tracking-wider uppercase">
                  {deck.formatName}
                </span>
                <span className="text-xs font-semibold tracking-wider text-slate-500 uppercase">
                  by {deck.creatorUsername || "Community"}
                </span>
              </div>
              <div className="flex items-center gap-4 text-xs text-slate-500">
                <span className="flex items-center gap-1">
                  <Calendar className="h-3.5 w-3.5" />
                  Updated {formatRelativeTime(deck.updatedAt)}
                </span>
                <span className="flex items-center gap-1">
                  <Layers className="text-cyan-accent h-3.5 w-3.5" />
                  {totalCount} Cards Total
                </span>
              </div>
            </div>

            <h1 className="font-display mb-3 text-2xl font-black text-white md:text-4xl">
              SIMULATING: {deck.name}
            </h1>
            <p className="max-w-3xl text-sm leading-relaxed font-light text-slate-400 md:text-base">
              {deck.description || "No description provided."}
            </p>
          </div>

          {loading ? (
            <LoadingSpinner size="lg" className="min-h-[40vh]" />
          ) : error ? (
            <ErrorAlert title="Failed to load simulator" message={error.message} />
          ) : (
            <>
              <SimulatorWorkspace deck={deck} />
            </>
          )}
        </div>
      ) : (
        <div className="animate-fade-in pb-8">
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
