import LoadingSpinner from "../../LoadingSpinner";

/**
 * WizardLoading renders a centralized loading state with a spinner
 * and status text explaining that the AI is generating the deck.
 *
 * @returns The rendered WizardLoading component.
 */
export default function WizardLoading() {
  return (
    <div className="animate-fade-in flex flex-col items-center justify-center py-16">
      <LoadingSpinner size="lg" className="py-2" />
      <p className="mt-4 text-sm font-bold text-slate-200">AI is crafting your deck...</p>
      <p className="mt-1 text-[10px] text-slate-500">
        Please wait while DeckLab builds your blueprint
      </p>
    </div>
  );
}
