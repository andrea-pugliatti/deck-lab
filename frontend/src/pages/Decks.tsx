import { useState } from "react";
import DeckListItem from "../components/DeckListItem";
import type { DeckListItemProps } from "../components/DeckListItem";
import PageHeader from "../components/PageHeader";
import FormatSelector from "../components/FormatSelector";
import { Search, Plus, Filter } from "lucide-react";

const MOCK_DECKS: DeckListItemProps[] = [
  {
    id: 1,
    name: "Snake-Eye Fire King",
    description: "Standard TCG post-PHNI deck focused on fire combos, recursion, and hand traps.",
    formatName: "TCG",
    cardCount: 40,
    updatedAt: "2 hours ago",
  },
  {
    id: 2,
    name: "Chaos Thunder Goat",
    description:
      "Classic 2005 format deck utilizing Chaos Sorcerer, Thunder Dragon, and card advantage.",
    formatName: "Goat",
    cardCount: 40,
    updatedAt: "1 day ago",
  },
  {
    id: 3,
    name: "Tenpai Dragon OTK",
    description:
      "Aggressive go-second deck designed to deal massive battle damage during the battle phase.",
    formatName: "TCG",
    cardCount: 41,
    updatedAt: "3 days ago",
  },
  {
    id: 4,
    name: "Speed Duel Blue-Eyes",
    description: "Kaiba skill card synergy with Blue-Eyes White Dragon and heavy beatdown tactics.",
    formatName: "Speed Duel",
    cardCount: 20,
    updatedAt: "1 week ago",
  },
];

export default function Decks() {
  const [selectedFormat, setSelectedFormat] = useState("ALL");
  const formats = ["ALL", "TCG", "OCG", "Goat", "Speed Duel"];

  const filteredDecks =
    selectedFormat === "ALL"
      ? MOCK_DECKS
      : MOCK_DECKS.filter((deck) => deck.formatName.toLowerCase() === selectedFormat.toLowerCase());

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      <PageHeader
        title="My Decks"
        description="Create, edit, and manage your deck builds and format experiments."
      >
        <button
          className="flex items-center gap-2 bg-gold-accent hover:bg-gold-hover text-dark-bg px-5 py-2.5 rounded font-sans font-semibold text-sm cursor-pointer shadow-md transition-all duration-300 transform hover:-translate-y-0.5"
          type="button"
        >
          <Plus className="w-4 h-4" />
          Construct Deck
        </button>
      </PageHeader>

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <FormatSelector
          selectedFormat={selectedFormat}
          setSelectedFormat={setSelectedFormat}
          formats={formats}
        />

        <div className="group relative flex items-center bg-dark-surface border border-border-dim rounded px-4 py-2 w-full md:max-w-xs transition-all duration-300 hover:border-border-glow focus-within:border-cyan-accent">
          <Search className="w-4 h-4 text-slate-500 mr-2 group-focus-within:text-cyan-accent" />
          <input
            type="text"
            placeholder="Search my decks..."
            className="bg-transparent border-none outline-none text-sm text-white placeholder-slate-500 w-full"
          />
        </div>
      </div>

      <div className="space-y-4">
        {filteredDecks.length > 0 ? (
          filteredDecks.map((deck) => <DeckListItem key={deck.id} {...deck} />)
        ) : (
          <div className="text-center py-16 border border-dashed border-border-dim rounded-lg bg-dark-surface/10">
            <Filter className="w-8 h-8 text-slate-600 mx-auto mb-3" />
            <p className="text-slate-400 text-sm mb-1">No decks found matching the filter.</p>
            <p className="text-slate-600 text-xs">
              Try selecting a different format or start a new build.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
