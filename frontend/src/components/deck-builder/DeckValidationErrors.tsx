import { AlertTriangle, CheckCircle } from "lucide-react";

/**
 * Props for the {@link DeckValidationErrors} component.
 */
export interface DeckValidationErrorsProps {
  validationSuccess: boolean;
  validationErrors: string[];
  submitError?: string;
}

/**
 * DeckValidationErrors renders status boxes highlighting either successful validation
 * or a list of validation/submission errors that must be resolved.
 *
 * @param props - The component props.
 * @returns The rendered DeckValidationErrors component, or null if no validation/error state is present.
 */
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
        <div className="flex items-start gap-2.5 rounded-xl border border-emerald-500/30 bg-emerald-950/20 p-4 text-xs text-emerald-400 shadow-md">
          <CheckCircle className="mt-0.5 h-4 w-4 shrink-0 text-emerald-400" />
          <div>
            <span className="mb-0.5 block font-bold">Deck is Valid!</span>
            Your deck list complies with all format limits and rules.
          </div>
        </div>
      )}

      {(validationErrors.length > 0 || submitError) && (
        <div className="space-y-2 rounded-xl border border-red-500/30 bg-red-950/20 p-4 text-xs text-red-400 shadow-md">
          <div className="flex items-start gap-2.5">
            <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-red-400" />
            <div>
              <span className="mb-0.5 block font-bold">Deck Validation Failed</span>
              Please fix the following problems:
            </div>
          </div>
          <ul className="mt-1 list-disc space-y-1 pl-8 font-light">
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
