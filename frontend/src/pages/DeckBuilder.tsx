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
import ViewToggle from "../components/ui/ViewToggle";
import { CatalogSearchProvider, useCatalogSearchContext } from "../context/CatalogSearchContext";
import { useDeckState } from "../hooks/useDeckState";
import { useViewPreference } from "../hooks/useViewPreference";
import type { AiGeneratedDeck } from "../types";

/**
 * DeckBuilderContent Component.
 *
 * Implements the core workspace for constructing or editing a Yu-Gi-Oh! deck.
 * Displays the card library with search/filtering on the left, and the current deck details,
 * validations, and divided deck sections (Main, Extra, Side) on the right. Also handles
 * resetting the workspace and opening the AI Deck Wizard modal.
 *
 * @returns {React.JSX.Element} The DeckBuilder workspace user interface.
 */
function DeckBuilderContent(): React.JSX.Element {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [isWizardOpen, setIsWizardOpen] = useState(false);
  const listContainerRef = useRef<HTMLDivElement>(null);
  const [resetConfirmOpen, setResetConfirmOpen] = useState(false);

  const [libraryViewMode, setLibraryViewMode] = useViewPreference(
    "deck-builder-library-view",
    "list",
  );
  const [editorViewMode, setEditorViewMode] = useViewPreference("deck-builder-editor-view", "list");

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
  } = useDeckState(id, (savedDeck) => {
    navigate(`/decks/${savedDeck.id}`);
  });

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
  } = useCatalogSearchContext();

  // Scroll back to top of card search catalog whenever the search page changes
  useEffect(() => {
    if (listContainerRef.current) {
      listContainerRef.current.scrollTop = 0;
    }
  }, [searchPage]);

  /**
   * Submits the form to save the deck.
   *
   * @param {React.SubmitEvent} e - Form submission event.
   */
  const handleSave = (e: React.SubmitEvent) => {
    e.preventDefault();
    saveDeck();
  };

  /**
   * Callback triggered when the AI Deck Wizard generates a deck layout.
   * Updates current name, description, format, and card listing based on output.
   *
   * @param {AiGeneratedDeck} data - Object containing generated deck details.
   */
  const handleDeckGenerated = (data: AiGeneratedDeck) => {
    if (data) {
      setName(data.name!);
      setDescription(data.description!);
      setFormatName(data.formatName!);
      setDeckCards(data.deckCards!);
    }
  };

  /**
   * Resets the entire builder session variables, clearing any selected cards,
   * name, description, and resetting the format selector back to default TCG.
   */
  const handleResetModal = () => {
    setResetConfirmOpen(false);
    setName("");
    setDescription("");
    setFormatName("TCG");
    setDeckCards([]);
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 md:px-6">
      <div className="mb-6 flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
        <div>
          <Button
            variant="ghost"
            onClick={() => navigate(-1)}
            className="group mb-2 px-2.5 py-1 text-sm font-normal text-slate-400"
            type="button"
          >
            <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
            <span>Back to Decks</span>
          </Button>
          <h1 className="font-display text-2xl font-black text-white md:text-3xl">
            {isEditMode ? "Edit Deck Build" : "Construct New Deck"}
          </h1>
        </div>

        <Button
          variant="outline"
          onClick={() => setIsWizardOpen(true)}
          className="border-cyan-accent/30 text-cyan-accent hover:border-cyan-accent flex items-center gap-2 rounded-xl bg-cyan-950/20 px-4 py-2 text-xs font-semibold"
          type="button"
        >
          <Sparkles className="text-cyan-accent h-4 w-4" />
          <span>AI Deck Wizard</span>
        </Button>
      </div>

      <form onSubmit={handleSave} className="grid grid-cols-1 gap-8 lg:grid-cols-12">
        <div className="bg-dark-surface border-border-dim flex h-[82vh] flex-col rounded-2xl border p-5 lg:col-span-5">
          <div className="border-border-dim/60 mb-4 flex items-center justify-between border-b pb-2">
            <h2 className="font-display flex items-center gap-2 text-sm font-bold text-white">
              <Sparkles className="text-cyan-accent h-4 w-4" />
              Card Database Library
            </h2>
          </div>

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

          <div className="border-border-dim/40 mt-3 flex items-center justify-end gap-4 border-t pt-3">
            <ViewToggle viewMode={libraryViewMode} onViewModeChange={setLibraryViewMode} />
          </div>

          <div
            ref={listContainerRef}
            className="mt-4 min-h-0 flex-1 scrollbar-none overflow-y-auto pr-1"
          >
            <DeckBuilderCardList
              libraryLoading={libraryLoading}
              libraryCards={libraryCards}
              deckCards={deckCards}
              addCard={addCard}
              viewMode={libraryViewMode}
            />
          </div>

          <Pagination
            page={searchPage}
            totalPages={totalSearchPages}
            onPageChange={setSearchPage}
            variant="compact"
          />
        </div>

        <div className="space-y-6 lg:col-span-7">
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

          <div className="space-y-4">
            {(["MAIN", "EXTRA", "SIDE"] as const).map((section) => (
              <DeckSectionList
                key={section}
                section={section}
                deckCards={deckCards}
                formatName={formatName}
                updateQuantity={updateQuantity}
                removeCard={removeCard}
                viewMode={editorViewMode}
              />
            ))}
          </div>

          <AiSuggestionsPanel deckCards={deckCards} formatName={formatName} addCard={addCard} />

          <div className="bg-dark-surface border-border-dim flex items-center justify-between gap-4 rounded-2xl border p-4 shadow-md">
            <div className="flex items-center gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={validateDeckPayload}
                isLoading={isValidating}
                disabled={deckCards.length === 0}
                className="hover:text-cyan-accent px-5 py-2.5 font-semibold text-slate-300"
              >
                Run Validate Check
              </Button>
              <ViewToggle viewMode={editorViewMode} onViewModeChange={setEditorViewMode} />
            </div>

            <div className="flex items-center gap-3">
              <Button
                type="button"
                variant="outline-red"
                onClick={() => setResetConfirmOpen(true)}
                className="flex items-center gap-1.5 px-4 py-2.5 font-semibold"
              >
                <RotateCcw className="h-3.5 w-3.5" />
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

/**
 * DeckBuilder Root Page Component.
 *
 * Wraps the main DeckBuilderContent workspace within the CatalogSearchProvider
 * context provider, using the deck `id` parameter as key for key-based state updates.
 *
 * @returns {React.JSX.Element} The rendered DeckBuilder page.
 */
export default function DeckBuilder(): React.JSX.Element {
  const { id } = useParams<{ id: string }>();
  return (
    <CatalogSearchProvider>
      <DeckBuilderContent key={id || "new"} />
    </CatalogSearchProvider>
  );
}
