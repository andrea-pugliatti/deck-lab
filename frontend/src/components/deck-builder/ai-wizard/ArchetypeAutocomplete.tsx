import { useState, useEffect } from "react";
import Input from "../../ui/Input";
import Label from "../../ui/Label";

export interface ArchetypeAutocompleteProps {
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
  archetypes: string[];
}

export default function ArchetypeAutocomplete({
  value,
  onChange,
  disabled = false,
  archetypes = [],
}: ArchetypeAutocompleteProps) {
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  useEffect(() => {
    if (!value.trim() || !archetypes.length) {
      setSuggestions([]);
      return;
    }
    const filtered = archetypes
      .filter((arch) => arch.toLowerCase().includes(value.toLowerCase()))
      .slice(0, 5);
    setSuggestions(filtered);
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
        <ul className="absolute z-10 w-full bg-dark-surface-elevated border border-border-dim rounded-lg mt-1 overflow-hidden shadow-xl">
          {suggestions.map((sug, idx) => (
            <li key={idx}>
              <button
                type="button"
                onClick={() => {
                  onChange(sug);
                  setShowSuggestions(false);
                }}
                className="w-full text-left px-4 py-2 text-xs text-slate-300 hover:bg-gold-accent hover:text-dark-bg transition-colors cursor-pointer"
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
