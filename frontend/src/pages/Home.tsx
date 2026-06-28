import { Compass, Flame, Layers, Sparkles, Trophy } from "lucide-react";
import { Link } from "react-router";
import CardGridItem from "../components/card/CardGridItem";
import DeckCard from "../components/deck/DeckCard";
import HeroCardShowcase from "../components/HeroCardShowcase";
import SearchBar from "../components/SearchBar";
import { useFetch } from "../hooks/useFetch";
import { getCardsEndpoint } from "../services/card";
import { getDecksEndpoint } from "../services/deck";
import type { Card, Deck, Page } from "../types";

const spotlightParams = new URLSearchParams({ size: "6" });
const heroShowcaseParams = new URLSearchParams({ q: "", type: "Effect Monster", size: "3" });
export default function Home() {
  const {
    data: decksData,
    loading: decksLoading,
    error: decksError,
  } = useFetch<Deck[]>(getDecksEndpoint());
  const {
    data: cardsData,
    loading: cardsLoading,
    error: cardsError,
  } = useFetch<Page<Card>>(getCardsEndpoint(spotlightParams));
  const { data: heroShowcaseCardsData, loading: heroShowcaseCardsLoading } = useFetch<Page<Card>>(
    getCardsEndpoint(new URLSearchParams(heroShowcaseParams)),
  );

  const decks = decksData ? decksData.slice(0, 6) : [];
  const spotlightCards = cardsData?.content || [];
  const heroShowcaseCards = heroShowcaseCardsData?.content || [];

  return (
    <div className="relative">
      {/* Hero Section */}
      <section className="relative bg-dark-bg py-12 sm:py-20 lg:py-24 border-b border-b-border-dim/20">
        <div className="absolute top-[8%] left-[70%] -translate-x-1/2 w-150 h-150 bg-cyan-accent/5 rounded-full blur-[130px] opacity-75 animate-pulse-glow pointer-events-none"></div>
        <div className="absolute top-[18%] left-[15%] w-100 h-100 bg-gold-accent/10 rounded-full blur-[110px] opacity-50 pointer-events-none"></div>

        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-6 items-center">
            <div className="lg:col-span-7 flex flex-col text-left items-start order-2 lg:order-1">
              <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-black leading-tight tracking-wide text-white">
                Step Into Your{" "}
              </h1>
              <h1 className="font-display text-6xl sm:text-7xl lg:text-8xl font-black mb-6 leading-tight tracking-wide bg-clip-text text-transparent bg-linear-to-r  from-cyan-accent to-gold-accent bg-300% drop-shadow-[0_0_15px_rgba(95,227,217,0.15)]">
                Deck Lab
              </h1>
              <p className="text-base sm:text-lg text-slate-400 max-w-xl mb-10 font-light leading-relaxed">
                Construct, analyze, and simulate Yu-Gi-Oh! decks with advanced statistics, real-time
                archetype analysis, and community-driven insights.
              </p>

              <div className="w-full">
                <SearchBar />
              </div>
            </div>

            <div className="lg:col-span-5 w-full flex justify-center items-center order-1 lg:order-2">
              <HeroCardShowcase cards={heroShowcaseCards} loading={heroShowcaseCardsLoading} />
            </div>
          </div>
        </div>
      </section>

      <section className="relative bg-dark-surface/35 py-20 border-b border-b-border-dim/20 overflow-hidden">
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none"></div>
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="text-center max-w-xl mx-auto mb-16">
            <h2 className="font-display text-3xl sm:text-4xl font-bold tracking-wide text-white mb-4">
              Built for Modern Duelists
            </h2>
            <p className="text-sm sm:text-base text-slate-400 font-light max-w-md mx-auto">
              Deck Lab provides the state-of-the-art tools you need to stay ahead of the metagame.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-dark-surface/40 backdrop-blur-sm border border-border-dim/60 rounded-2xl p-8 hover:border-cyan-accent/40 hover:bg-dark-surface-elevated/40 hover:shadow-[0_4px_30px_rgba(95,227,217,0.06)] transition-all duration-300 group cursor-default">
              <div className="w-12 h-12 rounded-xl bg-cyan-accent/10 text-cyan-accent flex items-center justify-center mb-6 group-hover:bg-cyan-accent/20 transition-all duration-300">
                <Compass className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3 group-hover:text-cyan-accent transition-colors">
                Search Everything
              </h3>
              <p className="text-sm text-slate-400 leading-relaxed font-light">
                Instantly search through cards, archetypes, and text. Find custom specs, attack
                thresholds, and attributes.
              </p>
            </div>

            <div className="bg-dark-surface/40 backdrop-blur-sm border border-border-dim/60 rounded-2xl p-8 hover:border-gold-accent/40 hover:bg-dark-surface-elevated/40 hover:shadow-[0_4px_30px_rgba(226,197,111,0.06)] transition-all duration-300 group cursor-default">
              <div className="w-12 h-12 rounded-xl bg-gold-accent/10 text-gold-accent flex items-center justify-center mb-6 group-hover:bg-gold-accent/20 transition-all duration-300">
                <Layers className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3 group-hover:text-gold-accent transition-colors">
                Flexible Formats
              </h3>
              <p className="text-sm text-slate-400 leading-relaxed font-light">
                Whether you play TCG, OCG, Goat, or Speed Duel, filter and construct your deck
                matching format validation guidelines.
              </p>
            </div>

            <div className="bg-dark-surface/40 backdrop-blur-sm border border-border-dim/60 rounded-2xl p-8 hover:border-red-500/40 hover:bg-dark-surface-elevated/40 hover:shadow-[0_4px_30px_rgba(95,227,217,0.06)] group-hover:bg-red-500/20 transition-all duration-300 group cursor-default">
              <div className="w-12 h-12 rounded-xl bg-red-500/10 text-red-500 flex items-center justify-center mb-6 group-hover:bg-red-500/20 transition-all duration-300">
                <Flame className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3 group-hover:text-red-500 transition-colors">
                Spotlight & Trends
              </h3>
              <p className="text-sm text-slate-400 leading-relaxed font-light">
                Browse trending decklists created by the community. Stay up to date with new
                strategies and cards catalog updates.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Trending Decks Section */}
      <section className="relative bg-dark-bg py-20 border-b border-b-border-dim/20 overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="flex justify-between items-end mb-10 border-b border-border-dim/40 pb-4">
            <div className="flex items-center gap-3">
              <div className="w-1 h-6 rounded-full bg-gold-accent"></div>
              <h2 className="font-display text-2xl font-bold tracking-wider text-white flex items-center gap-2">
                <Trophy className="w-5 h-5 text-gold-accent" /> Trending Decks
              </h2>
            </div>
            <Link
              to="/decks"
              viewTransition
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
                const cardCount =
                  deck.deckCards?.reduce((acc, c) => acc + (c.quantity || 0), 0) || 0;
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
        </div>
      </section>

      {/* Card Spotlight Section */}
      <section className="relative bg-dark-bg py-20 overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="flex justify-between items-end mb-10 border-b border-border-dim/40 pb-4">
            <div className="flex items-center gap-3">
              <div className="w-1 h-6 rounded-full bg-cyan-accent"></div>
              <h2 className="font-display text-2xl font-bold tracking-wider text-white flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-cyan-accent" /> Card Spotlight
              </h2>
            </div>
            <Link
              to="/cards"
              viewTransition
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
        </div>
      </section>
    </div>
  );
}
