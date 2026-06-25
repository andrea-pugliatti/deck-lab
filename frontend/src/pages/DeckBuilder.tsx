import { ArrowLeft, RotateCcw, Sparkles } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router";
import AiDeckWizard from "../components/deck-builder/ai-wizard/AiDeckWizard";
import AiSuggestionsPanel from "../components/deck-builder/AiSuggestionsPanel";
import DeckBuilderCardList from "../components/deck-builder/DeckBuilderCardList";
import DeckBuilderFilters from "../components/deck-builder/DeckBuilderFilters";
import DeckFormHeader from "../components/deck-builder/DeckFormHeader";
import DeckSectionList from "../components/deck-builder/DeckSectionList";
import DeckValidationErrors from "../components/deck-builder/DeckValidationErrors";
import Pagination from "../components/Pagination";
import Button from "../components/ui/Button";
import { DeckBuilderProvider, useDeckBuilder } from "../context/DeckBuilderContext";

function DeckBuilderContent() {
  const navigate = useNavigate();
  const [isWizardOpen, setIsWizardOpen] = useState(false);
  const listContainerRef = useRef<HTMLDivElement>(null);
  const [resetState, setResetState] = useState<"idle" | "confirming">("idle");
  const resetTimerRef = useRef<NodeJS.Timeout | null>(null);

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
    formatName,
    setFormatName,
    setName,
    setDescription,
    setDeckCards,
  } = useDeckBuilder();

  useEffect(() => {
    if (listContainerRef.current) {
      listContainerRef.current.scrollTop = 0;
    }
  }, [searchPage]);

  useEffect(() => {
    return () => {
      if (resetTimerRef.current) {
        clearTimeout(resetTimerRef.current);
      }
    };
  }, []);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    saveDeck();
  };

  const handleDeckGenerated = (data: {
    name: string;
    description: string;
    formatName: string;
    deckCards: any[];
  }) => {
    setName(data.name);
    setDescription(data.description);
    setFormatName(data.formatName);
    setDeckCards(data.deckCards);
  };

  const handleReset = () => {
    if (resetState === "idle") {
      setResetState("confirming");
      if (resetTimerRef.current) clearTimeout(resetTimerRef.current);
      resetTimerRef.current = setTimeout(() => {
        setResetState("idle");
      }, 5000);
    } else {
      if (resetTimerRef.current) clearTimeout(resetTimerRef.current);
      setResetState("idle");
      setName("");
      setDescription("");
      setFormatName("TCG");
      setDeckCards([]);
    }
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

        <Button
          variant="outline"
          onClick={() => setIsWizardOpen(true)}
          className="flex items-center gap-2 border-cyan-accent/30 text-cyan-accent hover:border-cyan-accent bg-cyan-950/20 px-4 py-2 text-xs font-semibold rounded-xl"
          type="button"
        >
          <Sparkles className="w-4 h-4 text-cyan-accent" />
          <span>AI Deck Wizard</span>
        </Button>
      </div>

      <form onSubmit={handleSave} className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-5 bg-dark-surface border border-border-dim rounded-2xl p-5 flex flex-col h-[82vh]">
          <h2 className="font-display text-sm font-bold text-white mb-4 flex items-center gap-2 pb-2 border-b border-border-dim/60">
            <Sparkles className="w-4 h-4 text-cyan-accent" />
            Card Database Library
          </h2>

          <DeckBuilderFilters />

          <div ref={listContainerRef} className="flex-1 overflow-y-auto mt-4 pr-1 min-h-0">
            <DeckBuilderCardList />
          </div>

          <Pagination
            page={searchPage}
            totalPages={totalSearchPages}
            onPageChange={setSearchPage}
            variant="compact"
          />
        </div>

        <div className="lg:col-span-7 space-y-6">
          <DeckFormHeader />

          <DeckValidationErrors />

          <AiSuggestionsPanel />

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

            <div className="flex items-center gap-3">
              {resetState === "confirming" ? (
                <>
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={() => {
                      if (resetTimerRef.current) clearTimeout(resetTimerRef.current);
                      setResetState("idle");
                    }}
                    className="px-3 py-2.5 font-semibold text-slate-400 hover:text-white"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="button"
                    variant="outline-red"
                    onClick={handleReset}
                    className="px-4 py-2.5 font-semibold flex items-center gap-1.5 bg-red-950/60 text-red-400 border-red-500 hover:bg-red-900/60"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    Confirm Reset
                  </Button>
                </>
              ) : (
                <Button
                  type="button"
                  variant="outline-red"
                  onClick={handleReset}
                  className="px-4 py-2.5 font-semibold flex items-center gap-1.5"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  Reset
                </Button>
              )}

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
        </div>
      </form>

      <AiDeckWizard
        isOpen={isWizardOpen}
        onClose={() => setIsWizardOpen(false)}
        onDeckGenerated={handleDeckGenerated}
        currentFormat={formatName}
      />
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
