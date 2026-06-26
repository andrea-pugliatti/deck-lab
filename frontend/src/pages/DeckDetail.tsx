import { ArrowLeft, Calendar, Edit, Layers, Sparkles, Trash2 } from "lucide-react";
import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router";
import DeckGridItem from "../components/deck/DeckGridItem";
import ErrorAlert from "../components/ErrorAlert";
import LoadingSpinner from "../components/LoadingSpinner";
import Badge from "../components/ui/Badge";
import Button from "../components/ui/Button";
import { useAuth } from "../context/AuthContext";
import { useFetch } from "../hooks/useFetch";
import { deleteDeck, getDeckEndpoint } from "../services/deck";
import type { Deck } from "../types";
import { formatRelativeTime } from "../utils/date";

export default function DeckDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const { data: deck, loading, error } = useFetch<Deck>(id ? getDeckEndpoint(id) : null);

  const handleDelete = async () => {
    if (!id || !window.confirm("Are you sure you want to delete this deck?")) return;

    setIsDeleting(true);
    setDeleteError(null);

    try {
      await deleteDeck(id);
      navigate("/my-decks");
    } catch (err: any) {
      setDeleteError(err.message || "An error occurred while deleting the deck.");
      setIsDeleting(false);
    }
  };

  if (loading) {
    return <LoadingSpinner size="lg" className="min-h-[60vh]" />;
  }

  if (error || !deck) {
    return (
      <div className="max-w-3xl mx-auto px-6 py-12">
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

  const mainMonsters = mainCards.filter((c) => c.type?.toLowerCase().includes("monster"));
  const mainSpells = mainCards.filter((c) => c.type?.toLowerCase().includes("spell"));
  const mainTraps = mainCards.filter((c) => c.type?.toLowerCase().includes("trap"));

  const mainMonstersCount = mainMonsters.reduce((acc, c) => acc + (c.quantity || 0), 0);
  const mainSpellsCount = mainSpells.reduce((acc, c) => acc + (c.quantity || 0), 0);
  const mainTrapsCount = mainTraps.reduce((acc, c) => acc + (c.quantity || 0), 0);

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      <div className="flex justify-between items-center mb-8">
        <Button
          variant="ghost"
          onClick={() => navigate(-1)}
          className="group text-slate-400 font-normal px-2.5 py-1"
          type="button"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          <span>Back</span>
        </Button>

        <div className="flex items-center gap-3">
          <Link
            to={`/simulator?deckId=${deck.id}`}
            className="flex items-center gap-2 bg-dark-surface-elevated hover:bg-dark-surface border border-border-dim hover:border-cyan-accent text-slate-300 hover:text-cyan-accent px-4 py-2 rounded-lg text-xs font-semibold shadow-md cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5 text-cyan-accent" />
            Test Hand
          </Link>

          {isOwner && (
            <>
              <Link
                to={`/decks/${deck.id}/edit`}
                className="flex items-center gap-2 bg-dark-surface-elevated hover:bg-dark-surface border border-border-dim hover:border-cyan-accent text-slate-300 hover:text-cyan-accent px-4 py-2 rounded-lg text-xs font-semibold shadow-md cursor-pointer"
              >
                <Edit className="w-3.5 h-3.5" />
                Edit Deck
              </Link>
              <button
                onClick={handleDelete}
                disabled={isDeleting}
                className="flex items-center gap-2 bg-red-950/20 hover:bg-red-950/40 border border-red-500/30 hover:border-red-500/60 text-red-400 px-4 py-2 rounded-lg text-xs font-semibold shadow-md cursor-pointer disabled:opacity-50"
                type="button"
              >
                <Trash2 className="w-3.5 h-3.5" />
                {isDeleting ? "Deleting..." : "Delete Deck"}
              </button>
            </>
          )}
        </div>
      </div>

      {deleteError && (
        <div className="bg-red-950/20 border border-red-500/30 text-red-400 rounded-lg p-4 mb-6 text-sm">
          {deleteError}
        </div>
      )}

      <div className="bg-dark-surface border border-border-dim rounded-2xl p-6 md:p-8 mb-8 relative overflow-hidden shadow-lg">
        <div className="absolute inset-0 bg-radial from-cyan-accent/5 via-transparent to-transparent pointer-events-none"></div>
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-4">
          <div className="flex items-center gap-3">
            <Badge variant="gold">{deck.formatName}</Badge>
            <span className="text-xs text-slate-500 font-semibold uppercase tracking-wider">
              by {deck.creatorUsername || "Community"}
            </span>
          </div>
          <div className="flex items-center gap-4 text-xs text-slate-500">
            <span className="flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5" />
              Updated {formatRelativeTime(deck.updatedAt)}
            </span>
            <span className="flex items-center gap-1">
              <Layers className="w-3.5 h-3.5 text-cyan-accent" />
              {totalCount} Cards Total
            </span>
          </div>
        </div>

        <h1 className="font-display text-2xl md:text-4xl font-black text-white mb-3">
          {deck.name}
        </h1>
        <p className="text-sm md:text-base text-slate-400 max-w-3xl leading-relaxed font-light">
          {deck.description || "No description provided."}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <aside className="lg:col-span-4 space-y-6">
          <div className="bg-dark-surface border border-border-dim rounded-2xl p-5 shadow-md">
            <h2 className="font-display text-base font-bold text-white mb-4 border-b border-border-dim/60 pb-2">
              Deck Analytics
            </h2>

            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-xs text-slate-400 mb-1.5 font-medium">
                  <span>Main Deck</span>
                  <span className="font-bold text-white">{mainCount} / 60</span>
                </div>
                <div className="w-full bg-slate-950 rounded-full h-2 overflow-hidden border border-border-dim/40">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      mainCount < 40 ? "bg-amber-500" : "bg-cyan-accent"
                    }`}
                    style={{ width: `${Math.min(100, (mainCount / 60) * 100)}%` }}
                  ></div>
                </div>
                {mainCount < 40 && (
                  <span className="text-[10px] text-amber-400 mt-1 block">
                    * Format limit requires at least 40 cards.
                  </span>
                )}
              </div>

              <div>
                <div className="flex justify-between text-xs text-slate-400 mb-1.5 font-medium">
                  <span>Extra Deck</span>
                  <span className="font-bold text-white">{extraCount} / 15</span>
                </div>
                <div className="w-full bg-slate-950 rounded-full h-2 overflow-hidden border border-border-dim/40">
                  <div
                    className="h-full rounded-full bg-gold-accent transition-all duration-500"
                    style={{ width: `${Math.min(100, (extraCount / 15) * 100)}%` }}
                  ></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs text-slate-400 mb-1.5 font-medium">
                  <span>Side Deck</span>
                  <span className="font-bold text-white">{sideCount} / 15</span>
                </div>
                <div className="w-full bg-slate-950 rounded-full h-2 overflow-hidden border border-border-dim/40">
                  <div
                    className="h-full rounded-full bg-purple-400 transition-all duration-500"
                    style={{ width: `${Math.min(100, (sideCount / 15) * 100)}%` }}
                  ></div>
                </div>
              </div>
            </div>

            {mainCount > 0 && (
              <div className="mt-6 pt-6 border-t border-border-dim/60 space-y-4">
                <h3 className="text-xs text-slate-400 uppercase font-bold tracking-wider mb-2">
                  Main Deck Composition
                </h3>

                <div className="space-y-3">
                  <div>
                    <div className="flex justify-between text-xs text-slate-400 mb-1">
                      <span className="flex items-center gap-1.5">
                        <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
                        Monsters
                      </span>
                      <span className="font-semibold text-white">{mainMonstersCount}</span>
                    </div>
                    <div className="w-full bg-slate-950 rounded-full h-1.5 overflow-hidden">
                      <div
                        className="h-full bg-amber-500"
                        style={{ width: `${(mainMonstersCount / mainCount) * 100}%` }}
                      ></div>
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-xs text-slate-400 mb-1">
                      <span className="flex items-center gap-1.5">
                        <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
                        Spells
                      </span>
                      <span className="font-semibold text-white">{mainSpellsCount}</span>
                    </div>
                    <div className="w-full bg-slate-950 rounded-full h-1.5 overflow-hidden">
                      <div
                        className="h-full bg-emerald-500"
                        style={{ width: `${(mainSpellsCount / mainCount) * 100}%` }}
                      ></div>
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-xs text-slate-400 mb-1">
                      <span className="flex items-center gap-1.5">
                        <span className="w-2.5 h-2.5 rounded-full bg-rose-500"></span>
                        Traps
                      </span>
                      <span className="font-semibold text-white">{mainTrapsCount}</span>
                    </div>
                    <div className="w-full bg-slate-950 rounded-full h-1.5 overflow-hidden">
                      <div
                        className="h-full bg-rose-500"
                        style={{ width: `${(mainTrapsCount / mainCount) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </aside>

        <div className="lg:col-span-8 space-y-8">
          <div className="bg-dark-surface border border-border-dim rounded-2xl p-5 md:p-6 shadow-md">
            <div className="flex justify-between items-center mb-4 border-b border-border-dim/60 pb-3">
              <h2 className="font-display text-base font-bold text-white flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-cyan-accent" />
                Main Deck
              </h2>
              <Badge variant="cyan" className="text-xs font-semibold px-2 py-0.5 rounded">
                {mainCount} Cards
              </Badge>
            </div>

            {mainCards.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
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
              <div className="text-center py-8 text-slate-500 text-sm">
                No cards added to the Main Deck.
              </div>
            )}
          </div>

          <div className="bg-dark-surface border border-border-dim rounded-2xl p-5 md:p-6 shadow-md">
            <div className="flex justify-between items-center mb-4 border-b border-border-dim/60 pb-3">
              <h2 className="font-display text-base font-bold text-white flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-gold-accent" />
                Extra Deck
              </h2>
              <Badge variant="gold" className="text-xs font-semibold px-2 py-0.5 rounded">
                {extraCount} Cards
              </Badge>
            </div>

            {extraCards.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
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
              <div className="text-center py-8 text-slate-500 text-sm">
                No cards added to the Extra Deck.
              </div>
            )}
          </div>

          <div className="bg-dark-surface border border-border-dim rounded-2xl p-5 md:p-6 shadow-md">
            <div className="flex justify-between items-center mb-4 border-b border-border-dim/60 pb-3">
              <h2 className="font-display text-base font-bold text-white flex items-center gap-2">
                <Layers className="w-4 h-4 text-purple-400" />
                Side Deck
              </h2>
              <Badge variant="purple" className="text-xs font-semibold px-2 py-0.5 rounded">
                {sideCount} Cards
              </Badge>
            </div>

            {sideCards.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
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
              <div className="text-center py-8 text-slate-500 text-sm">
                No cards added to the Side Deck.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
