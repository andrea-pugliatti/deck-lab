import { Layers } from "lucide-react";

import Input from "../ui/Input";
import Label from "../ui/Label";
import Select from "../ui/Select";
import Textarea from "../ui/Textarea";

/**
 * Properties for the {@link DeckFormHeader} component.
 */
export interface DeckFormHeaderProps {
  name: string;
  setName: (name: string) => void;
  description: string;
  setDescription: (desc: string) => void;
  formatName: string;
  setFormatName: (format: string) => void;
  formats: string[];
}

/**
 * DeckFormHeader component renders fields to configure basic deck info,
 * including its name, format legality, and strategy details.
 *
 * @param props - The component properties.
 * @returns The rendered deck form header.
 */
export default function DeckFormHeader({
  name,
  setName,
  description,
  setDescription,
  formatName,
  setFormatName,
  formats,
}: DeckFormHeaderProps) {
  return (
    <div className="bg-dark-surface border-border-dim space-y-4 rounded-2xl border p-5 shadow-md">
      <h2 className="font-display border-border-dim/60 flex items-center gap-2 border-b pb-2 text-sm font-bold text-white">
        <Layers className="text-gold-accent h-4 w-4" />
        Deck Blueprint Settings
      </h2>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-12">
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
          <div className="flex items-center justify-between">
            <Label>Strategy / Notes (Optional)</Label>
            <span className={`mb-1 text-[10px] font-semibold tracking-wider ${description.length >= 255 ? "text-red-500" : "text-slate-500"}`}>
              {description.length} / 255
            </span>
          </div>
          <Textarea
            placeholder="Write notes about your deck build, key combos, or strategy..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            maxLength={255}
          />
        </div>
      </div>
    </div>
  );
}
