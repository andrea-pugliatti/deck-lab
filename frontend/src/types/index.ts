export interface User {
  username: string;
  email: string;
}

export interface DeckCardItem {
  id: number;
  cardId: number;
  name: string;
  quantity: number;
}

export interface BackendDeck {
  id: number;
  name: string;
  description: string;
  formatName: string;
  updatedAt?: string;
  creatorUsername?: string;
  deckCards: DeckCardItem[];
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

export interface Page<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  number?: number;
  size?: number;
}
