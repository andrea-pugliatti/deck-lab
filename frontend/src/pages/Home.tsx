import { useFetch } from "../hooks/useFetch";
import DeckCard from "../components/DeckCard";
import SearchBar from "../components/SearchBar";
import CardGridItem from "../components/CardGridItem";
import { Link } from "react-router";
import { Sparkles, Trophy, Layers, Flame, Compass } from "lucide-react";
import type { BackendDeck, Card, Page } from "../types";

export default function Home() {
  const {
    data: decksData,
    loading: decksLoading,
    error: decksError,
  } = useFetch<BackendDeck[]>("/api/decks");
  const {
    data: cardsData,
    loading: cardsLoading,
    error: cardsError,
  } = useFetch<Page<Card>>("/api/cards?size=6");

  const decks = decksData ? decksData.slice(0, 6) : [];
  const spotlightCards = cardsData?.content || [];

  return (
    <div className="relative">
      <div className="absolute inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute top-[10%] left-1/2 -translate-x-1/2 w-125 h-125 bg-cyan-accent/5 rounded-full blur-[120px] opacity-60"></div>
        <div className="absolute top-[25%] left-1/4 w-75 h-75 bg-gold-accent/5 rounded-full blur-[100px] opacity-40"></div>
      </div>

      <section className="relative py-24 px-6 text-center flex flex-col items-center justify-center overflow-hidden">
        <h1 className="font-display text-5xl md:text-6xl font-black mb-6 leading-tight tracking-wide text-white">
          Step Into Your Deck Lab
        </h1>
        <p className="text-base md:text-lg text-slate-400 max-w-2xl mb-12 font-light leading-relaxed">
          Construct, analyze, and simulate Yu-Gi-Oh! decks with advanced statistics, real-time
          archetype analysis, and community-driven insights.
        </p>

        <SearchBar />
      </section>

      <section className="border-t border-b border-border-dim/40 bg-dark-surface/10 py-16 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-xl mx-auto mb-12">
            <h2 className="font-display text-3xl font-bold tracking-wide text-white mb-3">
              Built for Modern Duelists
            </h2>
            <p className="text-sm text-slate-400 font-light">
              Deck Lab provides the tools you need to stay ahead of the meta.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-dark-surface/40 border border-border-dim/60 rounded-xl p-6 hover:border-border-glow/50 transition-all duration-300 hover:-translate-y-1">
              <div className="w-10 h-10 rounded-lg bg-cyan-accent/10 text-cyan-accent flex items-center justify-center mb-4">
                <Compass className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Search Everything</h3>
              <p className="text-xs text-slate-400 leading-relaxed font-light">
                Instantly search through cards, archetypes, and text. Find custom specs, attack
                thresholds, and attributes.
              </p>
            </div>

            <div className="bg-dark-surface/40 border border-border-dim/60 rounded-xl p-6 hover:border-border-glow/50 transition-all duration-300 hover:-translate-y-1">
              <div className="w-10 h-10 rounded-lg bg-gold-accent/10 text-gold-accent flex items-center justify-center mb-4">
                <Layers className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Flexible Formats</h3>
              <p className="text-xs text-slate-400 leading-relaxed font-light">
                Whether you play TCG, OCG, Goat, or Speed Duel, filter and construct your deck
                matching format validation guidelines.
              </p>
            </div>

            <div className="bg-dark-surface/40 border border-border-dim/60 rounded-xl p-6 hover:border-border-glow/50 transition-all duration-300 hover:-translate-y-1">
              <div className="w-10 h-10 rounded-lg bg-cyan-accent/10 text-cyan-accent flex items-center justify-center mb-4">
                <Flame className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Spotlight & Trends</h3>
              <p className="text-xs text-slate-400 leading-relaxed font-light">
                Browse trending decklists created by the community. Stay up to date with new
                strategies and cards catalog updates.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto py-20 px-6">
        <div className="flex justify-between items-end mb-10 border-b border-border-dim/60 pb-4">
          <div className="flex items-center gap-2.5">
            <Trophy className="w-6 h-6 text-gold-accent" />
            <h2 className="font-display text-2xl font-bold tracking-wider text-white">
              Trending Decks
            </h2>
          </div>
          <Link
            to="/decks"
            className="text-cyan-accent no-underline text-sm font-semibold hover:text-cyan-hover hover:underline transition-colors duration-200"
          >
            View All Decks
          </Link>
        </div>

        {decksLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, idx) => (
              <div
                key={idx}
                className="bg-dark-surface border border-border-dim rounded-lg p-5 min-h-56 animate-pulse flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <div className="h-4 bg-slate-700 rounded w-16"></div>
                    <div className="h-4 bg-slate-700 rounded w-24"></div>
                  </div>
                  <div className="h-6 bg-slate-700 rounded w-3/4"></div>
                  <div className="space-y-2">
                    <div className="h-3 bg-slate-700 rounded"></div>
                    <div className="h-3 bg-slate-700 rounded w-5/6"></div>
                  </div>
                </div>
                <div className="h-4 bg-slate-700 rounded w-1/2 mt-4"></div>
              </div>
            ))}
          </div>
        ) : decksError ? (
          <div className="text-center py-12 bg-red-950/10 border border-red-500/20 rounded-lg p-6">
            <p className="text-red-400 font-semibold mb-2">Failed to load trending decks</p>
            <p className="text-xs text-slate-500 mb-4">{decksError.message}</p>
          </div>
        ) : decks.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {decks.map((deck) => {
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
                />
              );
            })}
          </div>
        ) : (
          <div className="text-center py-12 border border-dashed border-border-dim rounded-lg bg-dark-surface/10">
            <p className="text-slate-400 text-sm">
              No decks available. Log in and create the first deck!
            </p>
          </div>
        )}
      </section>

      <section className="max-w-7xl mx-auto pb-24 px-6">
        <div className="flex justify-between items-end mb-10 border-b border-border-dim/60 pb-4">
          <div className="flex items-center gap-2.5">
            <Sparkles className="w-6 h-6 text-cyan-accent" />
            <h2 className="font-display text-2xl font-bold tracking-wider text-white">
              Card Spotlight
            </h2>
          </div>
          <Link
            to="/cards"
            className="text-cyan-accent no-underline text-sm font-semibold hover:text-cyan-hover hover:underline transition-colors duration-200"
          >
            Explore Cards
          </Link>
        </div>

        {cardsLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, idx) => (
              <div
                key={idx}
                className="bg-dark-surface border border-border-dim rounded-lg overflow-hidden animate-pulse flex flex-col min-h-60"
              >
                <div className="aspect-video bg-slate-700"></div>
                <div className="p-4 flex-1 space-y-3">
                  <div className="h-4 bg-slate-700 rounded w-1/4"></div>
                  <div className="h-5 bg-slate-700 rounded w-3/4"></div>
                  <div className="h-3 bg-slate-700 rounded"></div>
                </div>
              </div>
            ))}
          </div>
        ) : cardsError ? (
          <div className="text-center py-12 bg-red-950/10 border border-red-500/20 rounded-lg p-6">
            <p className="text-red-400 font-semibold mb-2">Failed to load spotlight cards</p>
            <p className="text-xs text-slate-500 mb-4">{cardsError.message}</p>
          </div>
        ) : spotlightCards.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {spotlightCards.map((card) => (
              <CardGridItem key={card.id} {...card} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12 border border-dashed border-border-dim rounded-lg bg-dark-surface/10">
            <p className="text-slate-400 text-sm">No cards available in the database.</p>
          </div>
        )}
      </section>
    </div>
  );
}
