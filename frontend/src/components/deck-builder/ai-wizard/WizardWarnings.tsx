import { AlertTriangle } from "lucide-react";
import Button from "../../ui/Button";

export interface WizardWarningsProps {
  warnings: string[];
  onClose: () => void;
}

export default function WizardWarnings({ warnings, onClose }: WizardWarningsProps) {
  return (
    <div className="mb-4 p-3 bg-amber-950/40 border border-amber-800/60 rounded-xl text-amber-200 text-xs flex flex-col gap-1.5 animate-fade-in">
      <div className="flex gap-2 items-center font-bold text-amber-400">
        <AlertTriangle className="w-4 h-4 shrink-0" />
        <span>Deck Generated with Validation Warnings:</span>
      </div>
      <ul className="list-disc pl-5 space-y-1">
        {warnings.map((warning, idx) => (
          <li key={idx}>{warning}</li>
        ))}
      </ul>
      <p className="mt-1 text-[10px] text-amber-300/80">
        The deck has been loaded into your builder workspace, but does not satisfy format legality
        rules. You can edit it manually before saving.
      </p>
      <Button
        onClick={onClose}
        variant="outline"
        size="sm"
        className="mt-2 self-end text-amber-300 border-amber-800 hover:bg-amber-900/30"
      >
        Acknowledge & Close
      </Button>
    </div>
  );
}
