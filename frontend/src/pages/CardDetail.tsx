import { ArrowLeft, Flame, Shield, Star } from "lucide-react";
import { useNavigate, useParams } from "react-router";
import ErrorAlert from "../components/ErrorAlert";
import LoadingSpinner from "../components/LoadingSpinner";
import Badge from "../components/ui/Badge";
import Button from "../components/ui/Button";
import { useFetch } from "../hooks/useFetch";
import { getCardEndpoint } from "../services/card";
import type { Card } from "../types";

export default function CardDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const { data: card, loading, error } = useFetch<Card>(id ? getCardEndpoint(id) : null);

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

  let bgGradient = "from-slate-500/5";
  if (isSpell) {
    bgGradient = "from-emerald-500/5";
  } else if (isTrap) {
    bgGradient = "from-rose-500/5";
  } else if (isMonster) {
    bgGradient = "from-amber-500/5";
  }

  return (
    <div className={`relative min-h-[80vh] bg-linear-to-b ${bgGradient} to-transparent`}>
      <div className="max-w-6xl mx-auto px-6 py-12">
        <Button
          variant="ghost"
          onClick={() => navigate(-1)}
          className="mb-8 group text-slate-400 font-normal px-2.5 py-1"
          type="button"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          <span>Back</span>
        </Button>

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
                <Badge
                  variant={isSpell ? "spell" : isTrap ? "trap" : isMonster ? "monster" : "default"}
                  className="rounded-full px-3 py-1 text-xs"
                >
                  {card.type}
                </Badge>

                <div className="flex gap-3">
                  {card.attribute && (
                    <Badge
                      variant="default"
                      className="text-xs font-semibold text-white px-2.5 py-1 rounded-md"
                    >
                      {card.attribute}
                    </Badge>
                  )}
                  {isMonster && card.level && (
                    <Badge
                      variant="gold"
                      className="flex items-center gap-1 px-2.5 py-1 rounded-md"
                    >
                      <Star className="w-3.5 h-3.5 fill-current" />
                      <span className="text-xs font-bold">Level {card.level}</span>
                    </Badge>
                  )}
                  {isMonster && card.linkVal && (
                    <Badge
                      variant="cyan"
                      className="flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-bold"
                    >
                      LINK-{card.linkVal}
                    </Badge>
                  )}
                  {isMonster && card.scale !== undefined && card.scale !== null && (
                    <Badge
                      variant="purple"
                      className="flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-bold"
                    >
                      Scale {card.scale}
                    </Badge>
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
