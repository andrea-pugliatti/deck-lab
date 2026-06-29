import { ArrowLeft, Calendar, Edit, Eye, Layers, Sparkles, Trash2 } from "lucide-react";
import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router";

import DeckGridItem from "../components/deck/DeckGridItem";
import ErrorAlert from "../components/ErrorAlert";
import LoadingSpinner from "../components/LoadingSpinner";
import Badge from "../components/ui/Badge";
import Button from "../components/ui/Button";
import ConfirmDialog from "../components/ui/ConfirmDialog";
import { useAuth } from "../context/AuthContext";
import { useFetch } from "../hooks/useFetch";
import { deleteDeck, getDeckEndpoint } from "../services/deck";
import type { Deck } from "../types";
import { getCardTheme } from "../utils/card";
import { formatRelativeTime } from "../utils/date";

export default function DeckDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const [deleteError, setDeleteError] = useState<string>();
  const [isDeleting, setIsDeleting] = useState(false);
  const [confirmModalOpen, setConfirmModalOpen] = useState(false);

  const { data: deck, loading, error } = useFetch<Deck>(id ? getDeckEndpoint(id) : undefined);

  const handleDeleteModal = async () => {
    if (!id) return;
    setConfirmModalOpen(false);
    setIsDeleting(true);
    setDeleteError(undefined);

    try {
      await deleteDeck(id);
      navigate("/my-decks");
    } catch (err) {
      setDeleteError(
        err instanceof Error ? err.message : "An error occurred while deleting the deck.",
      );
      setIsDeleting(false);
    }
  };

  if (loading) {
    return <LoadingSpinner size="lg" className="min-h-[60vh]" />;
  }

  if (error || !deck) {
    return (
      <div className="mx-auto max-w-3xl px-6 py-12">
        <ErrorAlert
          title="Failed to load deck details"
          message={error?.message || "Deck not found"}
          onRetry={() => navigate("/decks")}
          retryText="Back to Public Decks"
        />
      </div>
    );
  }

  const isOwner = isAuthenticated && user && deck.creatorUsername === user.username;

  const mainCards = (deck.deckCards || []).filter((c) => c.section === "MAIN" || !c.section);
  const extraCards = (deck.deckCards || []).filter((c) => c.section === "EXTRA");
  const sideCards = (deck.deckCards || []).filter((c) => c.section === "SIDE");

  const mainCount = mainCards.reduce((acc, c) => acc + (c.quantity || 0), 0);
  const extraCount = extraCards.reduce((acc, c) => acc + (c.quantity || 0), 0);
  const sideCount = sideCards.reduce((acc, c) => acc + (c.quantity || 0), 0);
  const totalCount = mainCount + extraCount + sideCount;

  const mainMonsters = mainCards.filter((c) => getCardTheme(c.type).type === "monster");
  const mainSpells = mainCards.filter((c) => getCardTheme(c.type).type === "spell");
  const mainTraps = mainCards.filter((c) => getCardTheme(c.type).type === "trap");

  const mainMonstersCount = mainMonsters.reduce((acc, c) => acc + (c.quantity || 0), 0);
  const mainSpellsCount = mainSpells.reduce((acc, c) => acc + (c.quantity || 0), 0);
  const mainTrapsCount = mainTraps.reduce((acc, c) => acc + (c.quantity || 0), 0);

  const monsterTheme = getCardTheme("monster");
  const spellTheme = getCardTheme("spell");
  const trapTheme = getCardTheme("trap");

  return (
    <div className="mx-auto max-w-7xl px-6 py-12">
      <div className="mb-8 flex items-center justify-between">
        <Button
          variant="ghost"
          onClick={() => navigate(-1)}
          className="group px-2.5 py-1 font-normal text-slate-400"
          type="button"
        >
          <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
          <span>Back</span>
        </Button>

        <div className="flex items-center gap-3">
          <Link
            to={`/simulator?deckId=${deck.id}`}
            viewTransition
            className="bg-dark-surface-elevated hover:bg-dark-surface border-border-dim hover:border-cyan-accent hover:text-cyan-accent flex cursor-pointer items-center gap-2 rounded-lg border px-4 py-2 text-xs font-semibold text-slate-300 shadow-md"
          >
            <Sparkles className="text-cyan-accent h-3.5 w-3.5" />
            Test Hand
          </Link>

          {isOwner && (
            <>
              <Link
                to={`/decks/${deck.id}/edit`}
                viewTransition
                className="bg-dark-surface-elevated hover:bg-dark-surface border-border-dim hover:border-cyan-accent hover:text-cyan-accent flex cursor-pointer items-center gap-2 rounded-lg border px-4 py-2 text-xs font-semibold text-slate-300 shadow-md"
              >
                <Edit className="h-3.5 w-3.5" />
                Edit Deck
              </Link>
              <button
                onClick={() => {
                  setConfirmModalOpen(true);
                }}
                disabled={isDeleting}
                className="flex cursor-pointer items-center gap-2 rounded-lg border border-red-500/30 bg-red-950/20 px-4 py-2 text-xs font-semibold text-red-400 shadow-md hover:border-red-500/60 hover:bg-red-950/40 disabled:opacity-50"
                type="button"
              >
                <Trash2 className="h-3.5 w-3.5" />
                {isDeleting ? "Deleting..." : "Delete Deck"}
              </button>
            </>
          )}
        </div>
      </div>

      {deleteError && (
        <div className="mb-6 rounded-lg border border-red-500/30 bg-red-950/20 p-4 text-sm text-red-400">
          {deleteError}
        </div>
      )}

      <div className="bg-dark-surface border-border-dim relative mb-8 overflow-hidden rounded-2xl border p-6 shadow-lg md:p-8">
        <div className="from-cyan-accent/5 pointer-events-none absolute inset-0 bg-radial via-transparent to-transparent"></div>
        <div className="mb-4 flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
          <div className="flex items-center gap-3">
            <Badge variant="gold">{deck.formatName}</Badge>
            <span className="text-xs font-semibold tracking-wider text-slate-500 uppercase">
              by {deck.creatorUsername || "Community"}
            </span>
          </div>
          <div className="flex items-center gap-4 text-xs text-slate-500">
            <span className="flex items-center gap-1">
              <Calendar className="h-3.5 w-3.5" />
              Updated {formatRelativeTime(deck.updatedAt)}
            </span>
            <span className="flex items-center gap-1">
              <Layers className="text-cyan-accent h-3.5 w-3.5" />
              {totalCount} Cards Total
            </span>
          </div>
        </div>

        <h1 className="font-display mb-3 text-2xl font-black text-white md:text-4xl">
          {deck.name}
        </h1>
        <p className="max-w-3xl text-sm leading-relaxed font-light text-slate-400 md:text-base">
          {deck.description || "No description provided."}
        </p>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
        <aside className="space-y-6 lg:col-span-4">
          <div className="bg-dark-surface border-border-dim rounded-2xl border p-5 shadow-md">
            <h2 className="font-display border-border-dim/60 mb-4 flex items-center gap-2 border-b pb-2 text-base font-bold text-white">
              <Eye className="text-cyan-accent h-4 w-4" />
              Deck Analytics
            </h2>

            <div className="space-y-4">
              <div>
                <div className="mb-1.5 flex justify-between text-xs font-medium text-slate-400">
                  <span>Main Deck</span>
                  <span className="font-bold text-white">{mainCount} / 60</span>
                </div>
                <div className="border-border-dim/40 h-2 w-full overflow-hidden rounded-full border bg-slate-950">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      mainCount < 40 ? "bg-amber-500" : "bg-cyan-accent"
                    }`}
                    style={{ width: `${Math.min(100, (mainCount / 60) * 100)}%` }}
                  ></div>
                </div>
                {mainCount < 40 && (
                  <span className="mt-1 block text-[10px] text-amber-400">
                    * Format limit requires at least 40 cards.
                  </span>
                )}
              </div>

              <div>
                <div className="mb-1.5 flex justify-between text-xs font-medium text-slate-400">
                  <span>Extra Deck</span>
                  <span className="font-bold text-white">{extraCount} / 15</span>
                </div>
                <div className="border-border-dim/40 h-2 w-full overflow-hidden rounded-full border bg-slate-950">
                  <div
                    className="bg-gold-accent h-full rounded-full transition-all duration-500"
                    style={{ width: `${Math.min(100, (extraCount / 15) * 100)}%` }}
                  ></div>
                </div>
              </div>

              <div>
                <div className="mb-1.5 flex justify-between text-xs font-medium text-slate-400">
                  <span>Side Deck</span>
                  <span className="font-bold text-white">{sideCount} / 15</span>
                </div>
                <div className="border-border-dim/40 h-2 w-full overflow-hidden rounded-full border bg-slate-950">
                  <div
                    className="h-full rounded-full bg-purple-400 transition-all duration-500"
                    style={{ width: `${Math.min(100, (sideCount / 15) * 100)}%` }}
                  ></div>
                </div>
              </div>
            </div>

            {mainCount > 0 && (
              <div className="border-border-dim/60 mt-6 space-y-4 border-t pt-6">
                <h3 className="mb-2 text-xs font-bold tracking-wider text-slate-400 uppercase">
                  Main Deck Composition
                </h3>

                <div className="space-y-3">
                  <div>
                    <div className="mb-1 flex justify-between text-xs text-slate-400">
                      <span className="flex items-center gap-1.5">
                        <span
                          className={`h-2.5 w-2.5 rounded-full ${monsterTheme.barColor}`}
                        ></span>
                        Monsters
                      </span>
                      <span className="font-semibold text-white">{mainMonstersCount}</span>
                    </div>
                    <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-950">
                      <div
                        className={`h-full ${monsterTheme.barColor}`}
                        style={{ width: `${(mainMonstersCount / mainCount) * 100}%` }}
                      ></div>
                    </div>
                  </div>

                  <div>
                    <div className="mb-1 flex justify-between text-xs text-slate-400">
                      <span className="flex items-center gap-1.5">
                        <span className={`h-2.5 w-2.5 rounded-full ${spellTheme.barColor}`}></span>
                        Spells
                      </span>
                      <span className="font-semibold text-white">{mainSpellsCount}</span>
                    </div>
                    <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-950">
                      <div
                        className={`h-full ${spellTheme.barColor}`}
                        style={{ width: `${(mainSpellsCount / mainCount) * 100}%` }}
                      ></div>
                    </div>
                  </div>

                  <div>
                    <div className="mb-1 flex justify-between text-xs text-slate-400">
                      <span className="flex items-center gap-1.5">
                        <span className={`h-2.5 w-2.5 rounded-full ${trapTheme.barColor}`}></span>
                        Traps
                      </span>
                      <span className="font-semibold text-white">{mainTrapsCount}</span>
                    </div>
                    <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-950">
                      <div
                        className={`h-full ${trapTheme.barColor}`}
                        style={{ width: `${(mainTrapsCount / mainCount) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </aside>

        <div className="space-y-8 lg:col-span-8">
          <div className="bg-dark-surface border-border-dim rounded-2xl border p-5 shadow-md md:p-6">
            <div className="border-border-dim/60 mb-4 flex items-center justify-between border-b pb-3">
              <h2 className="font-display flex items-center gap-2 text-base font-bold text-white">
                <span className={`bg-cyan-accent h-2.5 w-2.5 rounded-full`}></span>
                Main Deck
              </h2>
              <Badge variant="cyan" className="rounded px-2 py-0.5 text-xs font-semibold">
                {mainCount} Cards
              </Badge>
            </div>

            {mainCards.length > 0 ? (
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
                {mainCards.map((dc) => (
                  <DeckGridItem
                    key={dc.id || dc.cardId}
                    cardId={dc.cardId}
                    name={dc.name}
                    type={dc.type}
                    imageUrl={dc.imageUrl}
                    quantity={dc.quantity}
                  />
                ))}
              </div>
            ) : (
              <div className="py-8 text-center text-sm text-slate-500">
                No cards added to the Main Deck.
              </div>
            )}
          </div>

          <div className="bg-dark-surface border-border-dim rounded-2xl border p-5 shadow-md md:p-6">
            <div className="border-border-dim/60 mb-4 flex items-center justify-between border-b pb-3">
              <h2 className="font-display flex items-center gap-2 text-base font-bold text-white">
                <span className={`bg-gold-accent h-2.5 w-2.5 rounded-full`}></span>
                Extra Deck
              </h2>
              <Badge variant="gold" className="rounded px-2 py-0.5 text-xs font-semibold">
                {extraCount} Cards
              </Badge>
            </div>

            {extraCards.length > 0 ? (
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
                {extraCards.map((dc) => (
                  <DeckGridItem
                    key={dc.id || dc.cardId}
                    cardId={dc.cardId}
                    name={dc.name}
                    type={dc.type}
                    imageUrl={dc.imageUrl}
                    quantity={dc.quantity}
                  />
                ))}
              </div>
            ) : (
              <div className="py-8 text-center text-sm text-slate-500">
                No cards added to the Extra Deck.
              </div>
            )}
          </div>

          <div className="bg-dark-surface border-border-dim rounded-2xl border p-5 shadow-md md:p-6">
            <div className="border-border-dim/60 mb-4 flex items-center justify-between border-b pb-3">
              <h2 className="font-display flex items-center gap-2 text-base font-bold text-white">
                <span className={`h-2.5 w-2.5 rounded-full bg-purple-400`}></span>
                Side Deck
              </h2>
              <Badge variant="purple" className="rounded px-2 py-0.5 text-xs font-semibold">
                {sideCount} Cards
              </Badge>
            </div>

            {sideCards.length > 0 ? (
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
                {sideCards.map((dc) => (
                  <DeckGridItem
                    key={dc.id || dc.cardId}
                    cardId={dc.cardId}
                    name={dc.name}
                    type={dc.type}
                    imageUrl={dc.imageUrl}
                    quantity={dc.quantity}
                  />
                ))}
              </div>
            ) : (
              <div className="py-8 text-center text-sm text-slate-500">
                No cards added to the Side Deck.
              </div>
            )}
          </div>
        </div>
      </div>
      <ConfirmDialog
        isOpen={confirmModalOpen}
        onClose={() => setConfirmModalOpen(false)}
        onConfirm={handleDeleteModal}
        title="Delete Deck Blueprint"
        description={
          <>
            Are you sure you want to delete{" "}
            <span className="font-semibold text-white">"{deck?.name || "this deck"}"</span>? This
            action cannot be undone and will permanently remove the blueprint.
          </>
        }
        confirmText="Delete Deck"
        variant="danger"
        isLoading={isDeleting}
      />
    </div>
  );
}
