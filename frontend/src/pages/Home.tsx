import DeckCard from "../components/DeckCard";
import SearchBar from "../components/SearchBar";

interface DeckMock {
  name: string;
  tier: string;
  archetype: string;
  author: string;
  views: string;
  likes: number;
}

const FEATURED_DECKS: DeckMock[] = [
  {
    name: "Snake-Eye Fire King",
    tier: "Tier 1",
    archetype: "Snake-Eye / Fire King",
    author: "DuelistX",
    views: "1.2k",
    likes: 243,
  },
  {
    name: "Tenpai Dragon OTK",
    tier: "Tier 1",
    archetype: "Tenpai Dragon",
    author: "DragonLord",
    views: "940",
    likes: 185,
  },
  {
    name: "Yubel Unchained",
    tier: "Tier 1.5",
    archetype: "Yubel / Unchained",
    author: "ShadowDuels",
    views: "810",
    likes: 154,
  },
  {
    name: "Voiceless Voice",
    tier: "Tier 2",
    archetype: "Voiceless Voice",
    author: "SacredLight",
    views: "620",
    likes: 112,
  },
  {
    name: "Branded Despia",
    tier: "Tier 2",
    archetype: "Branded / Despia",
    author: "Albaz",
    views: "1.5k",
    likes: 310,
  },
  {
    name: "Melodious Vernusylph",
    tier: "Tier 3",
    archetype: "Melodious",
    author: "OperaSinger",
    views: "430",
    likes: 68,
  },
];

export default function Home() {
  return (
    <>
      <section className="relative py-24 px-6 text-center flex flex-col items-center justify-center overflow-hidden">
        <h1 className="font-display text-5xl font-bold mb-4 leading-tight text-white">
          Step Into Your Deck Lab
        </h1>
        <p className="text-lg text-slate-400 max-w-xl mb-10 font-light">
          Construct, analyze, and simulate Yu-Gi-Oh! decks with advanced analytics and
          state-of-the-art dueling simulator.
        </p>

        <SearchBar />
      </section>

      <section className="max-w-7xl mx-auto py-16 px-6">
        <div className="flex justify-between items-end mb-8 border-b border-border-dim pb-3">
          <h2 className="font-display text-2xl font-bold tracking-wider text-white">
            Trending Decks
          </h2>
          <a
            href="#trending"
            className="text-cyan-accent no-underline text-sm font-medium hover:text-cyan-hover hover:underline transition-colors duration-200"
          >
            View All Decks
          </a>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {FEATURED_DECKS.map((deck, idx) => (
            <DeckCard key={idx} {...deck} />
          ))}
        </div>
      </section>
    </>
  );
}
