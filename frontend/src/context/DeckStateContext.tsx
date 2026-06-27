import type { ReactNode } from "react";
import { createContext, useContext } from "react";
import { useNavigate, useParams } from "react-router";
import { useDeckState } from "../hooks/useDeckState";
import type { Card, CardSection, DeckCardItem } from "../types";

interface DeckStateContextType {
  isEditMode: boolean;
  id?: string;
  name: string;
  setName: (name: string) => void;
  description: string;
  setDescription: (description: string) => void;
  formatName: string;
  setFormatName: (formatName: string) => void;
  deckCards: DeckCardItem[];
  setDeckCards: (cards: DeckCardItem[]) => void;
  validationErrors: string[];
  validationSuccess: boolean;
  isSaving: boolean;
  isValidating: boolean;
  submitError?: string;
  addCard: (card: Card, section: CardSection) => void;
  updateQuantity: (cardId: number, section: CardSection, delta: number) => void;
  removeCard: (cardId: number, section: CardSection) => void;
  validateDeckPayload: () => Promise<boolean>;
  saveDeck: () => Promise<void>;
}

const DeckStateContext = createContext<DeckStateContextType | undefined>(undefined);

export function DeckStateProvider({ children }: { children: ReactNode }) {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const deckState = useDeckState(id, (savedDeck) => {
    navigate(`/decks/${savedDeck.id}`);
  });

  return (
    <DeckStateContext.Provider value={{ id, ...deckState }}>{children}</DeckStateContext.Provider>
  );
}

export function useDeckStateContext() {
  const context = useContext(DeckStateContext);
  if (context === undefined) {
    throw new Error("useDeckStateContext must be used within a DeckStateProvider");
  }
  return context;
}
