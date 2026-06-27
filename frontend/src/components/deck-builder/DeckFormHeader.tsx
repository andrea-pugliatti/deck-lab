import { Layers } from "lucide-react";
import { useCatalogSearch } from "../../context/CatalogSearchContext";
import { useDeckStateContext } from "../../context/DeckStateContext";
import Input from "../ui/Input";
import Label from "../ui/Label";
import Select from "../ui/Select";
import Textarea from "../ui/Textarea";

export default function DeckFormHeader() {
  const { name, setName, description, setDescription, formatName, setFormatName } =
    useDeckStateContext();
  const { formats } = useCatalogSearch();

  return (
    <div className="bg-dark-surface border border-border-dim rounded-2xl p-5 shadow-md space-y-4">
      <h2 className="font-display text-sm font-bold text-white flex items-center gap-2 pb-2 border-b border-border-dim/60">
        <Layers className="w-4 h-4 text-gold-accent" />
        Deck Blueprint Settings
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
        <div className="md:col-span-8">
          <Label>Deck Name</Label>
          <Input
            type="text"
            placeholder="Enter deck name..."
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>

        <div className="md:col-span-4">
          <Label>Legality Format</Label>
          <Select value={formatName} onChange={(e) => setFormatName(e.target.value)}>
            {formats.map((f) => (
              <option key={f} value={f}>
                {f}
              </option>
            ))}
          </Select>
        </div>

        <div className="md:col-span-12">
          <Label>Strategy / Notes (Optional)</Label>
          <Textarea
            placeholder="Write notes about your deck build, key combos, or strategy..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>
      </div>
    </div>
  );
}
