import { useMemo, useState } from "react";

import Input from "../../ui/Input";
import Label from "../../ui/Label";

/**
 * Props for the {@link ArchetypeAutocomplete} component.
 */
export interface ArchetypeAutocompleteProps {
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
  archetypes: string[];
}

/**
 * ArchetypeAutocomplete is an input component with auto-suggest capability,
 * assisting users in searching and selecting from a list of valid deck archetypes.
 *
 * @param props - The component props.
 * @returns The rendered ArchetypeAutocomplete component.
 */
export default function ArchetypeAutocomplete({
  value,
  onChange,
  disabled = false,
  archetypes = [],
}: ArchetypeAutocompleteProps) {
  const [showSuggestions, setShowSuggestions] = useState(false);

  const suggestions = useMemo(() => {
    if (!value.trim() || !archetypes.length) {
      return [];
    }
    return archetypes
      .filter((arch) => arch.toLowerCase().includes(value.toLowerCase()))
      .slice(0, 5);
  }, [value, archetypes]);

  return (
    <div className="relative">
      <Label htmlFor="archetype">Archetype / Core Theme</Label>
      <Input
        id="archetype"
        value={value}
        onChange={(e) => {
          onChange(e.target.value);
          setShowSuggestions(true);
        }}
        onFocus={() => setShowSuggestions(true)}
        onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
        placeholder="e.g. Blue-Eyes, Lightsworn, Cyber Dragon"
        autoComplete="off"
        disabled={disabled}
        className="mt-1"
        required
      />
      {showSuggestions && suggestions.length > 0 && (
        <ul className="bg-dark-surface-elevated border-border-dim absolute z-10 mt-1 w-full overflow-hidden rounded-lg border shadow-xl">
          {suggestions.map((sug, idx) => (
            <li key={idx}>
              <button
                type="button"
                onClick={() => {
                  onChange(sug);
                  setShowSuggestions(false);
                }}
                className="hover:bg-gold-accent hover:text-dark-bg w-full cursor-pointer px-4 py-2 text-left text-xs text-slate-300 transition-colors"
              >
                {sug}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
