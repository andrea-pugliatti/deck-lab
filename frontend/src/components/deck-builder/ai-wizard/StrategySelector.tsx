import Label from "../../ui/Label";

export interface StrategyOption {
  label: string;
  value: string;
  description: string;
}

export const strategies: StrategyOption[] = [
  {
    label: "None (Standard)",
    value: "None",
    description: "Build a standard, balanced deck following the archetype's core style.",
  },
  {
    label: "Combo / Synchro Spam",
    value: "Combo",
    description:
      "Focuses on explosive special summon chains, search effects, and boss monster boards.",
  },
  {
    label: "Control / Stun",
    value: "Control",
    description: "Focuses on counter-traps, hand traps, negates, and resource denial.",
  },
  {
    label: "Aggro / OTK",
    value: "Aggro",
    description: "Focuses on high attack stats, board wipes, and quick One-Turn Kills.",
  },
  {
    label: "Midrange",
    value: "Midrange",
    description:
      "A balanced hybrid focusing on recurring resource loops, consistency, and grind game.",
  },
  {
    label: "Going Second",
    value: "Going Second",
    description: "Optimized with board breakers and hand traps to break opposing setups.",
  },
  {
    label: "Stall / Burn",
    value: "Stall/Burn",
    description: "Uses defense, negation, stalling tactics, and direct burn damage to win.",
  },
  {
    label: "Pure Archetype",
    value: "Pure",
    description: "Stick strictly to cards of the chosen archetype for a thematic build.",
  },
];

export interface StrategySelectorProps {
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
}

export default function StrategySelector({
  value,
  onChange,
  disabled = false,
}: StrategySelectorProps) {
  const currentStrategy = strategies.find((s) => s.value === value);

  return (
    <div>
      <Label>Playstyle Strategy</Label>
      <div className="grid grid-cols-2 gap-2 mt-1.5">
        {strategies.map((strat) => (
          <button
            key={strat.value}
            type="button"
            onClick={() => onChange(strat.value)}
            disabled={disabled}
            title={strat.description}
            className={`px-3 py-2 text-xs rounded-xl font-semibold border transition-all text-center cursor-pointer select-none
              ${
                value === strat.value
                  ? "bg-cyan-950/40 border-cyan-accent text-cyan-accent shadow-md shadow-cyan-accent/10"
                  : "border-border-dim text-slate-400 bg-dark-surface-elevated hover:border-slate-500 hover:text-slate-200"
              }
            `}
          >
            {strat.label}
          </button>
        ))}
      </div>
      {currentStrategy && (
        <p className="mt-2 text-[10px] text-slate-400 italic bg-dark-bg/40 px-3 py-1.5 rounded-lg border border-border-dim/30">
          {currentStrategy.description}
        </p>
      )}
    </div>
  );
}
