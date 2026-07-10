import { useQuery } from "@tanstack/react-query";
import { Compass, Flame, Layers, Sparkles, Trophy } from "lucide-react";
import { Link } from "react-router";

import CardGridItem from "../components/card/CardGridItem";
import DeckGridCard from "../components/deck/DeckGridCard";
import HeroCardShowcase from "../components/HeroCardShowcase";
import SearchBar from "../components/SearchBar";
import { getCards, getCardsEndpoint } from "../services/card";
import { getDecks, getDecksQueryEndpoint } from "../services/deck";
import type { Card, Deck, Page } from "../types";

/**
 * URLSearchParams configurations used to fetch spotlight/showcase items on the home landing page.
 */
const spotlightParams = new URLSearchParams({ size: "6" });
const heroShowcaseParams = new URLSearchParams({ q: "", type: "Effect Monster", size: "3" });

/**
 * Home Landing Page Component.
 *
 * Renders the main entry point of the Deck Lab application. Includes a hero banner with an interactive
 * card artwork showcase, search functionality, lists of trending deck blueprints, and spotlighted catalog cards.
 *
 * @returns {React.JSX.Element} The rendered Home landing page.
 */
export default function Home(): React.JSX.Element {
  const decksUrl = getDecksQueryEndpoint(new URLSearchParams({ size: "6" }));
  const spotlightUrl = getCardsEndpoint(spotlightParams);
  const heroShowcaseUrl = getCardsEndpoint(new URLSearchParams(heroShowcaseParams));

  const {
    data: decksData,
    isLoading: decksLoading,
    error: decksError,
  } = useQuery<Page<Deck>>({
    queryKey: ["decks", decksUrl],
    queryFn: ({ signal }) => getDecks(decksUrl, signal),
  });

  const {
    data: cardsData,
    isLoading: cardsLoading,
    error: cardsError,
  } = useQuery<Page<Card>>({
    queryKey: ["cards", spotlightUrl],
    queryFn: ({ signal }) => getCards(spotlightUrl, signal),
  });

  const { data: heroShowcaseCardsData, isLoading: heroShowcaseCardsLoading } = useQuery<Page<Card>>(
    {
      queryKey: ["cards", heroShowcaseUrl],
      queryFn: ({ signal }) => getCards(heroShowcaseUrl, signal),
    },
  );

  const decks = decksData?.content || [];
  const spotlightCards = cardsData?.content || [];
  const heroShowcaseCards = heroShowcaseCardsData?.content || [];

  return (
    <div className="relative">
      {/* Hero Section */}
      <section className="bg-dark-bg border-b-border-dim/20 relative border-b py-12 sm:py-20 lg:py-24">
        <div className="bg-cyan-accent/5 animate-pulse-glow pointer-events-none absolute top-[8%] left-[70%] h-150 w-150 -translate-x-1/2 rounded-full opacity-75 blur-[130px]"></div>
        <div className="bg-gold-accent/10 pointer-events-none absolute top-[18%] left-[15%] h-100 w-100 rounded-full opacity-50 blur-[110px]"></div>

        <div className="relative z-10 mx-auto max-w-7xl px-6">
          <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-12 lg:gap-6">
            <div className="order-2 flex flex-col items-start text-left lg:order-1 lg:col-span-7">
              <h1 className="font-display text-4xl leading-tight font-black tracking-wide text-white sm:text-5xl lg:text-6xl">
                Step Into Your{" "}
              </h1>
              <h1 className="font-display from-cyan-accent to-gold-accent bg-300% mb-6 bg-linear-to-r bg-clip-text text-6xl leading-tight font-black tracking-wide text-transparent drop-shadow-[0_0_15px_rgba(95,227,217,0.15)] sm:text-7xl lg:text-8xl">
                Deck Lab
              </h1>
              <p className="mb-10 max-w-xl text-base leading-relaxed font-light text-slate-400 sm:text-lg">
                Construct, analyze, and simulate Yu-Gi-Oh! decks with advanced statistics, real-time
                archetype analysis, and community-driven insights.
              </p>

              <div className="w-full">
                <SearchBar />
              </div>
            </div>

            <div className="order-1 flex w-full items-center justify-center lg:order-2 lg:col-span-5">
              <HeroCardShowcase cards={heroShowcaseCards} loading={heroShowcaseCardsLoading} />
            </div>
          </div>
        </div>
      </section>

      <section className="bg-dark-surface/35 border-b-border-dim/20 relative overflow-hidden border-b py-20">
        <div className="pointer-events-none absolute inset-0 opacity-[0.03]"></div>
        <div className="relative z-10 mx-auto max-w-7xl px-6">
          <div className="mx-auto mb-16 max-w-xl text-center">
            <h2 className="font-display mb-4 text-3xl font-bold tracking-wide text-white sm:text-4xl">
              Built for Modern Duelists
            </h2>
            <p className="mx-auto max-w-md text-sm font-light text-slate-400 sm:text-base">
              Deck Lab provides the state-of-the-art tools you need to stay ahead of the metagame.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            <div className="bg-dark-surface/40 border-border-dim/60 hover:border-cyan-accent/40 hover:bg-dark-surface-elevated/40 group cursor-default rounded-2xl border p-8 backdrop-blur-sm transition-all duration-300 hover:shadow-[0_4px_30px_rgba(95,227,217,0.06)]">
              <div className="bg-cyan-accent/10 text-cyan-accent group-hover:bg-cyan-accent/20 mb-6 flex h-12 w-12 items-center justify-center rounded-xl transition-all duration-300">
                <Compass className="h-6 w-6" />
              </div>
              <h3 className="group-hover:text-cyan-accent mb-3 text-xl font-bold text-white transition-colors">
                Search Everything
              </h3>
              <p className="text-sm leading-relaxed font-light text-slate-400">
                Instantly search through cards, archetypes, and text. Find custom specs, attack
                thresholds, and attributes.
              </p>
            </div>

            <div className="bg-dark-surface/40 border-border-dim/60 hover:border-gold-accent/40 hover:bg-dark-surface-elevated/40 group cursor-default rounded-2xl border p-8 backdrop-blur-sm transition-all duration-300 hover:shadow-[0_4px_30px_rgba(226,197,111,0.06)]">
              <div className="bg-gold-accent/10 text-gold-accent group-hover:bg-gold-accent/20 mb-6 flex h-12 w-12 items-center justify-center rounded-xl transition-all duration-300">
                <Layers className="h-6 w-6" />
              </div>
              <h3 className="group-hover:text-gold-accent mb-3 text-xl font-bold text-white transition-colors">
                Flexible Formats
              </h3>
              <p className="text-sm leading-relaxed font-light text-slate-400">
                Whether you play TCG, OCG, Goat, or Speed Duel, filter and construct your deck
                matching format validation guidelines.
              </p>
            </div>

            <div className="bg-dark-surface/40 border-border-dim/60 hover:bg-dark-surface-elevated/40 group cursor-default rounded-2xl border p-8 backdrop-blur-sm transition-all duration-300 group-hover:bg-red-500/20 hover:border-red-500/40 hover:shadow-[0_4px_30px_rgba(95,227,217,0.06)]">
              <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-xl bg-red-500/10 text-red-500 transition-all duration-300 group-hover:bg-red-500/20">
                <Flame className="h-6 w-6" />
              </div>
              <h3 className="mb-3 text-xl font-bold text-white transition-colors group-hover:text-red-500">
                Spotlight & Trends
              </h3>
              <p className="text-sm leading-relaxed font-light text-slate-400">
                Browse trending decklists created by the community. Stay up to date with new
                strategies and cards catalog updates.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Trending Decks Section */}
      <section className="bg-dark-bg border-b-border-dim/20 relative overflow-hidden border-b py-20">
        <div className="relative z-10 mx-auto max-w-7xl px-6">
          <div className="border-border-dim/40 mb-10 flex items-end justify-between border-b pb-4">
            <div className="flex items-center gap-3">
              <div className="bg-gold-accent h-6 w-1 rounded-full"></div>
              <h2 className="font-display flex items-center gap-2 text-2xl font-bold tracking-wider text-white">
                <Trophy className="text-gold-accent h-5 w-5" /> Trending Decks
              </h2>
            </div>
            <Link
              to="/decks"
              viewTransition
              className="text-cyan-accent hover:text-cyan-hover text-sm font-semibold no-underline transition-colors duration-200 hover:underline"
            >
              View All Decks
            </Link>
          </div>

          {decksLoading ? (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {[...Array(6)].map((_, idx) => (
                <div
                  key={idx}
                  className="bg-dark-surface border-border-dim flex min-h-56 animate-pulse flex-col justify-between rounded-lg border p-5"
                >
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <div className="h-4 w-16 rounded bg-slate-700"></div>
                      <div className="h-4 w-24 rounded bg-slate-700"></div>
                    </div>
                    <div className="h-6 w-3/4 rounded bg-slate-700"></div>
                    <div className="space-y-2">
                      <div className="h-3 rounded bg-slate-700"></div>
                      <div className="h-3 w-5/6 rounded bg-slate-700"></div>
                    </div>
                  </div>
                  <div className="mt-4 h-4 w-1/2 rounded bg-slate-700"></div>
                </div>
              ))}
            </div>
          ) : decksError ? (
            <div className="rounded-lg border border-red-500/20 bg-red-950/10 p-6 py-12 text-center">
              <p className="mb-2 font-semibold text-red-400">Failed to load trending decks</p>
              <p className="mb-4 text-xs text-slate-500">{decksError.message}</p>
            </div>
          ) : decks.length > 0 ? (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {decks.map((deck) => {
                const cardCount =
                  deck.deckCards?.reduce((acc, c) => acc + (c.quantity || 0), 0) || 0;
                return (
                  <DeckGridCard
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
            <div className="border-border-dim bg-dark-surface/10 rounded-lg border border-dashed py-12 text-center">
              <p className="text-sm text-slate-400">
                No decks available. Log in and create the first deck!
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Card Spotlight Section */}
      <section className="bg-dark-bg relative overflow-hidden py-20">
        <div className="relative z-10 mx-auto max-w-7xl px-6">
          <div className="border-border-dim/40 mb-10 flex items-end justify-between border-b pb-4">
            <div className="flex items-center gap-3">
              <div className="bg-cyan-accent h-6 w-1 rounded-full"></div>
              <h2 className="font-display flex items-center gap-2 text-2xl font-bold tracking-wider text-white">
                <Sparkles className="text-cyan-accent h-5 w-5" /> Card Spotlight
              </h2>
            </div>
            <Link
              to="/cards"
              viewTransition
              className="text-cyan-accent hover:text-cyan-hover text-sm font-semibold no-underline transition-colors duration-200 hover:underline"
            >
              Explore Cards
            </Link>
          </div>

          {cardsLoading ? (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {[...Array(6)].map((_, idx) => (
                <div
                  key={idx}
                  className="bg-dark-surface border-border-dim flex min-h-60 animate-pulse flex-col overflow-hidden rounded-lg border"
                >
                  <div className="aspect-video bg-slate-700"></div>
                  <div className="flex-1 space-y-3 p-4">
                    <div className="h-4 w-1/4 rounded bg-slate-700"></div>
                    <div className="h-5 w-3/4 rounded bg-slate-700"></div>
                    <div className="h-3 rounded bg-slate-700"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : cardsError ? (
            <div className="rounded-lg border border-red-500/20 bg-red-950/10 p-6 py-12 text-center">
              <p className="mb-2 font-semibold text-red-400">Failed to load spotlight cards</p>
              <p className="mb-4 text-xs text-slate-500">{cardsError.message}</p>
            </div>
          ) : spotlightCards.length > 0 ? (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {spotlightCards.map((card) => (
                <CardGridItem key={card.id} {...card} />
              ))}
            </div>
          ) : (
            <div className="border-border-dim bg-dark-surface/10 rounded-lg border border-dashed py-12 text-center">
              <p className="text-sm text-slate-400">No cards available in the database.</p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
