import Label from "../../ui/Label";

/**
 * Represents a strategic playstyle option that can be applied to the deck generator.
 */
export interface StrategyOption {
  label: string;
  value: string;
  description: string;
}

/**
 * Array of predefined deck-building playstyle strategies.
 */
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

/**
 * Props for the {@link StrategySelector} component.
 */
export interface StrategySelectorProps {
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
}

/**
 * StrategySelector renders a grid of buttons for selecting different deck playstyles,
 * along with a helper paragraph describing the currently selected playstyle strategy.
 *
 * @param props - The component props.
 * @returns The rendered StrategySelector component.
 */
export default function StrategySelector({
  value,
  onChange,
  disabled = false,
}: StrategySelectorProps) {
  const currentStrategy = strategies.find((s) => s.value === value);

  return (
    <div>
      <Label>Playstyle Strategy</Label>
      <div className="mt-1.5 grid grid-cols-2 gap-2">
        {strategies.map((strat) => (
          <button
            key={strat.value}
            type="button"
            onClick={() => onChange(strat.value)}
            disabled={disabled}
            title={strat.description}
            className={`cursor-pointer rounded-xl border px-3 py-2 text-center text-xs font-semibold transition-all select-none ${
              value === strat.value
                ? "border-cyan-accent text-cyan-accent shadow-cyan-accent/10 bg-cyan-950/40 shadow-md"
                : "border-border-dim bg-dark-surface-elevated text-slate-400 hover:border-slate-500 hover:text-slate-200"
            } `}
          >
            {strat.label}
          </button>
        ))}
      </div>
      {currentStrategy && (
        <p className="bg-dark-bg/40 border-border-dim/30 mt-2 rounded-lg border px-3 py-1.5 text-[10px] text-slate-400 italic">
          {currentStrategy.description}
        </p>
      )}
    </div>
  );
}
