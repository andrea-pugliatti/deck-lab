import { AlertTriangle } from "lucide-react";

import Button from "../../ui/Button";

export interface WizardWarningsProps {
  warnings: string[];
  onClose: () => void;
}

export default function WizardWarnings({ warnings, onClose }: WizardWarningsProps) {
  return (
    <div className="animate-fade-in mb-4 flex flex-col gap-1.5 rounded-xl border border-amber-800/60 bg-amber-950/40 p-3 text-xs text-amber-200">
      <div className="flex items-center gap-2 font-bold text-amber-400">
        <AlertTriangle className="h-4 w-4 shrink-0" />
        <span>Deck Generated with Validation Warnings:</span>
      </div>
      <ul className="list-disc space-y-1 pl-5">
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
        className="mt-2 self-end border-amber-800 text-amber-300 hover:bg-amber-900/30"
      >
        Acknowledge & Close
      </Button>
    </div>
  );
}
