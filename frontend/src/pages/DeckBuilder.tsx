import { ArrowLeft, Sparkles } from "lucide-react";
import { useNavigate, useParams } from "react-router";
import DeckBuilderCardList from "../components/deck-builder/DeckBuilderCardList";
import DeckBuilderFilters from "../components/deck-builder/DeckBuilderFilters";
import DeckFormHeader from "../components/deck-builder/DeckFormHeader";
import DeckSectionList from "../components/deck-builder/DeckSectionList";
import DeckStats from "../components/deck-builder/DeckStats";
import Pagination from "../components/Pagination";
import Button from "../components/ui/Button";
import { DeckBuilderProvider, useDeckBuilder } from "../context/DeckBuilderContext";

function DeckBuilderContent() {
  const navigate = useNavigate();
  const {
    isEditMode,
    deckCards,
    searchPage,
    setSearchPage,
    totalSearchPages,
    isValidating,
    isSaving,
    validateDeckPayload,
    saveDeck,
  } = useDeckBuilder();

  const handleSave = (e: React.SubmitEvent) => {
    e.preventDefault();
    saveDeck();
  };

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-6 py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <div>
          <Button
            variant="ghost"
            onClick={() => navigate(-1)}
            className="mb-2 group text-sm text-slate-400 font-normal px-2.5 py-1"
            type="button"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            <span>Back to Decks</span>
          </Button>
          <h1 className="font-display text-2xl md:text-3xl font-black text-white">
            {isEditMode ? "Edit Deck Build" : "Construct New Deck"}
          </h1>
        </div>
      </div>

      <form onSubmit={handleSave} className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-5 bg-dark-surface border border-border-dim rounded-2xl p-5 flex flex-col h-[82vh]">
          <h2 className="font-display text-sm font-bold text-white mb-4 flex items-center gap-2 pb-2 border-b border-border-dim/60">
            <Sparkles className="w-4 h-4 text-cyan-accent" />
            Card Database Library
          </h2>

          <DeckBuilderFilters />

          <DeckBuilderCardList />

          <Pagination
            page={searchPage}
            totalPages={totalSearchPages}
            onPageChange={setSearchPage}
            variant="compact"
          />
        </div>

        <div className="lg:col-span-7 space-y-6">
          <DeckFormHeader />

          <DeckStats />

          <div className="space-y-4">
            {(["MAIN", "EXTRA", "SIDE"] as const).map((section) => (
              <DeckSectionList key={section} section={section} />
            ))}
          </div>

          <div className="flex justify-between items-center bg-dark-surface border border-border-dim rounded-2xl p-4 shadow-md gap-4">
            <Button
              type="button"
              variant="outline"
              onClick={validateDeckPayload}
              isLoading={isValidating}
              disabled={deckCards.length === 0}
              className="px-5 py-2.5 font-semibold text-slate-300 hover:text-cyan-accent"
            >
              Run Validate Check
            </Button>

            <Button
              type="submit"
              variant="primary"
              isLoading={isSaving}
              disabled={deckCards.length === 0}
              className="px-6 py-2.5 font-bold"
            >
              {isEditMode ? "Update Deck Blueprint" : "Save Deck Blueprint"}
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
}

export default function DeckBuilder() {
  const { id } = useParams<{ id: string }>();
  return (
    <DeckBuilderProvider key={id || "new"}>
      <DeckBuilderContent />
    </DeckBuilderProvider>
  );
}
