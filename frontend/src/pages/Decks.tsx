import { Filter, Layers, Plus, Search } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router";

import DeckCard from "../components/deck/DeckCard";
import FormatSelector from "../components/deck/FormatSelector";
import EmptyState from "../components/EmptyState";
import ErrorAlert from "../components/ErrorAlert";
import LoadingSpinner from "../components/LoadingSpinner";
import PageHeader from "../components/PageHeader";
import ConfirmDialog from "../components/ui/ConfirmDialog";
import Input from "../components/ui/Input";
import { useAuth } from "../context/AuthContext";
import { useDebounce } from "../hooks/useDebounce";
import { useFetch } from "../hooks/useFetch";
import { deleteDeck, getDecksQueryEndpoint, getFormatsEndpoint } from "../services/deck";
import type { Deck } from "../types";

export interface DecksProps {
  initialTab?: "all" | "user";
}

export default function Decks({ initialTab = "all" }: DecksProps) {
  const [searchParams, setSearchParams] = useSearchParams();
  const { isAuthenticated, user } = useAuth();
  const [tab, setTab] = useState<"all" | "user">(initialTab);

  const initialFormat = searchParams.get("format") || "ALL";
  const initialQuery = searchParams.get("q") || "";

  const [selectedFormat, setSelectedFormat] = useState(initialFormat);
  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const debouncedQuery = useDebounce(searchQuery, 400);

  const { data: formatsData } = useFetch<string[]>(getFormatsEndpoint());
  const formats = formatsData
    ? ["ALL", ...formatsData]
    : ["ALL", "TCG", "OCG", "Goat", "Speed Duel"];

  const [prevInitialTab, setPrevInitialTab] = useState(initialTab);
  const [prevSearchParams, setPrevSearchParams] = useState(searchParams);

  if (initialTab !== prevInitialTab) {
    setPrevInitialTab(initialTab);
    setTab(initialTab);
  }

  if (searchParams !== prevSearchParams) {
    setPrevSearchParams(searchParams);
    const format = searchParams.get("format") || "ALL";
    const q = searchParams.get("q") || "";
    setSelectedFormat(format);
    setSearchQuery((prev) => (prev !== q ? q : prev));
  }

  useEffect(() => {
    const params: Record<string, string> = {};
    if (debouncedQuery.trim()) {
      params.q = debouncedQuery.trim();
    }
    if (selectedFormat !== "ALL") {
      params.format = selectedFormat;
    }

    const currentParams = Object.fromEntries(searchParams.entries());
    const hasChanged =
      Object.keys(params).length !== Object.keys(currentParams).length ||
      Object.keys(params).some((k) => params[k] !== currentParams[k]);

    if (hasChanged) {
      setSearchParams(params);
    }
  }, [debouncedQuery, selectedFormat, setSearchParams, searchParams]);

  const queryParams = new URLSearchParams();
  if (debouncedQuery.trim()) {
    queryParams.append("q", debouncedQuery.trim());
  }
  if (selectedFormat !== "ALL") {
    queryParams.append("format", selectedFormat);
  }
  if (tab === "user" && user?.username) {
    queryParams.append("username", user.username);
  }

  const fetchUrl = tab === "user" && !user?.username ? null : getDecksQueryEndpoint(queryParams);
  const { data, loading, error, refetch } = useFetch<Deck[]>(fetchUrl);
  const decks = data || [];

  const [deckToDelete, setDeckToDelete] = useState<{ id: number; name: string } | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  const handleDeleteModal = async () => {
    if (!deckToDelete) return;
    setIsDeleting(true);
    setDeleteError(null);
    try {
      await deleteDeck(deckToDelete.id);
      refetch();
      setDeckToDelete(null);
    } catch (err: any) {
      console.error(err);
      setDeleteError(err.message || "Failed to delete the deck.");
      setDeckToDelete(null);
    } finally {
      setIsDeleting(false);
    }
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
            icon={<Search className="h-4 w-4" />}
            className="bg-dark-surface w-full px-4 py-2 md:max-w-xs"
          />
        </div>

        {isAuthenticated && (
          <Link
            to="/decks/create"
            viewTransition
            className="bg-gold-accent hover:bg-gold-hover text-dark-bg flex shrink-0 items-center gap-2 self-end rounded-xl px-4 py-2.5 text-xs font-bold no-underline shadow-md transition-all duration-200 hover:shadow-[0_2px_30px_rgba(226,197,111,0.16)] md:self-auto"
          >
            <Plus className="h-4 w-4" />
            <span>Construct New Deck</span>
          </Link>
        )}
      </div>

      {deleteError && (
        <div className="mb-6 flex items-center justify-between rounded-lg border border-red-500/30 bg-red-950/20 p-4 text-sm text-red-400">
          <span>{deleteError}</span>
          <button
            onClick={() => setDeleteError(null)}
            className="cursor-pointer text-xs text-slate-400 hover:text-white"
          >
            Close
          </button>
        </div>
      )}

      {loading ? (
        <LoadingSpinner />
      ) : error ? (
        <ErrorAlert
          title="Failed to load decks"
          message={error.message}
          onRetry={() => refetch()}
        />
      ) : decks.length > 0 ? (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {decks.map((deck) => {
            const cardCount = deck.deckCards?.reduce((acc, c) => acc + (c.quantity || 0), 0) || 0;
            return (
              <DeckCard
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
      ) : tab === "user" ? (
        <EmptyState
          icon={Layers}
          title="You haven't built any decks yet."
          description="Start your first deck blueprint using the deck editor."
        >
          <Link
            to="/decks/create"
            viewTransition
            className="bg-gold-accent hover:bg-gold-hover text-dark-bg flex shrink-0 items-center gap-2 self-end rounded-xl px-4 py-2.5 text-xs font-bold no-underline shadow-md transition-all duration-200 hover:shadow-[0_2px_30px_rgba(226,197,111,0.16)] md:self-auto"
          >
            <Plus className="h-4 w-4" />
            <span>Construct New Deck</span>
          </Link>
        </EmptyState>
      ) : (
        <EmptyState
          icon={Filter}
          title="No decks found matching the search criteria."
          description="Try adjusting your search query or format filter."
        />
      )}

      <ConfirmDialog
        isOpen={deckToDelete !== null}
        onClose={() => setDeckToDelete(null)}
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
