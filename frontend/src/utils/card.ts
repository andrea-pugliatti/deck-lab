export interface CardTheme {
  type: "monster" | "spell" | "trap" | "default";
  borderColor: string;
  glowColor: string;
  barColor: string;
  badgeVariant: "monster" | "spell" | "trap" | "default";
  gridBadgeColor: string;
  deckBadgeColor: string;
  bgGradient: string;
}

export function getCardTheme(typeString?: string): CardTheme {
  const type = typeString?.toLowerCase() || "";
  const isMonster = type.includes("monster");
  const isSpell = type.includes("spell");
  const isTrap = type.includes("trap");

  if (isSpell) {
    return {
      type: "spell",
      borderColor: "border-emerald-500/20",
      glowColor: "hover:shadow-[0_0_15px_rgba(16,185,129,0.3)] hover:border-emerald-500/40",
      barColor: "bg-emerald-500",
      badgeVariant: "spell",
      gridBadgeColor: "text-emerald-400 bg-emerald-400/10 border-emerald-400/20",
      deckBadgeColor: "border-emerald-500/20 text-emerald-400 bg-emerald-500/5",
      bgGradient: "from-emerald-500/5",
    };
  }

  if (isTrap) {
    return {
      type: "trap",
      borderColor: "border-rose-500/20",
      glowColor: "hover:shadow-[0_0_15px_rgba(244,63,94,0.3)] hover:border-rose-500/40",
      barColor: "bg-rose-500",
      badgeVariant: "trap",
      gridBadgeColor: "text-rose-400 bg-rose-400/10 border-rose-400/20",
      deckBadgeColor: "border-rose-500/20 text-rose-400 bg-rose-500/5",
      bgGradient: "from-rose-500/5",
    };
  }

  if (isMonster) {
    return {
      type: "monster",
      borderColor: "border-amber-500/20",
      glowColor: "hover:shadow-[0_0_15px_rgba(245,158,11,0.35)] hover:border-amber-500/40",
      barColor: "bg-amber-500",
      badgeVariant: "monster",
      gridBadgeColor: "text-amber-400 bg-amber-400/10 border-amber-400/20",
      deckBadgeColor: "border-amber-500/20 text-amber-400 bg-amber-500/5",
      bgGradient: "from-amber-500/5",
    };
  }

  return {
    type: "default",
    borderColor: "border-slate-500/20",
    glowColor: "hover:shadow-[0_0_15px_rgba(148,163,184,0.3)] hover:border-slate-500/40",
    barColor: "bg-slate-500/40",
    badgeVariant: "default",
    gridBadgeColor: "text-slate-400 bg-slate-400/10",
    deckBadgeColor: "border-slate-500/20 text-slate-400 bg-slate-500/5",
    bgGradient: "from-slate-500/5",
  };
}
