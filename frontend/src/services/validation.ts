import type { Card, CardSection, DeckCardItem } from "../types";

/**
 * Rules and sizing limitations enforced by a specific Yu-Gi-Oh! game format.
 */
export interface FormatRules {
  minMainSize: number;
  maxMainSize: number;
  maxExtraSize: number;
  maxSideSize: number;
  maxCopiesPerCard: number;
}

/**
 * Standard default format rules applied to TCG/OCG.
 */
export const DEFAULT_RULES: FormatRules = {
  minMainSize: 40,
  maxMainSize: 60,
  maxExtraSize: 15,
  maxSideSize: 15,
  maxCopiesPerCard: 3,
};

/**
 * Mapped collection of game formats and their respective deck size limits.
 */
export const FORMAT_RULES_MAP: Record<string, FormatRules> = {
  TCG: DEFAULT_RULES,
  OCG: DEFAULT_RULES,
  Goat: {
    minMainSize: 40,
    maxMainSize: 100,
    maxExtraSize: 15,
    maxSideSize: 15,
    maxCopiesPerCard: 3,
  },
  "Speed Duel": {
    minMainSize: 20,
    maxMainSize: 30,
    maxExtraSize: 5,
    maxSideSize: 6,
    maxCopiesPerCard: 3,
  },
};

/**
 * Resolves the deck size limits and copy restrictions for a selected format name.
 *
 * @param formatName - The identifier of the deck format (e.g. "Goat", "Speed Duel").
 * @returns The resolved FormatRules settings.
 */
export function getFormatRules(formatName: string): FormatRules {
  return FORMAT_RULES_MAP[formatName] || DEFAULT_RULES;
}

/**
 * Checks if a card's type classification places it in the Extra Deck.
 * Extra Deck cards include Fusion, Synchro, Xyz, and Link monsters.
 *
 * @param cardType - The type classification text of the card.
 * @returns True if it is an Extra Deck monster, otherwise false.
 */
export function isExtraDeckCard(cardType: string | undefined): boolean {
  if (!cardType) return false;
  const lower = cardType.toLowerCase();
  return (
    lower.includes("fusion") ||
    lower.includes("synchro") ||
    lower.includes("xyz") ||
    lower.includes("link")
  );
}

/**
 * Validates whether a card can be added to a specific deck section under copy limits
 * and placement restrictions.
 *
 * @param card - The Card schema to add.
 * @param section - The target deck section (MAIN, EXTRA, or SIDE).
 * @param currentCards - The current deck items.
 * @param formatName - The name of the game format ruleset to check.
 * @returns An object containing validation status (ok) and optional error message.
 */
export function canAddCard(
  card: Card,
  section: CardSection,
  currentCards: DeckCardItem[],
  formatName: string,
): { ok: boolean; error?: string } {
  const rules = getFormatRules(formatName);

  // Validate Placement rules
  const extraCard = isExtraDeckCard(card.type);
  if (section === "MAIN" && extraCard) {
    return {
      ok: false,
      error: `Extra Deck monster "${card.name}" must be placed in the EXTRA section.`,
    };
  }
  if (section === "EXTRA" && !extraCard) {
    return {
      ok: false,
      error: `Main Deck card "${card.name}" cannot be placed in the EXTRA section.`,
    };
  }

  // Validate copy limits across the entire deck (Main, Extra, and Side combined)
  const totalCopies = currentCards
    .filter((c) => c.cardId === card.id)
    .reduce((sum, c) => sum + c.quantity, 0);

  if (totalCopies >= rules.maxCopiesPerCard) {
    return {
      ok: false,
      error: `You cannot add more than ${rules.maxCopiesPerCard} copies of "${card.name}" across your entire deck.`,
    };
  }

  return { ok: true };
}

/**
 * Clamps quantity modifications to comply with format copy rules, taking copies
 * in other deck sections into account.
 *
 * @param cardId - The target card unique ID.
 * @param section - The section being modified.
 * @param newQty - The proposed new quantity for this section.
 * @param currentCards - The current deck card items list.
 * @param formatName - The name of the game format ruleset.
 * @returns The clamped quantity.
 */
export function clampQuantity(
  cardId: number,
  section: CardSection,
  newQty: number,
  currentCards: DeckCardItem[],
  formatName: string,
): number {
  const rules = getFormatRules(formatName);

  // Copies in OTHER sections (e.g. Side Deck copies of a Main Deck card)
  const copiesInOtherSections = currentCards
    .filter((c) => c.cardId === cardId && c.section !== section)
    .reduce((sum, c) => sum + c.quantity, 0);

  const allowedQty = rules.maxCopiesPerCard - copiesInOtherSections;
  return Math.max(0, Math.min(newQty, allowedQty));
}

/**
 * Validates deck section counts locally and returns immediate size validation warning messages.
 * Checks main deck min/max count, extra deck max count, and side deck max count.
 *
 * @param cards - List of cards in the deck with quantity and section parameters.
 * @param formatName - The name of the format ruleset.
 * @returns An array of string descriptions of size violations.
 */
export function validateDeckSections(
  cards: { quantity: number; section: CardSection }[],
  formatName: string,
): string[] {
  const rules = getFormatRules(formatName);
  const errors: string[] = [];

  let mainSize = 0;
  let extraSize = 0;
  let sideSize = 0;

  for (const c of cards) {
    const qty = c.quantity || 0;
    if (c.section === "MAIN") mainSize += qty;
    else if (c.section === "EXTRA") extraSize += qty;
    else if (c.section === "SIDE") sideSize += qty;
  }

  if (mainSize < rules.minMainSize || mainSize > rules.maxMainSize) {
    errors.push(
      `Main Deck must contain between ${rules.minMainSize} and ${rules.maxMainSize} cards. Current size: ${mainSize}`,
    );
  }
  if (extraSize > rules.maxExtraSize) {
    errors.push(`Extra Deck cannot exceed ${rules.maxExtraSize} cards. Current size: ${extraSize}`);
  }
  if (sideSize > rules.maxSideSize) {
    errors.push(`Side Deck cannot exceed ${rules.maxSideSize} cards. Current size: ${sideSize}`);
  }

  return errors;
}
