import LoadingSpinner from "../../LoadingSpinner";

export default function WizardLoading() {
  return (
    <div className="animate-fade-in flex flex-col items-center justify-center py-16">
      <LoadingSpinner size="lg" className="py-2" />
      <p className="mt-4 animate-pulse text-sm font-bold text-slate-200">
        AI is crafting your deck...
      </p>
      <p className="mt-1 text-[10px] text-slate-500">
        Please wait while DeckLab builds your blueprint
      </p>
    </div>
  );
}
