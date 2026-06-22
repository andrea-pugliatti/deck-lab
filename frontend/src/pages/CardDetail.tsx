import { ArrowLeft, Flame, Shield, Star } from "lucide-react";
import { useNavigate, useParams } from "react-router";
import ErrorAlert from "../components/ErrorAlert";
import LoadingSpinner from "../components/LoadingSpinner";
import { useFetch } from "../hooks/useFetch";
import type { Card } from "../types";

export default function CardDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const { data: card, loading, error } = useFetch<Card>(id ? `/api/cards/${id}` : null);

  if (loading) {
    return <LoadingSpinner size="lg" className="min-h-[60vh]" />;
  }

  if (error || !card) {
    return (
      <div className="max-w-3xl mx-auto px-6 py-12">
        <ErrorAlert
          title="Failed to load card details"
          message={error?.message || "Card not found"}
          onRetry={() => navigate("/cards")}
          retryText="Back to Catalog"
        />
      </div>
    );
  }

  const isMonster = card.type.toLowerCase().includes("monster");
  const isSpell = card.type.toLowerCase().includes("spell");
  const isTrap = card.type.toLowerCase().includes("trap");

  let cardThemeColor = "border-slate-500/30 text-slate-400";
  let bgGradient = "from-slate-500/5";
  if (isSpell) {
    cardThemeColor = "border-emerald-500/30 text-emerald-400";
    bgGradient = "from-emerald-500/5";
  } else if (isTrap) {
    cardThemeColor = "border-rose-500/30 text-rose-400";
    bgGradient = "from-rose-500/5";
  } else if (isMonster) {
    cardThemeColor = "border-amber-500/30 text-amber-400";
    bgGradient = "from-amber-500/5";
  }

  return (
    <div className={`relative min-h-[80vh] bg-linear-to-b ${bgGradient} to-transparent`}>
      <div className="max-w-6xl mx-auto px-6 py-12">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-slate-400 hover:text-white mb-8 transition-colors duration-200 cursor-pointer group"
          type="button"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          <span>Back</span>
        </button>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 bg-dark-surface border border-border-dim rounded-2xl p-6 md:p-10 shadow-xl backdrop-blur-sm">
          {/* Card Artwork */}
          <div className="md:col-span-5 flex flex-col items-center">
            <div className="relative w-full max-w-sm aspect-244/356 bg-dark-surface-elevated rounded-xl border border-border-dim shadow-2xl overflow-hidden group">
              {card.imageUrl ? (
                <img
                  src={`/api/${card.imageUrl}`}
                  alt={card.name}
                  className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-500"
                />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center text-slate-600 p-6 text-center">
                  <span className="font-display text-lg font-bold uppercase tracking-widest mb-2">
                    [ No Artwork ]
                  </span>
                  <span className="text-xs text-slate-500">{card.archetype || card.race}</span>
                </div>
              )}
            </div>
          </div>

          {/* Card Details */}
          <div className="md:col-span-7 flex flex-col justify-between space-y-6">
            <div>
              <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
                <span
                  className={`text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full border bg-dark-surface-elevated ${cardThemeColor}`}
                >
                  {card.type}
                </span>

                <div className="flex gap-3">
                  {card.attribute && (
                    <span className="text-xs font-semibold text-white bg-slate-900 border border-border-dim px-2.5 py-1 rounded-md uppercase tracking-wide">
                      {card.attribute}
                    </span>
                  )}
                  {isMonster && card.level && (
                    <div className="flex items-center gap-1 text-gold-accent bg-gold-accent/10 border border-gold-accent/20 px-2.5 py-1 rounded-md">
                      <Star className="w-4 h-4 fill-current" />
                      <span className="text-xs font-bold">Level {card.level}</span>
                    </div>
                  )}
                  {isMonster && card.linkVal && (
                    <div className="flex items-center gap-1 text-cyan-accent bg-cyan-accent/10 border border-cyan-accent/20 px-2.5 py-1 rounded-md">
                      <span className="text-xs font-bold">LINK-{card.linkVal}</span>
                    </div>
                  )}
                  {isMonster && card.scale !== undefined && card.scale !== null && (
                    <div className="flex items-center gap-1 text-purple-400 bg-purple-400/10 border border-purple-400/20 px-2.5 py-1 rounded-md">
                      <span className="text-xs font-bold">Scale {card.scale}</span>
                    </div>
                  )}
                </div>
              </div>

              <h1 className="font-display text-3xl md:text-4xl font-black text-white mb-6 leading-tight">
                {card.name}
              </h1>

              {/* Monster Stats Grid */}
              {isMonster && (card.atk !== undefined || card.def !== undefined) && (
                <div className="grid grid-cols-2 gap-4 max-w-sm mb-6">
                  <div className="bg-dark-surface-elevated border border-border-dim rounded-xl p-4 flex items-center gap-3">
                    <div className="p-2 bg-amber-500/10 text-amber-500 rounded-lg">
                      <Flame className="w-5 h-5 fill-current" />
                    </div>
                    <div>
                      <div className="text-[10px] text-slate-500 uppercase font-semibold">
                        Attack
                      </div>
                      <div className="text-lg font-bold text-white">
                        {card.atk === -1 ? "?" : card.atk}
                      </div>
                    </div>
                  </div>

                  <div className="bg-dark-surface-elevated border border-border-dim rounded-xl p-4 flex items-center gap-3">
                    <div className="p-2 bg-blue-500/10 text-blue-500 rounded-lg">
                      <Shield className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="text-[10px] text-slate-500 uppercase font-semibold">
                        Defense
                      </div>
                      <div className="text-lg font-bold text-white">
                        {card.def === -1 ? "?" : card.def}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Classification Info */}
              <div className="bg-dark-surface-elevated border border-border-dim rounded-xl p-5 mb-6 space-y-3">
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
                  {card.race && (
                    <div>
                      <span className="text-slate-500 block text-xs uppercase font-medium mb-0.5">
                        Race / Class
                      </span>
                      <span className="text-slate-200 font-semibold">{card.race}</span>
                    </div>
                  )}
                  {card.archetype && (
                    <div>
                      <span className="text-slate-500 block text-xs uppercase font-medium mb-0.5">
                        Archetype
                      </span>
                      <span className="text-slate-200 font-semibold">{card.archetype}</span>
                    </div>
                  )}
                  <div>
                    <span className="text-slate-500 block text-xs uppercase font-medium mb-0.5">
                      Card ID
                    </span>
                    <span className="text-slate-400 font-mono text-xs">{card.id}</span>
                  </div>
                </div>
              </div>

              {/* Effect Text */}
              <div>
                <h3 className="text-sm text-slate-400 uppercase font-bold tracking-wider mb-2">
                  Card Text / Effect
                </h3>
                <div className="bg-dark-surface-elevated/40 border border-border-dim/60 rounded-xl p-6 text-slate-200 text-sm leading-relaxed whitespace-pre-line font-sans font-light">
                  {card.description || "No description text available."}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
