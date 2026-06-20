export interface FormatSelectorProps {
  selectedFormat: string;
  setSelectedFormat: (format: string) => void;
  formats: string[];
}

export default function FormatSelector({
  selectedFormat,
  setSelectedFormat,
  formats,
}: FormatSelectorProps) {
  return (
    <div className="flex gap-2 flex-wrap">
      {formats.map((format) => (
        <button
          key={format}
          onClick={() => setSelectedFormat(format)}
          className={`px-4 py-2 rounded text-xs font-semibold uppercase tracking-wider border cursor-pointer transition-all duration-200 ${
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
