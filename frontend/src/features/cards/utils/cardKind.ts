/**
 * Primary domain classification kinds for cards.
 */
export type CardKind = "monster" | "spell" | "trap" | "default";

/**
 * Pure domain classification function that maps a card's raw type string
 * (e.g. "Normal Spell Card", "Continuous Trap", "Flip Effect Monster")
 * into its primary canonical card kind.
 *
 * @param typeString - The type description of the card.
 * @returns The resolved {@link CardKind}.
 */
export function getCardKind(typeString?: string): CardKind {
  const type = typeString?.toLowerCase() ?? "";
  if (type.includes("spell")) return "spell";
  if (type.includes("trap")) return "trap";
  if (type.includes("monster")) return "monster";
  return "default";
}
