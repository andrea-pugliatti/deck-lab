import { Search } from "lucide-react";
import { useDeckBuilder } from "../../context/DeckBuilderContext";
import Input from "../ui/Input";
import Select from "../ui/Select";
import Label from "../ui/Label";

export default function DeckBuilderFilters() {
  const { searchQuery, setSearchQuery, filters, setFilters, types, attributes, races, archetypes } =
    useDeckBuilder();

  const { type, attribute, race, archetype } = filters;

  const spellProperties = ["Normal", "Field", "Equip", "Continuous", "Quick-Play", "Ritual"];
  const trapProperties = ["Normal", "Continuous", "Counter"];

  const filteredRaces = races.filter((r) => {
    const isSpellProp = spellProperties.includes(r);
    const isTrapProp = trapProperties.includes(r);

    if (type === "Spell") return isSpellProp;
    if (type === "Trap") return isTrapProp;
    if (type === "Monster") return !isSpellProp && !isTrapProp;
    return true;
  });

  return (
    <div className="space-y-3 mb-4">
      <Input
        type="text"
        placeholder="Search catalog by name..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        icon={<Search className="w-4 h-4" />}
        className="text-xs placeholder-slate-500 py-1.5"
      />

      <div className="grid grid-cols-2 gap-2 text-xs">
        <div>
          <Label>Type</Label>
          <Select
            value={type}
            onChange={(e) => {
              setFilters((prev) => ({
                ...prev,
                type: e.target.value,
                race: "ALL",
              }));
            }}
            className="py-1.5 text-xs"
          >
            <option value="ALL">All Types</option>
            {types.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </Select>
        </div>

        <div>
          <Label>Attribute</Label>
          <Select
            value={attribute}
            disabled={type === "Spell" || type === "Trap"}
            onChange={(e) => {
              setFilters((prev) => ({
                ...prev,
                attribute: e.target.value,
              }));
            }}
            className="py-1.5 text-xs"
          >
            <option value="ALL">All Attributes</option>
            {attributes.map((a) => (
              <option key={a} value={a}>
                {a}
              </option>
            ))}
          </Select>
        </div>

        <div>
          <Label>Property / Race</Label>
          <Select
            value={race}
            onChange={(e) => {
              setFilters((prev) => ({
                ...prev,
                race: e.target.value,
              }));
            }}
            className="py-1.5 text-xs"
          >
            <option value="ALL">All Properties</option>
            {filteredRaces.map((r) => (
              <option key={r} value={r}>
                {r}
              </option>
            ))}
          </Select>
        </div>

        <div>
          <Label>Archetype</Label>
          <Select
            value={archetype}
            onChange={(e) => {
              setFilters((prev) => ({
                ...prev,
                archetype: e.target.value,
              }));
            }}
            className="py-1.5 text-xs"
          >
            <option value="ALL">All Archetypes</option>
            {archetypes.map((arch) => (
              <option key={arch} value={arch}>
                {arch}
              </option>
            ))}
          </Select>
        </div>
      </div>
    </div>
  );
}
