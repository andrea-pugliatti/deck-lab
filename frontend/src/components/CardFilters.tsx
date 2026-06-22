import { SlidersHorizontal } from "lucide-react";
import type { CardFiltersState } from "../types";

export interface CardFiltersProps {
  filters: CardFiltersState;
  onChange: (filters: CardFiltersState) => void;
  types: string[];
  attributes: string[];
  races: string[];
  archetypes: string[];
}

export default function CardFilters({
  filters,
  onChange,
  types,
  attributes,
  races,
  archetypes,
}: CardFiltersProps) {
  const {
    type: selectedType,
    attribute: selectedAttribute,
    race: selectedRace,
    archetype: selectedArchetype,
  } = filters;

  const spellProperties = ["Normal", "Field", "Equip", "Continuous", "Quick-Play", "Ritual"];
  const trapProperties = ["Normal", "Continuous", "Counter"];

  const filteredRaces = races.filter((race) => {
    const isSpellProp = spellProperties.includes(race);
    const isTrapProp = trapProperties.includes(race);

    if (selectedType === "Spell") {
      return isSpellProp;
    }
    if (selectedType === "Trap") {
      return isTrapProp;
    }
    if (selectedType === "Monster") {
      return !isSpellProp && !isTrapProp;
    }
    return true;
  });

  const isMonsterSelected = selectedType === "Monster" || selectedType === "ALL";

  return (
    <div className="bg-dark-surface border border-border-dim rounded-lg p-5 space-y-5">
      <div className="flex items-center gap-2 text-white pb-3 border-b border-border-dim/50">
        <SlidersHorizontal className="w-4 h-4 text-cyan-accent" />
        <h2 className="text-sm font-bold uppercase tracking-wider">Catalog Filters</h2>
      </div>

      <div>
        <label className="block text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-2">
          Card Type
        </label>
        <select
          value={selectedType}
          onChange={(e) => {
            onChange({
              ...filters,
              type: e.target.value,
              race: "ALL",
            });
          }}
          className="w-full bg-dark-surface-elevated border border-border-dim rounded px-3 py-2 text-xs text-slate-200 outline-none focus:border-cyan-accent cursor-pointer transition-colors"
        >
          <option value="ALL">All Types</option>
          {types.map((type) => (
            <option key={type} value={type}>
              {type === "Monster"
                ? "Monsters"
                : type === "Spell"
                  ? "Spells"
                  : type === "Trap"
                    ? "Traps"
                    : type}
            </option>
          ))}
        </select>
      </div>

      {isMonsterSelected && (
        <div>
          <label className="block text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-2">
            Monster Attribute
          </label>
          <select
            value={selectedAttribute}
            onChange={(e) => {
              onChange({
                ...filters,
                attribute: e.target.value,
              });
            }}
            className="w-full bg-dark-surface-elevated border border-border-dim rounded px-3 py-2 text-xs text-slate-200 outline-none focus:border-cyan-accent cursor-pointer transition-colors"
          >
            <option value="ALL">All Attributes</option>
            {attributes.map((attr) => (
              <option key={attr} value={attr}>
                {attr}
              </option>
            ))}
          </select>
        </div>
      )}

      <div>
        <label className="block text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-2">
          {selectedType === "Monster"
            ? "Monster Type (Race)"
            : selectedType === "Spell" || selectedType === "Trap"
              ? "Property"
              : "Type / Property"}
        </label>
        <select
          value={selectedRace}
          onChange={(e) => {
            onChange({
              ...filters,
              race: e.target.value,
            });
          }}
          className="w-full bg-dark-surface-elevated border border-border-dim rounded px-3 py-2 text-xs text-slate-200 outline-none focus:border-cyan-accent cursor-pointer transition-colors"
        >
          <option value="ALL">All Properties</option>
          {filteredRaces.map((race) => (
            <option key={race} value={race}>
              {race}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-2">
          Archetype Group
        </label>
        <select
          value={selectedArchetype}
          onChange={(e) => {
            onChange({
              ...filters,
              archetype: e.target.value,
            });
          }}
          className="w-full bg-dark-surface-elevated border border-border-dim rounded px-3 py-2 text-xs text-slate-200 outline-none focus:border-cyan-accent cursor-pointer transition-colors"
        >
          <option value="ALL">All Archetypes</option>
          {archetypes.map((arch) => (
            <option key={arch} value={arch}>
              {arch}
            </option>
          ))}
        </select>
      </div>

      <button
        onClick={() => {
          onChange({
            type: "ALL",
            attribute: "ALL",
            race: "ALL",
            archetype: "ALL",
          });
        }}
        className="w-full py-2 border border-dashed border-border-dim hover:border-cyan-accent text-slate-400 hover:text-cyan-accent bg-transparent hover:bg-cyan-accent/5 rounded text-xs font-semibold tracking-wider transition-all duration-200 cursor-pointer"
        type="button"
      >
        Clear Filters
      </button>
    </div>
  );
}
