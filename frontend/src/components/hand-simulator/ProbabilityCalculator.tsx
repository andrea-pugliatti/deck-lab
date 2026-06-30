import { Calculator, TrendingUp, X } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";

import type { DeckCardItem } from "../../types";
import { getCardTheme } from "../../utils/card";
import { calculateProbability } from "../../utils/probability";
import Badge from "../ui/Badge";

/**
 * Props for the {@link ProbabilityCalculator} component.
 */
interface ProbabilityCalculatorProps {
  cards: DeckCardItem[];
  onClose: () => void;
}

/**
 * ProbabilityCalculator component computes and displays hypergeometric distribution
 * probabilities for drawing cards in a starting hand (5 or 6 cards).
 *
 * @param props - Component props.
 * @returns A `<dialog>` element rendered as a modal consistency analytics view.
 */
export default function ProbabilityCalculator({ cards, onClose }: ProbabilityCalculatorProps) {
  const [handSize, setHandSize] = useState<5 | 6>(5);
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (dialog) {
      if (!dialog.open) {
        dialog.showModal();
      }
      const handleClose = () => {
        onClose();
      };
      dialog.addEventListener("close", handleClose);
      return () => {
        dialog.removeEventListener("close", handleClose);
      };
    }
  }, [onClose]);

  const mainCards = useMemo(() => {
    return cards.filter((c) => c.section === "MAIN" || !c.section);
  }, [cards]);

  const totalMainCount = useMemo(() => {
    return mainCards.reduce((acc, c) => acc + (c.quantity || 0), 0);
  }, [mainCards]);

  const uniqueCardsList = useMemo(() => {
    return [...mainCards].sort((a, b) => a.name.localeCompare(b.name));
  }, [mainCards]);

  const handleBackdropClick = (e: React.MouseEvent<HTMLDialogElement>) => {
    if (e.target === dialogRef.current) {
      dialogRef.current?.close();
    }
  };

  return (
    <dialog
      ref={dialogRef}
      onClick={handleBackdropClick}
      className="max-h-[85vh] w-full max-w-3xl overflow-visible border-none bg-transparent p-4 text-white backdrop:bg-black/75 backdrop:backdrop-blur-sm focus:outline-none"
    >
      <div className="bg-dark-surface border-border-dim relative flex max-h-[80vh] w-full flex-col overflow-hidden rounded-2xl border shadow-2xl">
        <div className="from-cyan-accent/5 pointer-events-none absolute inset-0 bg-radial via-transparent to-transparent"></div>

        <div className="border-border-dim/60 bg-dark-surface-elevated/40 flex items-center justify-between border-b p-5">
          <div>
            <h3 className="font-display flex items-center gap-2 text-base font-bold text-white">
              <Calculator className="text-cyan-accent h-4 w-4" />
              CONSISTENCY ANALYTICS
            </h3>
            <p className="mt-0.5 text-[10px] font-bold tracking-wider text-slate-500 uppercase">
              Probability calculations for starting hand
            </p>
          </div>

          <div className="flex items-center gap-4">
            <div className="border-border-dim/50 relative flex shrink-0 items-center rounded-xl border bg-slate-950 p-1">
              <button
                onClick={() => setHandSize(5)}
                className={`relative z-10 cursor-pointer rounded-lg px-4 py-1.5 text-[10px] font-bold tracking-wider uppercase transition-all duration-300 ${
                  handSize === 5 ? "text-dark-bg" : "text-slate-400 hover:text-slate-200"
                }`}
              >
                {handSize === 5 && (
                  <div className="bg-cyan-accent absolute inset-0 -z-10 rounded-lg shadow-[0_0_12px_rgba(6,182,212,0.4)] transition-all duration-300"></div>
                )}
                5 Cards (Go First)
              </button>
              <button
                onClick={() => setHandSize(6)}
                className={`relative z-10 cursor-pointer rounded-lg px-4 py-1.5 text-[10px] font-bold tracking-wider uppercase transition-all duration-300 ${
                  handSize === 6 ? "text-dark-bg" : "text-slate-400 hover:text-slate-200"
                }`}
              >
                {handSize === 6 && (
                  <div className="bg-cyan-accent absolute inset-0 -z-10 rounded-lg shadow-[0_0_12px_rgba(6,182,212,0.4)] transition-all duration-300"></div>
                )}
                6 Cards (Go Second)
              </button>
            </div>

            <button
              onClick={() => {
                dialogRef.current?.close();
              }}
              className="bg-dark-surface-elevated cursor-pointer rounded-lg p-1 text-slate-400 transition-colors hover:bg-slate-800 hover:text-white"
              type="button"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        <div className="flex-1 space-y-4 overflow-y-hidden p-6">
          {totalMainCount < handSize ? (
            <div className="py-8 text-center text-xs text-slate-500">
              Please add at least {handSize} cards to the Main Deck to compute statistics.
            </div>
          ) : (
            <>
              <div className="relative flex items-start gap-4 rounded-2xl border border-cyan-500/10 bg-linear-to-r from-cyan-950/15 to-purple-950/5 p-4 text-xs">
                <div className="pointer-events-none absolute top-0 right-0 h-24 w-24 rounded-full bg-cyan-500/5 blur-2xl"></div>
                <div className="text-cyan-accent shrink-0 rounded-xl border border-cyan-500/20 bg-cyan-500/10 p-2.5">
                  <TrendingUp className="h-4 w-4" />
                </div>
                <div className="space-y-0.5">
                  <h4 className="text-cyan-accent/90 text-[10px] font-semibold tracking-wide uppercase">
                    Probability Context
                  </h4>
                  <p className="font-sans leading-relaxed font-light text-slate-400">
                    Calculated using the{" "}
                    <span className="font-medium text-white">Hypergeometric Distribution</span>.
                    Shows chances of drawing{" "}
                    <span className="font-semibold text-white">1+, 2+, or 3+ copies</span> in a
                    starting hand of{" "}
                    <span className="text-cyan-accent font-semibold">{handSize} cards</span> from a{" "}
                    <span className="font-semibold text-white">{totalMainCount}-card</span> deck.
                  </p>
                </div>
              </div>

              <div className="overflow-x-auto">
                <div className="min-w-137.5 space-y-2 pb-2">
                  <div className="border-border-dim/60 grid grid-cols-12 gap-4 border-b px-4 py-2 pb-3 text-[10px] font-bold tracking-wider text-slate-500 uppercase">
                    <div className="col-span-4 pl-4">Card Name</div>
                    <div className="col-span-2 text-center">In Deck</div>
                    <div className="col-span-2 text-right">Draw 1+</div>
                    <div className="col-span-2 text-right">Draw 2+</div>
                    <div className="col-span-2 text-right">Draw 3+</div>
                  </div>

                  <div className="max-h-110 scrollbar-none space-y-2 overflow-y-auto pr-1">
                    {uniqueCardsList.map((card) => {
                      const copies = card.quantity || 0;
                      const prob1 = calculateProbability(totalMainCount, copies, handSize, 1);
                      const prob2 = calculateProbability(totalMainCount, copies, handSize, 2);
                      const prob3 = calculateProbability(totalMainCount, copies, handSize, 3);

                      const { badgeVariant, barColor } = getCardTheme(card.type);

                      return (
                        <div
                          key={card.cardId}
                          className="bg-dark-surface-elevated/10 hover:bg-dark-surface-elevated/20 border-border-dim/40 hover:border-cyan-accent/20 relative overflow-hidden rounded-xl border py-3 pr-4 pl-4 transition-all duration-200"
                        >
                          <div
                            className={`absolute top-0 bottom-0 left-0 w-1 ${barColor} shadow-[0_0_8px_rgba(255,255,255,0.2)]`}
                          ></div>

                          <div className="grid grid-cols-12 items-center gap-4">
                            <div className="col-span-4 flex flex-col gap-1.5">
                              <span className="font-display text-xs leading-tight font-bold tracking-wide text-white">
                                {card.name}
                              </span>
                              <span className="self-start">
                                <Badge
                                  variant={badgeVariant}
                                  className="rounded-md px-1.5 py-0.5 text-[8px] leading-none font-bold tracking-wider"
                                >
                                  {card.type?.replace(" Monster", "").replace(" Card", "")}
                                </Badge>
                              </span>
                            </div>

                            <div className="col-span-2 text-center">
                              <span className="border-border-dim/40 rounded-lg border bg-slate-950/60 px-2 py-1 font-mono text-xs font-bold text-white">
                                {copies}
                              </span>
                            </div>

                            <div className="text-cyan-accent col-span-2 text-right font-mono text-xs font-bold">
                              {(prob1 * 100).toFixed(1)}%
                            </div>
                            <div className="col-span-2 text-right font-mono text-xs font-semibold text-slate-300">
                              {copies >= 2 ? (
                                `${(prob2 * 100).toFixed(1)}%`
                              ) : (
                                <span className="text-slate-600">-</span>
                              )}
                            </div>

                            <div className="col-span-2 text-right font-mono text-xs text-slate-400">
                              {copies >= 3 ? (
                                `${(prob3 * 100).toFixed(1)}%`
                              ) : (
                                <span className="text-slate-600">-</span>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </dialog>
  );
}
