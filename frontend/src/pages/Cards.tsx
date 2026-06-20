import { useState, useEffect } from "react";
import CardGridItem from "../components/CardGridItem";
import type { CardGridItemProps } from "../components/CardGridItem";
import PageHeader from "../components/PageHeader";
import CardFilters from "../components/CardFilters";
import { Search, Filter } from "lucide-react";
import { useSearchParams } from "react-router";

const MOCK_CARDS: CardGridItemProps[] = [
  {
    id: 1,
    name: "Blue-Eyes White Dragon",
    type: "Normal Monster",
    description:
      "This legendary dragon is a powerful engine of destruction. Virtually invincible, very few have faced this awesome creature and lived to tell the tale.",
    race: "Dragon",
    attribute: "LIGHT",
    archetype: "Blue-Eyes",
    atk: 3000,
    def: 2500,
    level: 8,
  },
  {
    id: 2,
    name: "Dark Magician",
    type: "Normal Monster",
    description: "The ultimate wizard in terms of attack and defense.",
    race: "Spellcaster",
    attribute: "DARK",
    archetype: "Dark Magician",
    atk: 2500,
    def: 2100,
    level: 7,
  },
  {
    id: 3,
    name: "Pot of Greed",
    type: "Spell Card",
    description: "Draw 2 cards.",
    race: "Normal",
    attribute: "SPELL",
    atk: undefined,
    def: undefined,
  },
  {
    id: 4,
    name: "Infinite Impermanence",
    type: "Trap Card",
    description:
      "Target 1 face-up monster your opponent controls; negate its effects (until the end of this turn), then, if this card was Set before activation and is on the field at resolution, for the rest of this turn, all other Spell/Trap effects in this column are negated.",
    race: "Normal",
    attribute: "TRAP",
    atk: undefined,
    def: undefined,
  },
  {
    id: 5,
    name: "Snake-Eye Ash",
    type: "Effect Monster",
    description:
      "If this card is Normal or Special Summoned: You can add 1 Level 1 FIRE monster from your Deck to your hand. You can send 2 face-up cards you control to the GY, including this card; Special Summon 1 'Snake-Eye' monster from your hand or Deck, except 'Snake-Eye Ash'.",
    race: "Pyro",
    attribute: "FIRE",
    archetype: "Snake-Eye",
    atk: 800,
    def: 1000,
    level: 1,
  },
  {
    id: 6,
    name: "Baronne de Fleur",
    type: "Synchro Monster",
    description:
      "1 Tuner + 1+ non-Tuner monsters. Once per turn: You can target 1 card on the field; destroy it. Once while face-up on the field, when a card or effect is activated (Quick Effect): You can negate the activation, and if you do, destroy that card. Once per turn, during the Standby Phase: You can target 1 Level 9 or lower monster in your GY; return this card to the Extra Deck, and if you do, Special Summon that monster.",
    race: "Warrior",
    attribute: "WIND",
    archetype: "Fleur",
    atk: 3000,
    def: 2400,
    level: 10,
  },
];

export default function Cards() {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialQuery = searchParams.get("q") || "";
  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [selectedType, setSelectedType] = useState("ALL");
  const [selectedAttribute, setSelectedAttribute] = useState("ALL");

  const types = ["ALL", "Monster", "Spell", "Trap"];
  const attributes = ["ALL", "LIGHT", "DARK", "FIRE", "WIND"];

  // Sync state if url parameters update externally
  useEffect(() => {
    setSearchQuery(searchParams.get("q") || "");
  }, [searchParams]);

  const handleSearchChange = (val: string) => {
    setSearchQuery(val);
    if (val.trim()) {
      setSearchParams({ q: val.trim() });
    } else {
      setSearchParams({});
    }
  };

  const filteredCards = MOCK_CARDS.filter((card) => {
    const matchesSearch =
      card.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      card.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (card.archetype && card.archetype.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesType =
      selectedType === "ALL" || card.type.toLowerCase().includes(selectedType.toLowerCase());

    const matchesAttribute =
      selectedAttribute === "ALL" ||
      card.attribute === selectedAttribute ||
      (selectedAttribute === "SPELL" && card.type.includes("Spell")) ||
      (selectedAttribute === "TRAP" && card.type.includes("Trap"));

    return matchesSearch && matchesType && matchesAttribute;
  });

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      {/* Page Header */}
      <PageHeader
        title="Card Database"
        description="Browse, filter, and search the entire Yu-Gi-Oh! catalog."
      />

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Left Filter Sidebar */}
        <aside className="lg:col-span-1 space-y-6">
          <CardFilters
            selectedType={selectedType}
            setSelectedType={setSelectedType}
            selectedAttribute={selectedAttribute}
            setSelectedAttribute={setSelectedAttribute}
            types={types}
            attributes={attributes}
          />
        </aside>

        {/* Right Card Grid Area */}
        <main className="lg:col-span-3 space-y-6">
          {/* Top Search bar */}
          <div className="group relative flex items-center bg-dark-surface border border-border-dim rounded px-4 py-2.5 transition-all duration-300 hover:border-border-glow focus-within:border-cyan-accent w-full">
            <Search className="w-5 h-5 text-slate-500 mr-2 group-focus-within:text-cyan-accent" />
            <input
              type="text"
              placeholder="Search card name, type, description, or archetype..."
              value={searchQuery}
              onChange={(e) => handleSearchChange(e.target.value)}
              className="bg-transparent border-none outline-none text-sm text-white placeholder-slate-500 w-full"
            />
          </div>

          {/* Results Summary */}
          <div className="flex justify-between items-center text-xs text-slate-500">
            <span>
              Showing {filteredCards.length} of {MOCK_CARDS.length} Cards
            </span>
          </div>

          {/* Grid list */}
          {filteredCards.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredCards.map((card) => (
                <CardGridItem key={card.id} {...card} />
              ))}
            </div>
          ) : (
            <div className="text-center py-20 border border-dashed border-border-dim rounded-lg bg-dark-surface/10">
              <Filter className="w-10 h-10 text-slate-600 mx-auto mb-3" />
              <h3 className="text-slate-400 font-medium mb-1">No Cards Found</h3>
              <p className="text-slate-600 text-xs">Try adjusting your filters or search terms.</p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
