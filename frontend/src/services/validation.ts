import type { Card, CardSection, DeckCardItem } from "../types";

export interface FormatRules {
  minMainSize: number;
  maxMainSize: number;
  maxExtraSize: number;
  maxSideSize: number;
  maxCopiesPerCard: number;
}

export const DEFAULT_RULES: FormatRules = {
  minMainSize: 40,
  maxMainSize: 60,
  maxExtraSize: 15,
  maxSideSize: 15,
  maxCopiesPerCard: 3,
};

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
 * Returns the layout size and copy limits for a selected format.
 */
export function getFormatRules(formatName: string): FormatRules {
  return FORMAT_RULES_MAP[formatName] || DEFAULT_RULES;
}

/**
 * Checks if a card type corresponds to an Extra Deck card (Fusion, Synchro, Xyz, Link).
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
 * Validates if a card can be added to a section under copies and placement limitations.
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
 * Clamps quantity modifications to comply with format copy rules, taking other sections into account.
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
 * Checks deck section counts locally and returns immediate size violation warning messages.
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
