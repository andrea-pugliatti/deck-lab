import { SlidersHorizontal } from "lucide-react";

import type { CardFiltersState } from "../../types";
import Button from "../ui/Button";
import Label from "../ui/Label";
import Select from "../ui/Select";

/**
 * Properties for the {@link CardFilters} component.
 */
export interface CardFiltersProps {
  filters: CardFiltersState;
  onChange: (filters: CardFiltersState) => void;
  types: string[];
  attributes: string[];
  races: string[];
  archetypes: string[];
}

/**
 * CardFilters component provides a user interface with dropdown menus
 * for filtering cards based on type, monster attribute, race/property, and archetype.
 *
 * @param props - The component properties.
 * @returns The rendered card filters panel.
 */
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
    <div className="bg-dark-surface border-border-dim space-y-5 rounded-lg border p-5">
      <div className="border-border-dim/50 flex items-center gap-2 border-b pb-3 text-white">
        <SlidersHorizontal className="text-cyan-accent h-4 w-4" />
        <h2 className="text-sm font-bold tracking-wider uppercase">Catalog Filters</h2>
      </div>

      <div>
        <Label htmlFor="card-type" className="mb-2">
          Card Type
        </Label>
        <Select
          id="card-type"
          value={selectedType}
          onChange={(e) => {
            onChange({
              ...filters,
              type: e.target.value,
              race: "ALL",
            });
          }}
          className="text-xs"
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
        </Select>
      </div>

      {isMonsterSelected && (
        <div>
          <Label htmlFor="monster-attribute" className="mb-2">
            Monster Attribute
          </Label>
          <Select
            id="monster-attribute"
            value={selectedAttribute}
            onChange={(e) => {
              onChange({
                ...filters,
                attribute: e.target.value,
              });
            }}
            className="text-xs"
          >
            <option value="ALL">All Attributes</option>
            {attributes.map((attr) => (
              <option key={attr} value={attr}>
                {attr}
              </option>
            ))}
          </Select>
        </div>
      )}

      <div>
        <Label htmlFor="race-property" className="mb-2">
          {selectedType === "Monster"
            ? "Monster Type (Race)"
            : selectedType === "Spell" || selectedType === "Trap"
              ? "Property"
              : "Type / Property"}
        </Label>
        <Select
          id="race-property"
          value={selectedRace}
          onChange={(e) => {
            onChange({
              ...filters,
              race: e.target.value,
            });
          }}
          className="text-xs"
        >
          <option value="ALL">All Properties</option>
          {filteredRaces.map((race) => (
            <option key={race} value={race}>
              {race}
            </option>
          ))}
        </Select>
      </div>

      <div>
        <Label htmlFor="archetype-group" className="mb-2">
          Archetype Group
        </Label>
        <Select
          id="archetype-group"
          value={selectedArchetype}
          onChange={(e) => {
            onChange({
              ...filters,
              archetype: e.target.value,
            });
          }}
          className="text-xs"
        >
          <option value="ALL">All Archetypes</option>
          {archetypes.map((arch) => (
            <option key={arch} value={arch}>
              {arch}
            </option>
          ))}
        </Select>
      </div>

      <Button
        variant="outline"
        onClick={() => {
          onChange({
            type: "ALL",
            attribute: "ALL",
            race: "ALL",
            archetype: "ALL",
          });
        }}
        className="border-border-dim hover:border-cyan-accent hover:text-cyan-accent hover:bg-cyan-accent/5 w-full cursor-pointer rounded border border-dashed bg-transparent py-2 text-xs font-semibold tracking-wider text-slate-400 transition-all duration-200"
        type="button"
      >
        Clear Filters
      </Button>
    </div>
  );
}
