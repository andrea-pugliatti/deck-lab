/**
 * Branded Nominal type helper for domain modeling.
 */
export type Brand<K, B extends string> = K & { readonly __brand: B };

/** Nominal type for Card entity IDs. */
export type CardId = Brand<number, "CardId">;

/** Nominal type for Deck entity IDs. */
export type DeckId = Brand<number, "DeckId">;

/** Utility functions to safely construct branded IDs. */
export const toCardId = (id: number): CardId => id as CardId;
export const toDeckId = (id: number): DeckId => id as DeckId;

/**
 * Game playstyle strategy enum types.
 */
export type Strategy =
  | "None"
  | "Combo"
  | "Control"
  | "Aggro"
  | "Midrange"
  | "Going Second"
  | "Stall/Burn"
  | "Pure";

/**
 * Game format classification types.
 */
export type Format = "TCG" | "OCG" | "Goat" | "Edison" | "Speed Duel" | "Custom";

const FORMATS_SET = new Set<string>(["TCG", "OCG", "Goat", "Edison", "Speed Duel", "Custom"]);

/** Type predicate guard to safely check if a value is a valid Format. */
export function isFormat(value: unknown): value is Format {
  return typeof value === "string" && FORMATS_SET.has(value);
}

/**
 * Card classification types.
 */
export type CardType =
  | "Normal Monster"
  | "Effect Monster"
  | "Ritual Monster"
  | "Fusion Monster"
  | "Synchro Monster"
  | "XYZ Monster"
  | "Pendulum Normal Monster"
  | "Pendulum Effect Monster"
  | "Link Monster"
  | "Spell Card"
  | "Trap Card"
  | "Token"
  | "Unknown";

const CARD_TYPES_SET = new Set<string>([
  "Normal Monster",
  "Effect Monster",
  "Ritual Monster",
  "Fusion Monster",
  "Synchro Monster",
  "XYZ Monster",
  "Pendulum Normal Monster",
  "Pendulum Effect Monster",
  "Link Monster",
  "Spell Card",
  "Trap Card",
  "Token",
  "Unknown",
]);

/** Type predicate guard to safely check if a value is a valid CardType. */
export function isCardType(value: unknown): value is CardType {
  return typeof value === "string" && CARD_TYPES_SET.has(value);
}

/**
 * Card race or sub-category types.
 */
export type CardRace =
  | "Aqua"
  | "Beast"
  | "Beast-Warrior"
  | "Cyberse"
  | "Dinosaur"
  | "Divine-Beast"
  | "Dragon"
  | "Fairy"
  | "Fiend"
  | "Fish"
  | "Insect"
  | "Machine"
  | "Plant"
  | "Psychic"
  | "Pyro"
  | "Reptile"
  | "Rock"
  | "Sea Serpent"
  | "Spellcaster"
  | "Thunder"
  | "Warrior"
  | "Winged Beast"
  | "Wyrm"
  | "Zombie"
  | "Normal"
  | "Field"
  | "Equip"
  | "Continuous"
  | "Quick-Play"
  | "Ritual"
  | "Counter"
  | "Unknown";

const CARD_RACES_SET = new Set<string>([
  "Aqua",
  "Beast",
  "Beast-Warrior",
  "Cyberse",
  "Dinosaur",
  "Divine-Beast",
  "Dragon",
  "Fairy",
  "Fiend",
  "Fish",
  "Insect",
  "Machine",
  "Plant",
  "Psychic",
  "Pyro",
  "Reptile",
  "Rock",
  "Sea Serpent",
  "Spellcaster",
  "Thunder",
  "Warrior",
  "Winged Beast",
  "Wyrm",
  "Zombie",
  "Normal",
  "Field",
  "Equip",
  "Continuous",
  "Quick-Play",
  "Ritual",
  "Counter",
  "Unknown",
]);

/** Type predicate guard to safely check if a value is a valid CardRace. */
export function isCardRace(value: unknown): value is CardRace {
  return typeof value === "string" && CARD_RACES_SET.has(value);
}

/**
 * Card elemental attributes.
 */
export type CardAttribute =
  | "LIGHT"
  | "DARK"
  | "WATER"
  | "FIRE"
  | "EARTH"
  | "WIND"
  | "DIVINE"
  | "UNKNOWN";

const CARD_ATTRIBUTES_SET = new Set<string>([
  "LIGHT",
  "DARK",
  "WATER",
  "FIRE",
  "EARTH",
  "WIND",
  "DIVINE",
  "UNKNOWN",
]);

/** Type predicate guard to safely check if a value is a valid CardAttribute. */
export function isCardAttribute(value: unknown): value is CardAttribute {
  return typeof value === "string" && CARD_ATTRIBUTES_SET.has(value);
}

/**
 * Card frame render styles.
 */
export type FrameType =
  | "normal"
  | "effect"
  | "ritual"
  | "fusion"
  | "synchro"
  | "xyz"
  | "link"
  | "pendulum"
  | "spell"
  | "trap"
  | "token"
  | "unknown";

/**
 * Valid deck section locations for cards.
 */
export type CardSection = "MAIN" | "EXTRA" | "SIDE";

/**
 * Represents a registered user.
 */
export interface User {
  username: string;
  email: string;
}

/**
 * Represents a Yu-Gi-Oh! card containing all game mechanics metadata and artwork references.
 */
export interface Card {
  /** Unique card ID. */
  id: CardId | number;
  /** The name of the card. */
  name: string;
  /** Card classification type. */
  type: CardType;
  /** Description/card text detailing effects, requirements, or lore. */
  description: string;
  /** Race or type group. */
  race: CardRace;
  /** Elemental attribute classification. */
  attribute: CardAttribute;
  /** Archetype naming classification. */
  archetype?: string;
  /** URL path pointing to the full card artwork image. */
  imageUrl?: string;
  /** URL path pointing to the cropped card artwork illustration. */
  imageUrlCropped?: string;
  /** Card frame type style. */
  frameType?: FrameType;
  /** Attack points (monsters only). */
  atk?: number;
  /** Defense points (monsters only). */
  def?: number;
  /** Level or Rank value (monsters only). */
  level?: number;
  /** Link rating value (Link monsters only). */
  linkVal?: number;
  /** Pendulum scale value (Pendulum monsters only). */
  scale?: number;
}

/**
 * Represents a user-created Deck entity.
 */
export interface Deck {
  /** The unique identifier of the deck. */
  id: DeckId | number;
  /** The display name of the deck. */
  name: string;
  /** Description describing strategies or notes. */
  description: string;
  /** The game format category. */
  formatName: Format;
  /** Timestamp indicating when the deck was last updated. */
  updatedAt?: string;
  /** The username of the user who created this deck. */
  creatorUsername?: string;
  /** Array of card items added to this deck. */
  deckCards: DeckCardItem[];
}

/**
 * Represents a single card assignment within a deck.
 */
export interface DeckCardItem extends Partial<Card> {
  /** Unique primary key ID of the database record. */
  id?: number;
  /** The referenced Card ID. */
  cardId: CardId | number;
  /** Name of the card. */
  name: string;
  /** Quantity of copies assigned to this section (usually 1, 2, or 3). */
  quantity: number;
  /** The target deck section placement (MAIN, EXTRA, or SIDE). */
  section: CardSection;
}

/**
 * Represents a simulated card instance in the Hand Simulator workspace.
 * Embellishes standard cards with an instanced unique ID to distinguish copies.
 */
export interface SimulatorCardInstance extends DeckCardItem {
  /** Unique identifier string for tracking individual card instances during draw and shuffle operations. */
  uniqId: string;
}

/**
 * A suggestion generated by AI matching synergies in the current deck.
 */
export interface Suggestion {
  /** The referenced card ID. */
  cardId: number;
  /** The name of the card. */
  name: string;
  /** The card type. */
  type: CardType;
  /** The suggested section placement (MAIN, EXTRA, or SIDE). */
  section: CardSection;
  /** Image URL of the card. */
  imageUrl?: string;
  /** Text explanation explaining the synergy or utility value. */
  synergyReason: string;
}

/**
 * Visual filter state applied to the catalog cards browse grid.
 */
export interface CardFiltersState {
  /** Filter by card type. */
  type: CardType | "ALL";
  /** Filter by elemental attribute. */
  attribute: CardAttribute | "ALL";
  /** Filter by race. */
  race: CardRace | "ALL";
  /** Filter by archetype. */
  archetype: string;
}

/**
 * Page structure description for backend pagination responses.
 */
export interface PageMetadata {
  /** Card count per page. */
  size: number;
  /** Total number of elements matching the query across all pages. */
  totalElements: number;
  /** Total computed page count. */
  totalPages: number;
  /** Zero-indexed current page number. */
  number: number;
}

/**
 * Generic response page structure wrapped around contents.
 *
 * @template T - The content entity model type.
 */
export interface Page<T> {
  /** Array of items in the current page slice. */
  content: T[];
  /** Pagination metadata detailing page count and total records. */
  page: PageMetadata;
}

/**
 * Lightweight card detail record payload sent when saving a deck.
 */
export interface DeckPayloadItem {
  /** The unique identifier of the card. */
  cardId: number;
  /** The quantity of this card in the section. */
  quantity: number;
  /** The deck section (MAIN, EXTRA, or SIDE). */
  section: CardSection;
}

/**
 * Deck payload model sent when saving or validating a deck.
 */
export interface DeckPayload {
  /** The display name of the deck. */
  name: string;
  /** The description of the deck. */
  description: string;
  /** The game format category. */
  formatName: Format;
  /** Collection of payload card records. */
  deckCards: DeckPayloadItem[];
}

/**
 * Request payload model for AI deck generation.
 */
export interface DeckGenerateRequest {
  archetype: string;
  strategy: Strategy;
  formatName: Format;
  customPrompt?: string;
}

/**
 * Response payload model for AI deck generation.
 */
export interface DeckGenerateResponse {
  name: string;
  description: string;
  formatName: Format;
  deckCards: DeckCardItem[];
  validationWarnings?: string[];
}

/**
 * Structure of a deck generated dynamically by generative AI,
 * incorporating optional validation warnings.
 */
export interface AiGeneratedDeck extends Partial<Deck> {
  /** Warning messages describing why some deck formatting guidelines could not be satisfied. */
  validationWarnings?: string[];
}

/**
 * Unified error response structure returned by API controllers.
 */
export interface ErrorPayload {
  /** Action success status indication. */
  ok?: boolean;
  /** Array of descriptive validation error messages. */
  errors?: string[];
  /** Primary generic failure description. */
  message?: string;
  /** Specific error type code or message. */
  error?: string;
}

/**
 * Result of deck validation service calls.
 */
export type DeckValidation = { ok: true } | { ok: false; errors: string[] };
