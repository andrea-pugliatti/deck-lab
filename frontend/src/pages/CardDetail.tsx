import { ArrowLeft, Flame, Shield, Star } from "lucide-react";
import { useRef, useState, type MouseEvent } from "react";
import { useNavigate, useParams } from "react-router";

import ErrorAlert from "../components/ErrorAlert";
import LoadingSpinner from "../components/LoadingSpinner";
import Badge from "../components/ui/Badge";
import Button from "../components/ui/Button";
import { useFetch } from "../hooks/useFetch";
import { getCardEndpoint } from "../services/card";
import type { Card } from "../types";
import { getCardTheme } from "../utils/card";

/**
 * CardDetail Page Component.
 *
 * Displays detailed information about a specific card, including its stats (ATK, DEF, level, etc.),
 * description, attributes, and type badges. It also features an interactive 3D rotation hover effect
 * on the card artwork.
 *
 * @returns {React.JSX.Element} The CardDetail component.
 */
export default function CardDetail(): React.JSX.Element {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const containerRef = useRef<HTMLDivElement>(null);
  const [rotateX, setRotateX] = useState(0);
  const [rotateY, setRotateY] = useState(0);

  /**
   * Calculates and sets the 3D rotation angles (X and Y) based on the cursor position
   * relative to the artwork container to create a tilting effect.
   *
   * @param {MouseEvent<HTMLDivElement>} e - The mouse move event.
   */
  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;

    const mouseX = e.clientX - rect.left - width / 2;
    const mouseY = e.clientY - rect.top - height / 2;

    const rX = -(mouseY / (height / 2)) * 12;
    const rY = (mouseX / (width / 2)) * 12;

    setRotateX(rX);
    setRotateY(rY);
  };

  /**
   * Resets the 3D rotation angles to 0 when the mouse leaves the artwork container.
   */
  const handleMouseLeave = () => {
    setRotateX(0);
    setRotateY(0);
  };

  const { data: card, loading, error } = useFetch<Card>(id ? getCardEndpoint(id) : undefined);

  if (loading) {
    return <LoadingSpinner size="lg" className="min-h-[60vh]" />;
  }

  if (error || !card) {
    return (
      <div className="mx-auto max-w-3xl px-6 py-12">
        <ErrorAlert
          title="Failed to load card details"
          message={error?.message || "Card not found"}
          onRetry={() => navigate("/cards")}
          retryText="Back to Catalog"
        />
      </div>
    );
  }

  const { bgGradient, badgeVariant, type: cardThemeType } = getCardTheme(card.type);
  const isMonster = cardThemeType === "monster";

  return (
    <div className={`relative min-h-[80vh] bg-linear-to-b ${bgGradient} to-transparent`}>
      <div className="mx-auto max-w-6xl px-6 py-12">
        <Button
          variant="ghost"
          onClick={() => navigate(-1)}
          className="group mb-8 px-2.5 py-1 font-normal text-slate-400"
          type="button"
        >
          <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
          <span>Back</span>
        </Button>

        <div className="bg-dark-surface border-border-dim grid grid-cols-1 gap-10 rounded-2xl border p-6 shadow-xl backdrop-blur-sm md:grid-cols-12 md:p-10">
          {/* Card Artwork */}
          <div
            className="flex flex-col items-center md:col-span-5"
            ref={containerRef}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            style={{
              perspective: "1000px",
            }}
          >
            <div
              className="bg-dark-surface-elevated border-border-dim group relative aspect-244/356 w-full max-w-sm overflow-hidden rounded-xl border shadow-2xl transition-transform duration-300 ease-out"
              style={{
                transform: `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`,
                transformStyle: "preserve-3d",
              }}
            >
              {card.imageUrl ? (
                <img
                  src={`/api/${card.imageUrl}`}
                  alt={card.name}
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="flex h-full w-full flex-col items-center justify-center p-6 text-center text-slate-600">
                  <span className="font-display mb-2 text-lg font-bold tracking-widest uppercase">
                    [ No Artwork ]
                  </span>
                  <span className="text-xs text-slate-500">{card.archetype || card.race}</span>
                </div>
              )}
            </div>
          </div>

          {/* Card Details */}
          <div className="flex flex-col justify-between space-y-6 md:col-span-7">
            <div>
              <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
                <Badge variant={badgeVariant} className="rounded-full px-3 py-1 text-xs">
                  {card.type}
                </Badge>

                <div className="flex gap-3">
                  {card.attribute && (
                    <Badge
                      variant="default"
                      className="rounded-md px-2.5 py-1 font-semibold text-white"
                    >
                      {card.attribute}
                    </Badge>
                  )}
                  {isMonster && card.level && (
                    <Badge
                      variant="gold"
                      className="flex items-center gap-1 rounded-md px-2.5 py-1"
                    >
                      <Star className="h-3.5 w-3.5 fill-current" />
                      <span className="text-xs font-bold">Level {card.level}</span>
                    </Badge>
                  )}
                  {isMonster && card.linkVal && (
                    <Badge
                      variant="cyan"
                      className="flex items-center gap-1 rounded-md px-2.5 py-1 text-xs font-bold"
                    >
                      LINK-{card.linkVal}
                    </Badge>
                  )}
                  {isMonster && card.scale !== undefined && card.scale !== null && (
                    <Badge
                      variant="purple"
                      className="flex items-center gap-1 rounded-md px-2.5 py-1 text-xs font-bold"
                    >
                      Scale {card.scale}
                    </Badge>
                  )}
                </div>
              </div>

              <h1 className="font-display mb-6 text-3xl leading-tight font-black text-white md:text-4xl">
                {card.name}
              </h1>

              {/* Monster Stats Grid */}
              {isMonster && (card.atk !== undefined || card.def !== undefined) && (
                <div className="mb-6 grid max-w-sm grid-cols-2 gap-4">
                  <div className="bg-dark-surface-elevated border-border-dim flex items-center gap-3 rounded-xl border p-4">
                    <div className="rounded-lg bg-amber-500/10 p-2 text-amber-500">
                      <Flame className="h-5 w-5 fill-current" />
                    </div>
                    <div>
                      <div className="text-[10px] font-semibold text-slate-500 uppercase">
                        Attack
                      </div>
                      <div className="text-lg font-bold text-white">
                        {card.atk === -1 ? "?" : card.atk}
                      </div>
                    </div>
                  </div>
                  {!card.linkVal && (
                    <div className="bg-dark-surface-elevated border-border-dim flex items-center gap-3 rounded-xl border p-4">
                      <div className="rounded-lg bg-blue-500/10 p-2 text-blue-500">
                        <Shield className="h-5 w-5" />
                      </div>
                      <div>
                        <div className="text-[10px] font-semibold text-slate-500 uppercase">
                          Defense
                        </div>
                        <div className="text-lg font-bold text-white">
                          {card.def === -1 ? "?" : card.def}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Classification Info */}
              <div className="bg-dark-surface-elevated border-border-dim mb-6 space-y-3 rounded-xl border p-5">
                <div className="grid grid-cols-2 gap-4 text-sm md:grid-cols-3">
                  {card.race && (
                    <div>
                      <span className="mb-0.5 block text-xs font-medium text-slate-500 uppercase">
                        Race / Class
                      </span>
                      <span className="font-semibold text-slate-200">{card.race}</span>
                    </div>
                  )}
                  {card.archetype && (
                    <div>
                      <span className="mb-0.5 block text-xs font-medium text-slate-500 uppercase">
                        Archetype
                      </span>
                      <span className="font-semibold text-slate-200">{card.archetype}</span>
                    </div>
                  )}
                  <div>
                    <span className="mb-0.5 block text-xs font-medium text-slate-500 uppercase">
                      Card ID
                    </span>
                    <span className="font-mono text-xs text-slate-400">{card.id}</span>
                  </div>
                </div>
              </div>

              {/* Effect Text */}
              <div>
                <h3 className="mb-2 text-sm font-bold tracking-wider text-slate-400 uppercase">
                  Card Text / Effect
                </h3>
                <div className="bg-dark-surface-elevated/40 border-border-dim/60 rounded-xl border p-6 font-sans text-sm leading-relaxed font-light whitespace-pre-line text-slate-200">
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
