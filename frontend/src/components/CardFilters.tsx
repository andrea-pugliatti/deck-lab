import { SlidersHorizontal } from "lucide-react";

export interface CardFiltersProps {
  selectedType: string;
  setSelectedType: (type: string) => void;
  selectedAttribute: string;
  setSelectedAttribute: (attr: string) => void;
  types: string[];
  attributes: string[];
}

export default function CardFilters({
  selectedType,
  setSelectedType,
  selectedAttribute,
  setSelectedAttribute,
  types,
  attributes,
}: CardFiltersProps) {
  return (
    <div className="bg-dark-surface border border-border-dim rounded-lg p-5">
      <div className="flex items-center gap-2 mb-4 text-white pb-3 border-b border-border-dim/50">
        <SlidersHorizontal className="w-4 h-4 text-cyan-accent" />
        <h2 className="text-sm font-bold uppercase tracking-wider">Filters</h2>
      </div>

      <div className="mb-6">
        <label className="block text-xs font-semibold text-slate-400 uppercase tracking-widest mb-3">
          Card Type
        </label>
        <div className="space-y-2">
          {types.map((type) => (
            <button
              key={type}
              onClick={() => setSelectedType(type)}
              className={`w-full text-left px-3 py-2 rounded text-xs font-semibold uppercase tracking-wider border transition-all duration-200 cursor-pointer ${
                selectedType === type
                  ? "bg-cyan-accent/10 border-cyan-accent text-cyan-accent"
                  : "bg-dark-surface-elevated/50 border-border-dim/50 text-slate-400 hover:border-slate-500 hover:text-slate-200"
              }`}
              type="button"
            >
              {type === "Monster"
                ? "Monsters Only"
                : type === "Spell"
                  ? "Spells Only"
                  : type === "Trap"
                    ? "Traps Only"
                    : "All Types"}
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-xs font-semibold text-slate-400 uppercase tracking-widest mb-3">
          Attribute
        </label>
        <div className="space-y-2">
          {attributes.map((attr) => (
            <button
              key={attr}
              onClick={() => setSelectedAttribute(attr)}
              className={`w-full text-left px-3 py-2 rounded text-xs font-semibold uppercase tracking-wider border transition-all duration-200 cursor-pointer ${
                selectedAttribute === attr
                  ? "bg-cyan-accent/10 border-cyan-accent text-cyan-accent"
                  : "bg-dark-surface-elevated/50 border-border-dim/50 text-slate-400 hover:border-slate-500 hover:text-slate-200"
              }`}
              type="button"
            >
              {attr === "ALL" ? "All Attributes" : attr}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
