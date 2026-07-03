/**
 * Properties for the {@link FormatSelector} component.
 */
export interface FormatSelectorProps {
  selectedFormat: string;
  setSelectedFormat: (format: string) => void;
  formats: string[];
}

/**
 * FormatSelector component renders a horizontal list of buttons representing game formats.
 * It highlights the active selection and calls a state updater when another format is clicked.
 *
 * @param props - The component properties.
 * @returns The rendered format selector component.
 */
export default function FormatSelector({
  selectedFormat,
  setSelectedFormat,
  formats,
}: FormatSelectorProps) {
  return (
    <div className="flex flex-wrap gap-2">
      {formats.map((format) => (
        <button
          key={format}
          onClick={() => setSelectedFormat(format)}
          className={`cursor-pointer rounded border px-4 py-2 text-xs font-semibold tracking-wider uppercase transition-all duration-200 ${
            selectedFormat === format
              ? "bg-cyan-accent/10 border-cyan-accent text-cyan-accent"
              : "bg-dark-surface border-border-dim text-slate-400 hover:border-slate-500 hover:text-slate-200"
          }`}
          type="button"
        >
          {format}
        </button>
      ))}
    </div>
  );
}
