import { Filter, Layers, Plus, Search } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router";
import DeckListItem from "../components/deck/DeckListItem";
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
import { formatRelativeTime } from "../utils/date";

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

  useEffect(() => {
    setTab(initialTab);
  }, [initialTab]);

  useEffect(() => {
    const format = searchParams.get("format") || "ALL";
    const q = searchParams.get("q") || "";
    setSelectedFormat(format);
    setSearchQuery((prev) => (prev !== q ? q : prev));
  }, [searchParams]);

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
    <div className="max-w-7xl mx-auto px-6 py-12">
      <PageHeader
        title={tab === "user" ? "My Deck Blueprints" : "Public Decks"}
        description={
          tab === "user"
            ? "Manage, edit, and simulate your custom Yu-Gi-Oh! deck configurations."
            : "Browse, filter, and discover community-built Yu-Gi-Oh! decks."
        }
      />
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div className="flex items-center gap-4 flex-wrap md:flex-nowrap w-full justify-between md:justify-start">
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
            icon={<Search className="w-4 h-4" />}
            className="bg-dark-surface px-4 py-2 w-full md:max-w-xs"
          />
        </div>

        {isAuthenticated && (
          <Link
            to="/decks/create"
            viewTransition
            className="flex items-center gap-2 bg-cyan-accent hover:bg-cyan-hover text-dark-bg px-4 py-2.5 rounded-xl text-xs font-bold shadow-md transition-all duration-200 hover:-translate-y-0.5 no-underline shrink-0 self-end md:self-auto"
          >
            <Plus className="w-4 h-4" />
            <span>Construct New Deck</span>
          </Link>
        )}
      </div>

      {deleteError && (
        <div className="bg-red-950/20 border border-red-500/30 text-red-400 rounded-lg p-4 mb-6 text-sm flex justify-between items-center">
          <span>{deleteError}</span>
          <button
            onClick={() => setDeleteError(null)}
            className="text-slate-400 hover:text-white text-xs cursor-pointer"
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
        <div className="space-y-4">
          {decks.map((deck) => {
            const cardCount = deck.deckCards?.reduce((acc, c) => acc + (c.quantity || 0), 0) || 0;
            return (
              <DeckListItem
                key={deck.id}
                id={deck.id}
                name={deck.name}
                description={deck.description}
                formatName={deck.formatName}
                cardCount={cardCount}
                updatedAt={formatRelativeTime(deck.updatedAt)}
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
            className="flex items-center gap-2 bg-cyan-accent hover:bg-cyan-hover text-dark-bg px-5 py-2.5 rounded-xl text-sm font-bold shadow-md transition-all cursor-pointer no-underline"
          >
            <Plus className="w-4 h-4" />
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
