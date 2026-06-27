import { AlertTriangle, CheckCircle } from "lucide-react";

export interface DeckValidationErrorsProps {
  validationSuccess: boolean;
  validationErrors: string[];
  submitError?: string;
}

export default function DeckValidationErrors({
  validationSuccess,
  validationErrors,
  submitError,
}: DeckValidationErrorsProps) {
  if (!validationSuccess && validationErrors.length === 0 && !submitError) {
    return null;
  }

  return (
    <div className="animate-fade-in">
      {validationSuccess && (
        <div className="bg-emerald-950/20 border border-emerald-500/30 text-emerald-400 p-4 flex items-start gap-2.5 text-xs rounded-xl shadow-md">
          <CheckCircle className="w-4 h-4 shrink-0 text-emerald-400 mt-0.5" />
          <div>
            <span className="font-bold block mb-0.5">Deck is Valid!</span>
            Your deck list complies with all format limits and rules.
          </div>
        </div>
      )}

      {(validationErrors.length > 0 || submitError) && (
        <div className="bg-red-950/20 border border-red-500/30 text-red-400 p-4 space-y-2 text-xs rounded-xl shadow-md">
          <div className="flex items-start gap-2.5">
            <AlertTriangle className="w-4 h-4 shrink-0 text-red-400 mt-0.5" />
            <div>
              <span className="font-bold block mb-0.5">Deck Validation Failed</span>
              Please fix the following problems:
            </div>
          </div>
          <ul className="list-disc pl-8 space-y-1 mt-1 font-light">
            {submitError && <li className="font-semibold">{submitError}</li>}
            {validationErrors.map((err, idx) => (
              <li key={idx}>{err}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
