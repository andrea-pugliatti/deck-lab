import { ArrowLeft, RotateCcw, Sparkles, Upload } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Link, useNavigate, useParams } from "react-router";

import ErrorAlert from "../../../components/feedback/ErrorAlert";
import LoadingSpinner from "../../../components/feedback/LoadingSpinner";
import Pagination from "../../../components/navigation/Pagination";
import Button from "../../../components/ui/Button";
import ConfirmDialog from "../../../components/ui/ConfirmDialog";
import ViewToggle from "../../../components/ui/ViewToggle";
import { CatalogSearchProvider, useCatalogSearchContext } from "../../../features/cards";
import AiDeckWizard from "../../../features/deck-builder/components/ai-wizard/AiDeckWizard";
import AiSuggestionsPanel from "../../../features/deck-builder/components/AiSuggestionsPanel";
import DeckBuilderCardList from "../../../features/deck-builder/components/DeckBuilderCardList";
import DeckBuilderFilters from "../../../features/deck-builder/components/DeckBuilderFilters";
import DeckFormHeader from "../../../features/deck-builder/components/DeckFormHeader";
import DeckSectionList from "../../../features/deck-builder/components/DeckSectionList";
import DeckValidationErrors from "../../../features/deck-builder/components/DeckValidationErrors";
import { useDeckState } from "../../../features/deck-builder/hooks/useDeckState";
import { importYdk } from "../../../features/decks";
import { useViewPreference } from "../../../hooks/useViewPreference";
import type { AiGeneratedDeck } from "../../../types";

interface DeckBuilderContentProps {
  id?: string;
}

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
function DeckBuilderContent({ id }: DeckBuilderContentProps): React.JSX.Element {
  const navigate = useNavigate();
  const [isWizardOpen, setIsWizardOpen] = useState(false);
  const listContainerRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [resetConfirmOpen, setResetConfirmOpen] = useState(false);
  const [importWarnings, setImportWarnings] = useState<string[]>([]);
  const [isImporting, setIsImporting] = useState(false);

  const [libraryViewMode, setLibraryViewMode] = useViewPreference(
    "deck-builder-library-view",
    "list",
  );
  const [editorViewMode, setEditorViewMode] = useViewPreference("deck-builder-editor-view", "list");

  const {
    isEditMode,
    isLoading,
    error,
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
    void navigate(`/decks/${savedDeck.id}`);
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
    prefetchNextPage,
  } = useCatalogSearchContext();

  // Scroll back to top of card search catalog whenever the search page changes
  useEffect(() => {
    if (listContainerRef.current) {
      listContainerRef.current.scrollTop = 0;
    }
  }, [searchPage]);

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
    setImportWarnings([]);
  };

  const handleFileImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      setIsImporting(true);
      setImportWarnings([]);
      const result = await importYdk(file);
      if (result.deck) {
        if (result.deck.name && result.deck.name !== "Imported Deck") {
          setName(result.deck.name);
        } else if (!name) {
          setName(file.name.replace(/\.ydk$/i, ""));
        }
        if (result.deck.formatName) {
          setFormatName(result.deck.formatName);
        }
        if (result.deck.deckCards) {
          setDeckCards(result.deck.deckCards);
        }
      }
      if (result.warnings && result.warnings.length > 0) {
        setImportWarnings(result.warnings);
      }
    } catch (err) {
      setImportWarnings([err instanceof Error ? err.message : "Failed to import .ydk file"]);
    }
    setIsImporting(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  if (isEditMode && isLoading) {
    return <LoadingSpinner size="lg" className="min-h-[60vh]" />;
  }

  if (isEditMode && error) {
    return (
      <div className="mx-auto max-w-3xl px-6 py-12">
        <Link
          to="/my-decks"
          viewTransition
          className="group mb-8 inline-flex items-center gap-2 px-2.5 py-1 text-sm font-normal text-slate-400 no-underline transition-colors hover:text-white"
        >
          <ArrowLeft
            className="size-4 transition-transform group-hover:-translate-x-1"
            aria-hidden="true"
          />
          <span>Back to Decks</span>
        </Link>
        <ErrorAlert
          title="Failed to load deck for editing"
          message={error.message || "Deck not found"}
        />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 md:px-6">
      <div className="mb-6 flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
        <div>
          <Link
            to={isEditMode && id ? `/decks/${id}` : "/my-decks"}
            viewTransition
            className="group mb-2 inline-flex items-center gap-2 px-2.5 py-1 text-sm font-normal text-slate-400 no-underline transition-colors hover:text-white"
          >
            <ArrowLeft
              className="size-4 transition-transform group-hover:-translate-x-1"
              aria-hidden="true"
            />
            <span>{isEditMode ? "Back to Deck" : "Back to Decks"}</span>
          </Link>
          <h1 className="font-display text-2xl font-black text-white md:text-3xl">
            {isEditMode ? "Edit Deck Build" : "Construct New Deck"}
          </h1>
        </div>

        <div className="flex items-center gap-3">
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileImport}
            accept=".ydk"
            className="hidden"
          />
          <Button
            variant="outline-gold-subtle"
            onClick={() => fileInputRef.current?.click()}
            isLoading={isImporting}
            type="button"
          >
            <Upload className="text-gold-accent size-3.5" />
            <span>Import .ydk</span>
          </Button>

          <Button
            variant="outline"
            onClick={() => setIsWizardOpen(true)}
            className="border-cyan-accent/30 text-cyan-accent hover:border-cyan-accent flex items-center gap-2 rounded-xl bg-cyan-950/20 px-4 py-2 text-xs font-semibold"
            type="button"
          >
            <Sparkles className="text-cyan-accent size-4" />
            <span>AI Deck Wizard</span>
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
        <div className="bg-dark-surface border-border-dim flex h-[82vh] flex-col rounded-2xl border p-5 lg:col-span-5">
          <div className="border-border-dim/60 mb-4 flex items-center justify-between border-b pb-2">
            <h2 className="font-display flex items-center gap-2 text-sm font-bold text-white">
              <Sparkles className="text-cyan-accent size-4" />
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
            onPrefetchNext={prefetchNextPage}
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

          {importWarnings.length > 0 && (
            <div className="space-y-1 rounded-xl border border-amber-500/30 bg-amber-950/20 p-4 text-xs text-amber-300">
              <div className="mb-1 font-bold text-amber-400">Import Warnings:</div>
              {importWarnings.map((warn, i) => (
                <div key={i}>• {warn}</div>
              ))}
            </div>
          )}

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

          <div className="bg-dark-surface border-border-dim flex flex-col items-center justify-between gap-4 rounded-2xl border p-4 shadow-md sm:flex-row">
            <div className="flex items-center gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  void validateDeckPayload();
                }}
                isLoading={isValidating}
                disabled={deckCards.length === 0}
                className="hover:text-cyan-accent px-5 py-2.5 font-semibold text-slate-300"
              >
                Validate Deck
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
                <RotateCcw className="size-3.5" />
                Reset
              </Button>

              <Button
                type="button"
                variant="primary"
                onClick={() => saveDeck()}
                isLoading={isSaving}
                disabled={deckCards.length === 0}
                className="px-6 py-2.5 font-bold"
              >
                {isEditMode ? "Update Deck" : "Save Deck"}
              </Button>
            </div>
          </div>
        </div>
      </div>

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
      <DeckBuilderContent key={id || "new"} id={id} />
    </CatalogSearchProvider>
  );
}
