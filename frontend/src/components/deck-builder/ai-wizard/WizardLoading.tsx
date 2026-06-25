import LoadingSpinner from "../../LoadingSpinner";

export default function WizardLoading() {
  return (
    <div className="flex flex-col items-center justify-center py-16 animate-fade-in">
      <LoadingSpinner size="lg" className="py-2" />
      <p className="text-sm font-bold text-slate-200 mt-4 animate-pulse">
        AI is crafting your deck...
      </p>
      <p className="text-[10px] text-slate-500 mt-1">
        Please wait while DeckLab builds your blueprint
      </p>
    </div>
  );
}
