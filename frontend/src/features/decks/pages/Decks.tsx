import { BookOpen, Layers, Plus, Search } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router";

import EmptyState from "../../../components/feedback/EmptyState";
import ErrorAlert from "../../../components/feedback/ErrorAlert";
import LoadingSpinner from "../../../components/feedback/LoadingSpinner";
import PageHeader from "../../../components/navigation/PageHeader";
import Pagination from "../../../components/navigation/Pagination";
import ShowingPageIndicator from "../../../components/navigation/ShowingPageIndicator";
import { getButtonClasses } from "../../../components/ui/Button";
import ConfirmDialog from "../../../components/ui/ConfirmDialog";
import Input from "../../../components/ui/Input";
import ViewToggle from "../../../components/ui/ViewToggle";
import { useAuth } from "../../../features/auth";
import DeckGridCard from "../../../features/decks/components/DeckGridCard";
import DeckListCard from "../../../features/decks/components/DeckListCard";
import FormatSelector from "../../../features/decks/components/FormatSelector";
import { useDeckSearch } from "../../../features/decks/hooks/useDeckSearch";
import { useDeleteDeck } from "../../../features/decks/hooks/useDeleteDeck";
import { useFormats } from "../../../features/decks/hooks/useFormats";
import { useViewPreference } from "../../../hooks/useViewPreference";

/**
 * Properties for the Decks page component.
 */
export interface DecksProps {
  initialTab?: "all" | "user";
}

/**
 * Number of deck blueprints to render per page.
 */
const PAGE_SIZE = 9;

/**
 * Decks Page Component.
 *
 * Renders a list of deck blueprints. It can operate in two modes: public ("all") to browse
 * community decks, or private ("user") to manage the authenticated user's deck blueprints.
 * Features search and format-filtering with synced URL state queries.
 *
 * @param {DecksProps} props - The component props.
 * @returns {React.JSX.Element} The rendered Decks catalog page.
 */
export default function Decks({ initialTab = "all" }: DecksProps): React.JSX.Element {
  const { isAuthenticated, user } = useAuth();
  const tab = initialTab;
  const [viewMode, setViewMode] = useViewPreference("decks-view-mode", "grid");

  const { formats: formatsData } = useFormats();
  const formats = formatsData
    ? ["ALL", ...formatsData]
    : ["ALL", "TCG", "OCG", "Goat", "Speed Duel"];

  const {
    page,
    searchQuery,
    setSearchQuery,
    format: selectedFormat,
    setFormat: setSelectedFormat,
    decks,
    loading,
    error,
    totalPages,
    totalElements,
    refetch,
    prefetchNextPage,
  } = useDeckSearch({
    pageSize: PAGE_SIZE,
    username: tab === "user" ? user?.username || "" : "",
    skip: tab === "user" && !user?.username,
    syncUrl: true,
  });

  const [deckToDelete, setDeckToDelete] = useState<{ id: number; name: string }>();
  const {
    mutate: deleteDeckMutate,
    reset,
    isPending: isDeleting,
    error: deleteError,
  } = useDeleteDeck();

  /**
   * Event handler for confirming and executing deletion of a selected deck.
   * The {@link useDeleteDeck} mutation handles cache invalidation; this handler
   * closes the confirmation modal and clears the selected deck on success.
   */
  const handleDeleteModal = () => {
    if (!deckToDelete) return;
    deleteDeckMutate(deckToDelete.id, {
      onSuccess: () => {
        setDeckToDelete(undefined);
      },
    });
  };

  return (
    <div className="mx-auto max-w-7xl px-6 py-12">
      <PageHeader
        title={tab === "user" ? "My Deck Blueprints" : "Public Decks"}
        description={
          tab === "user"
            ? "Manage, edit, and simulate your custom Yu-Gi-Oh! deck configurations."
            : "Browse, filter, and discover community-built Yu-Gi-Oh! decks."
        }
      />
      <div className="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div className="flex w-full flex-wrap items-center justify-between gap-4 md:flex-nowrap md:justify-start">
          <FormatSelector
            selectedFormat={selectedFormat}
            setSelectedFormat={(fmt) => setSelectedFormat(fmt)}
            formats={formats}
          />

          <Input
            type="text"
            placeholder="Search decks..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            icon={<Search className="size-4" />}
            containerClassName="bg-dark-surface w-full md:max-w-xs"
          />

          <ViewToggle viewMode={viewMode} onViewModeChange={setViewMode} />
          {isAuthenticated && (
            <Link
              to="/decks/create"
              viewTransition
              className={`${getButtonClasses({ variant: "primary", size: "sm" })} shrink-0 self-end no-underline md:self-auto`}
            >
              <Plus className="size-4" />
              <span>Construct New Deck</span>
            </Link>
          )}
        </div>
      </div>

      {deleteError && (
        <div className="mb-6 flex items-center justify-between rounded-lg border border-red-500/30 bg-red-950/20 p-4 text-sm text-red-400">
          <span>
            {deleteError instanceof Error ? deleteError.message : "Failed to delete the deck."}
          </span>
          <button
            onClick={() => reset()}
            className="cursor-pointer text-xs text-slate-400 hover:text-white"
          >
            Close
          </button>
        </div>
      )}

      <ShowingPageIndicator
        page={page}
        pageSize={PAGE_SIZE}
        totalElements={totalElements}
        itemType="deck"
        className="mb-6"
      />

      {loading ? (
        <LoadingSpinner />
      ) : error ? (
        <ErrorAlert
          title="Failed to load decks"
          message={error.message}
          onRetry={() => refetch()}
        />
      ) : decks.length > 0 ? (
        <>
          {viewMode === "grid" ? (
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {decks.map((deck) => {
                const cardCount =
                  deck.deckCards?.reduce((acc, c) => acc + (c.quantity || 0), 0) || 0;
                return (
                  <DeckGridCard
                    key={deck.id}
                    id={deck.id}
                    name={deck.name}
                    description={deck.description}
                    formatName={deck.formatName}
                    cardCount={cardCount}
                    updatedAt={deck.updatedAt}
                    creatorUsername={deck.creatorUsername}
                    showActions={isAuthenticated && user?.username === deck.creatorUsername}
                    onDelete={(id) => setDeckToDelete({ id, name: deck.name })}
                  />
                );
              })}
            </div>
          ) : (
            <div className="space-y-4">
              {decks.map((deck) => {
                const cardCount =
                  deck.deckCards?.reduce((acc, c) => acc + (c.quantity || 0), 0) || 0;
                return (
                  <DeckListCard
                    key={deck.id}
                    id={deck.id}
                    name={deck.name}
                    description={deck.description}
                    formatName={deck.formatName}
                    cardCount={cardCount}
                    updatedAt={deck.updatedAt}
                    creatorUsername={deck.creatorUsername}
                    showActions={isAuthenticated && user?.username === deck.creatorUsername}
                    onDelete={(id) => setDeckToDelete({ id, name: deck.name })}
                  />
                );
              })}
            </div>
          )}

          <Pagination page={page} totalPages={totalPages} onPrefetchNext={prefetchNextPage} />
        </>
      ) : tab === "user" ? (
        <EmptyState
          icon={Layers}
          title="You haven't built any decks yet."
          description="Start your first deck blueprint using the deck editor."
        >
          <Link
            to="/decks/create"
            viewTransition
            className={`${getButtonClasses({ variant: "primary", size: "sm" })} shrink-0 self-end no-underline md:self-auto`}
          >
            <Plus className="size-4" />
            <span>Construct New Deck</span>
          </Link>
        </EmptyState>
      ) : (
        <EmptyState
          icon={BookOpen}
          title="No decks found matching the search criteria."
          description="Try adjusting your search query or format filter."
        />
      )}

      <ConfirmDialog
        isOpen={!!deckToDelete}
        onClose={() => setDeckToDelete(undefined)}
        onConfirm={handleDeleteModal}
        title="Delete Deck Blueprint"
        description={
          <>
            Are you sure you want to delete{" "}
            <span className="font-semibold text-white">"{deckToDelete?.name || "this deck"}"</span>?
            This action cannot be undone and will permanently remove the blueprint.
          </>
        }
        confirmText="Delete Deck"
        variant="danger"
        isLoading={isDeleting}
      />
    </div>
  );
}
