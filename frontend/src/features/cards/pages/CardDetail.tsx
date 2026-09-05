import { useQuery } from "@tanstack/react-query";
import { ArrowLeft, Flame, Shield, Star } from "lucide-react";
import { useRef, type MouseEvent } from "react";
import { Link, useParams } from "react-router";

import ErrorAlert from "../../../components/feedback/ErrorAlert";
import InvalidIdState from "../../../components/feedback/InvalidIdState";
import LoadingSpinner from "../../../components/feedback/LoadingSpinner";
import Badge from "../../../components/ui/Badge";
import { API_BASE_URL } from "../../../config/env";
import { getCardTheme } from "../../../features/cards/utils/cardTheme";
import { cardQueries } from "../../../services/queryOptions";
import { isValidNumericId } from "../../../utils/validation";

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
  const isValidId = isValidNumericId(id);
  const containerRef = useRef<HTMLDivElement>(null);
  const cardArtworkRef = useRef<HTMLDivElement>(null);

  /**
   * Calculates and sets the 3D rotation angles (X and Y) using requestAnimationFrame
   * to avoid triggering component-level React re-renders on mousemove.
   *
   * @param {MouseEvent<HTMLDivElement>} e - The mouse move event.
   */
  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current || !cardArtworkRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const width = rect.width || 1;
    const height = rect.height || 1;

    const mouseX = e.clientX - rect.left - width / 2;
    const mouseY = e.clientY - rect.top - height / 2;

    const rX = -(mouseY / (height / 2)) * 12;
    const rY = (mouseX / (width / 2)) * 12;

    cardArtworkRef.current.style.transform = `rotateX(${rX}deg) rotateY(${rY}deg)`;
  };

  /**
   * Resets the 3D rotation angles to 0 when the mouse leaves the artwork container.
   */
  const handleMouseLeave = () => {
    if (cardArtworkRef.current) {
      cardArtworkRef.current.style.transform = "rotateX(0deg) rotateY(0deg)";
    }
  };

  const {
    data: card,
    isLoading: loading,
    error,
    refetch,
  } = useQuery({
    ...cardQueries.detail(isValidId ? id : undefined),
    enabled: isValidId,
  });

  if (!isValidId) {
    return <InvalidIdState resourceName="Card" backTo="/cards" backLabel="Back to Catalog" />;
  }

  if (loading) {
    return <LoadingSpinner size="lg" className="min-h-[60vh]" />;
  }

  if (error || !card) {
    return (
      <div className="mx-auto max-w-3xl px-6 py-12">
        <Link
          to="/cards"
          viewTransition
          className="group mb-8 inline-flex items-center gap-2 px-2.5 py-1 text-sm font-normal text-slate-400 no-underline transition-colors hover:text-white"
        >
          <ArrowLeft
            className="size-4 transition-transform group-hover:-translate-x-1"
            aria-hidden="true"
          />
          <span>Back to Catalog</span>
        </Link>
        <ErrorAlert
          title="Failed to load card details"
          message={error?.message || "Card not found"}
          onRetry={() => refetch()}
          retryText="Retry"
        />
      </div>
    );
  }

  const { bgGradient, badgeVariant, type: cardThemeType } = getCardTheme(card.type);
  const isMonster = cardThemeType === "monster";

  return (
    <div className={`relative min-h-[80vh] bg-linear-to-b ${bgGradient} to-transparent`}>
      <div className="mx-auto max-w-6xl px-6 py-12">
        <Link
          to="/cards"
          viewTransition
          className="group mb-8 inline-flex items-center gap-2 px-2.5 py-1 text-sm font-normal text-slate-400 no-underline transition-colors hover:text-white"
        >
          <ArrowLeft
            className="size-4 transition-transform group-hover:-translate-x-1"
            aria-hidden="true"
          />
          <span>Back to Catalog</span>
        </Link>

        <div className="bg-dark-surface border-border-dim grid grid-cols-1 gap-10 rounded-2xl border p-6 shadow-xl backdrop-blur-sm md:grid-cols-12 md:p-10">
          {/* Card Artwork */}
          <div
            className="flex flex-col items-center perspective-[1000px] md:col-span-5"
            ref={containerRef}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
          >
            <div
              ref={cardArtworkRef}
              className="bg-dark-surface-elevated border-border-dim group relative aspect-244/356 w-full max-w-sm overflow-hidden rounded-xl border shadow-2xl transition-transform duration-300 ease-out transform-3d"
            >
              {card.imageUrl ? (
                <img
                  src={`${API_BASE_URL}/api/${card.imageUrl}`}
                  alt={card.name}
                  className="size-full object-cover"
                />
              ) : (
                <div className="flex size-full flex-col items-center justify-center p-6 text-center text-slate-400">
                  <span className="font-display mb-2 text-lg font-bold tracking-widest uppercase">
                    [ No Artwork ]
                  </span>
                  <span className="text-xs text-slate-400">{card.archetype || card.race}</span>
                </div>
              )}
            </div>
          </div>

          {/* Card Details */}
          <div className="flex flex-col justify-between gap-6 md:col-span-7">
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
                      <Star className="size-3.5 fill-current" aria-hidden="true" />
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
                      <Flame className="size-5 fill-current" aria-hidden="true" />
                    </div>
                    <div>
                      <div className="text-2xs font-semibold text-slate-400 uppercase">Attack</div>
                      <div className="text-lg font-bold text-white">
                        {card.atk === -1 ? "?" : card.atk}
                      </div>
                    </div>
                  </div>
                  {!card.linkVal && (
                    <div className="bg-dark-surface-elevated border-border-dim flex items-center gap-3 rounded-xl border p-4">
                      <div className="rounded-lg bg-blue-500/10 p-2 text-blue-500">
                        <Shield className="size-5" aria-hidden="true" />
                      </div>
                      <div>
                        <div className="text-2xs font-semibold text-slate-400 uppercase">
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
                      <span className="mb-0.5 block text-xs font-medium text-slate-400 uppercase">
                        Race / Class
                      </span>
                      <span className="font-semibold text-slate-200">{card.race}</span>
                    </div>
                  )}
                  {card.archetype && (
                    <div>
                      <span className="mb-0.5 block text-xs font-medium text-slate-400 uppercase">
                        Archetype
                      </span>
                      <span className="font-semibold text-slate-200">{card.archetype}</span>
                    </div>
                  )}
                  <div>
                    <span className="mb-0.5 block text-xs font-medium text-slate-400 uppercase">
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
