export interface User {
  username: string;
  email: string;
}

export interface Card {
  id: number;
  name: string;
  type: string;
  description: string;
  race: string;
  attribute: string;
  archetype?: string;
  imageUrl?: string;
  imageUrlCropped?: string;
  atk?: number;
  def?: number;
  level?: number;
  linkVal?: number;
  scale?: number;
}

export interface Deck {
  id: number;
  name: string;
  description: string;
  formatName: string;
  updatedAt?: string;
  creatorUsername?: string;
  deckCards: DeckCardItem[];
}

export type CardSection = "MAIN" | "EXTRA" | "SIDE";

export interface DeckCardItem extends Partial<Card> {
  id?: number;
  cardId: number;
  name: string;
  quantity: number;
  section: CardSection;
}

export interface SimulatorCardInstance extends DeckCardItem {
  uniqId: string;
}

export interface Suggestion {
  cardId: number;
  name: string;
  type: string;
  section: CardSection;
  imageUrl?: string;
  synergyReason: string;
}

export interface CardFiltersState {
  type: string;
  attribute: string;
  race: string;
  archetype: string;
}

export interface PageMetadata {
  size: number;
  totalElements: number;
  totalPages: number;
  number: number;
}

export interface Page<T> {
  content: T[];
  page: PageMetadata;
}

export interface DeckPayloadItem {
  cardId: number;
  quantity: number;
  section: CardSection;
}

export interface DeckPayload {
  name: string;
  description: string;
  formatName: string;
  deckCards: DeckPayloadItem[];
}

export interface AiGeneratedDeck extends Partial<Deck> {
  validationWarnings?: string[];
}

export interface ErrorPayload {
  ok?: boolean;
  errors?: string[];
  message?: string;
  error?: string;
}
