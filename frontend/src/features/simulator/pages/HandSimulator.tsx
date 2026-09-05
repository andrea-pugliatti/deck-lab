import { useQuery } from "@tanstack/react-query";
import { ArrowLeft, Calendar, Layers } from "lucide-react";
import { Link, useSearchParams } from "react-router";

import ErrorAlert from "../../../components/feedback/ErrorAlert";
import LoadingSpinner from "../../../components/feedback/LoadingSpinner";
import PageHeader from "../../../components/navigation/PageHeader";
import { getButtonClasses } from "../../../components/ui/Button";
import DeckSelector from "../../../features/simulator/components/DeckSelector";
import SimulatorWorkspace from "../../../features/simulator/components/SimulatorWorkspace";
import { deckQueries } from "../../../services/queryOptions";
import { formatRelativeTime } from "../../../utils/date";

/**
 * HandSimulator Page Component.
 *
 * Provides an interactive environment to simulate drawing starting hands, test opening play combos,
 * and verify deck configuration consistency. If a `deckId` query parameter is present in the URL,
 * the component fetches the deck and mounts the workspace; otherwise, it displays a deck selection interface.
 *
 * @returns {React.JSX.Element} The rendered HandSimulator component.
 */
export default function HandSimulator(): React.JSX.Element {
  const [searchParams, setSearchParams] = useSearchParams();
  const deckId = searchParams.get("deckId");

  const { data: deck, isLoading: loading, error } = useQuery(deckQueries.detail(deckId));

  const handleSelectDeck = (id: number) => {
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      next.set("deckId", String(id));
      return next;
    });
  };

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
            <Link
              to="/simulator"
              viewTransition
              className={`${getButtonClasses({ variant: "ghost" })} group px-2.5 py-1 font-normal text-slate-400 no-underline`}
            >
              <ArrowLeft
                className="h-4 w-4 transition-transform group-hover:-translate-x-1"
                aria-hidden="true"
              />
              <span>Select Another Deck</span>
            </Link>

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
                <span className="text-gold-accent bg-gold-accent/10 border-gold-accent/20 text-2xs rounded border px-2.5 py-0.5 font-bold tracking-wider uppercase">
                  {deck.formatName}
                </span>
                <span className="text-xs font-semibold tracking-wider text-slate-400 uppercase">
                  by {deck.creatorUsername || "Community"}
                </span>
              </div>
              <div className="flex items-center gap-4 text-xs text-slate-400">
                <span className="flex items-center gap-1">
                  <Calendar className="h-3.5 w-3.5" aria-hidden="true" />
                  Updated {formatRelativeTime(deck.updatedAt)}
                </span>
                <span className="flex items-center gap-1">
                  <Layers className="text-cyan-accent h-3.5 w-3.5" aria-hidden="true" />
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
          <DeckSelector onSelect={handleSelectDeck} />
        </div>
      )}
    </div>
  );
}
