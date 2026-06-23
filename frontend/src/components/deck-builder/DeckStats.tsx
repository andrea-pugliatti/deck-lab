import { AlertTriangle, CheckCircle } from "lucide-react";
import { useDeckBuilder } from "../../context/DeckBuilderContext";

export default function DeckStats() {
  const { validationSuccess, validationErrors, submitError } = useDeckBuilder();

  if (!validationSuccess && validationErrors.length === 0 && !submitError) {
    return null;
  }

  return (
    <div className="rounded-xl overflow-hidden shadow-md">
      {validationSuccess && (
        <div className="bg-emerald-950/20 border border-emerald-500/30 text-emerald-400 p-4 flex items-start gap-2.5 text-xs">
          <CheckCircle className="w-4 h-4 shrink-0 text-emerald-400 mt-0.5" />
          <div>
            <span className="font-bold block mb-0.5">Deck is Valid!</span>
            Your deck list complies with all format limits and rules.
          </div>
        </div>
      )}

      {(validationErrors.length > 0 || submitError) && (
        <div className="bg-red-950/20 border border-red-500/30 text-red-400 p-4 space-y-2 text-xs">
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
