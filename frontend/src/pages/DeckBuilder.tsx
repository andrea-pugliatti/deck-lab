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
import ConfirmDialog from "../components/ui/ConfirmDialog";
import { CatalogSearchProvider, useCatalogSearch } from "../context/CatalogSearchContext";
import { DeckStateProvider, useDeckStateContext } from "../context/DeckStateContext";

function DeckBuilderContent() {
  const navigate = useNavigate();
  const [isWizardOpen, setIsWizardOpen] = useState(false);
  const listContainerRef = useRef<HTMLDivElement>(null);
  const [resetConfirmOpen, setResetConfirmOpen] = useState(false);

  const {
    isEditMode,
    deckCards,
    isValidating,
    isSaving,
    validateDeckPayload,
    saveDeck,
    formatName,
    setFormatName,
    name,
    setName,
    description,
    setDescription,
    setDeckCards,
    validationSuccess,
    validationErrors,
    submitError,
    addCard,
    updateQuantity,
    removeCard,
  } = useDeckStateContext();

  const {
    searchPage,
    setSearchPage,
    totalSearchPages,
    searchQuery,
    setSearchQuery,
    filters,
    setFilters,
    types,
    attributes,
    races,
    archetypes,
    formats,
    libraryLoading,
    libraryCards,
  } = useCatalogSearch();

  useEffect(() => {
    if (listContainerRef.current) {
      listContainerRef.current.scrollTop = 0;
    }
  }, [searchPage]);

  const handleSave = (e: React.SubmitEvent) => {
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

  const handleResetModal = () => {
    setResetConfirmOpen(false);
    setName("");
    setDescription("");
    setFormatName("TCG");
    setDeckCards([]);
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

          <DeckBuilderFilters
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            filters={filters}
            setFilters={setFilters}
            types={types}
            attributes={attributes}
            races={races}
            archetypes={archetypes}
          />

          <div ref={listContainerRef} className="flex-1 overflow-y-auto mt-4 pr-1 min-h-0">
            <DeckBuilderCardList
              libraryLoading={libraryLoading}
              libraryCards={libraryCards}
              deckCards={deckCards}
              addCard={addCard}
            />
          </div>

          <Pagination
            page={searchPage}
            totalPages={totalSearchPages}
            onPageChange={setSearchPage}
            variant="compact"
          />
        </div>

        <div className="lg:col-span-7 space-y-6">
          <DeckFormHeader
            name={name}
            setName={setName}
            description={description}
            setDescription={setDescription}
            formatName={formatName}
            setFormatName={setFormatName}
            formats={formats}
          />

          <DeckValidationErrors
            validationSuccess={validationSuccess}
            validationErrors={validationErrors}
            submitError={submitError}
          />

          <AiSuggestionsPanel deckCards={deckCards} formatName={formatName} addCard={addCard} />

          <div className="space-y-4">
            {(["MAIN", "EXTRA", "SIDE"] as const).map((section) => (
              <DeckSectionList
                key={section}
                section={section}
                deckCards={deckCards}
                formatName={formatName}
                updateQuantity={updateQuantity}
                removeCard={removeCard}
              />
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
              <Button
                type="button"
                variant="outline-red"
                onClick={() => setResetConfirmOpen(true)}
                className="px-4 py-2.5 font-semibold flex items-center gap-1.5"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                Reset
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
        </div>
      </form>

      <AiDeckWizard
        isOpen={isWizardOpen}
        onClose={() => setIsWizardOpen(false)}
        onDeckGenerated={handleDeckGenerated}
        currentFormat={formatName}
      />

      <ConfirmDialog
        isOpen={resetConfirmOpen}
        onClose={() => setResetConfirmOpen(false)}
        onConfirm={handleResetModal}
        title="Reset Workspace"
        description="Are you sure you want to reset the deck builder? This will clear all cards, title, and description, reverting your workspace to a blank blueprint."
        confirmText="Reset Workspace"
        variant="danger"
      />
    </div>
  );
}

export default function DeckBuilder() {
  const { id } = useParams<{ id: string }>();
  return (
    <DeckStateProvider key={id || "new"}>
      <CatalogSearchProvider>
        <DeckBuilderContent />
      </CatalogSearchProvider>
    </DeckStateProvider>
  );
}
