import type { ReactNode } from "react";
import { createContext, useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { useDebounce } from "../hooks/useDebounce";
import { useFetch } from "../hooks/useFetch";
import { apiFetch } from "../services/api";
import type { Deck, Card, CardFiltersState, DeckCardItem, Page, CardSection } from "../types";

interface DeckBuilderContextType {
  // Mode info
  isEditMode: boolean;
  id?: string;

  // Deck State
  name: string;
  setName: (name: string) => void;
  description: string;
  setDescription: (description: string) => void;
  formatName: string;
  setFormatName: (formatName: string) => void;
  deckCards: DeckCardItem[];
  setDeckCards: (cards: DeckCardItem[]) => void;

  // Library / Search State
  searchPage: number;
  setSearchPage: (page: number) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  filters: CardFiltersState;
  setFilters: React.Dispatch<React.SetStateAction<CardFiltersState>>;

  // Dropdown options
  formats: string[];
  types: string[];
  attributes: string[];
  races: string[];
  archetypes: string[];

  // Library query results
  libraryCards: Card[];
  libraryLoading: boolean;
  totalSearchPages: number;

  // Status / Action States
  validationErrors: string[];
  validationSuccess: boolean;
  isSaving: boolean;
  isValidating: boolean;
  submitError?: string;

  // Modifying deck methods
  addCard: (card: Card, section: CardSection) => void;
  updateQuantity: (cardId: number, section: CardSection, delta: number) => void;
  removeCard: (cardId: number, section: CardSection) => void;
  validateDeckPayload: () => Promise<boolean>;
  saveDeck: () => Promise<void>;
}

const DeckBuilderContext = createContext<DeckBuilderContextType | undefined>(undefined);

export function DeckBuilderProvider({ children }: { children: ReactNode }) {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isEditMode = !!id;

  // Deck form data
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [formatName, setFormatName] = useState("TCG");
  const [deckCards, setDeckCards] = useState<DeckCardItem[]>([]);

  // Search and Filters state
  const [searchPage, setSearchPage] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const debouncedSearch = useDebounce(searchQuery, 300);
  const [filters, setFilters] = useState<CardFiltersState>({
    type: "ALL",
    attribute: "ALL",
    race: "ALL",
    archetype: "ALL",
  });

  // Statuses
  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  const [validationSuccess, setValidationSuccess] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isValidating, setIsValidating] = useState(false);
  const [submitError, setSubmitError] = useState<string>();

  // Fetch metadata
  const { data: formatsData } = useFetch<string[]>("/api/decks/formats");
  const { data: typesData } = useFetch<string[]>("/api/cards/types");
  const { data: attributesData } = useFetch<string[]>("/api/cards/attributes");
  const { data: racesData } = useFetch<string[]>("/api/cards/races");
  const { data: archetypesData } = useFetch<string[]>("/api/cards/archetypes");

  const formats = formatsData || ["TCG", "OCG", "Goat", "Speed Duel"];
  const types = typesData || ["Monster", "Spell", "Trap"];
  const attributes = attributesData || [
    "LIGHT",
    "DARK",
    "FIRE",
    "WIND",
    "WATER",
    "EARTH",
    "DIVINE",
  ];
  const races = racesData || [];
  const archetypes = archetypesData || [];

  // Edit Mode: Fetch Deck
  useEffect(() => {
    if (isEditMode && id) {
      const fetchDeck = async () => {
        try {
          const res = await apiFetch(`/api/decks/${id}`);
          if (res.ok) {
            const deckData: Deck = await res.json();
            setName(deckData.name);
            setDescription(deckData.description || "");
            setFormatName(deckData.formatName);
            setDeckCards(
              (deckData.deckCards || []).map((dc) => ({
                cardId: dc.cardId,
                name: dc.name,
                quantity: dc.quantity,
                type: dc.type,
                imageUrl: dc.imageUrl,
                section: dc.section || "MAIN",
              })),
            );
          }
        } catch (err) {
          console.error("Failed to load deck for editing:", err);
        }
      };
      fetchDeck();
    }
  }, [isEditMode, id]);

  // Catalog Cards Search Query params
  const queryParams = new URLSearchParams();
  if (debouncedSearch.trim()) {
    queryParams.append("q", debouncedSearch.trim());
  }
  if (filters.type !== "ALL") {
    queryParams.append("type", filters.type);
  }
  if (filters.attribute !== "ALL") {
    queryParams.append("attribute", filters.attribute);
  }
  if (filters.race !== "ALL") {
    queryParams.append("race", filters.race);
  }
  if (filters.archetype !== "ALL") {
    queryParams.append("archetype", filters.archetype);
  }
  queryParams.append("page", searchPage.toString());
  queryParams.append("size", "8");

  // Fetch Library
  const { data: libraryData, loading: libraryLoading } = useFetch<Page<Card>>(
    `/api/cards?${queryParams.toString()}`,
  );

  const libraryCards = libraryData?.content || [];
  const totalSearchPages = libraryData?.page?.totalPages || 0;

  // Reset page on search or filter change
  useEffect(() => {
    setSearchPage(0);
  }, [debouncedSearch, filters]);

  // Operations
  const addCard = (card: Card, section: CardSection) => {
    setValidationSuccess(false);
    setValidationErrors([]);

    const existingIndex = deckCards.findIndex((c) => c.cardId === card.id && c.section === section);

    if (existingIndex > -1) {
      const updated = [...deckCards];
      const newQty = Math.min(3, updated[existingIndex].quantity + 1);
      updated[existingIndex].quantity = newQty;
      setDeckCards(updated);
    } else {
      const totalCopies = deckCards
        .filter((c) => c.cardId === card.id)
        .reduce((sum, c) => sum + c.quantity, 0);

      if (totalCopies >= 3) {
        setValidationErrors([
          `You cannot add more than 3 copies of "${card.name}" across your entire deck.`,
        ]);
        return;
      }

      setDeckCards([
        ...deckCards,
        {
          cardId: card.id,
          name: card.name,
          quantity: 1,
          type: card.type,
          imageUrl: card.imageUrlCropped,
          section,
        },
      ]);
    }
  };

  const updateQuantity = (cardId: number, section: CardSection, delta: number) => {
    setValidationSuccess(false);
    setValidationErrors([]);

    const targetIndex = deckCards.findIndex((c) => c.cardId === cardId && c.section === section);
    if (targetIndex === -1) return;

    const updated = [...deckCards];
    const newQty = updated[targetIndex].quantity + delta;

    if (newQty <= 0) {
      updated.splice(targetIndex, 1);
    } else {
      updated[targetIndex].quantity = Math.min(3, newQty);
    }
    setDeckCards(updated);
  };

  const removeCard = (cardId: number, section: CardSection) => {
    setValidationSuccess(false);
    setValidationErrors([]);
    setDeckCards(deckCards.filter((c) => !(c.cardId === cardId && c.section === section)));
  };

  const validateDeckPayload = async (): Promise<boolean> => {
    setIsValidating(true);
    setValidationErrors([]);
    setValidationSuccess(false);
    setSubmitError(undefined);

    const payload = {
      name: name.trim() || "Draft Deck",
      description: description.trim(),
      formatName,
      deckCards: deckCards.map((c) => ({
        cardId: c.cardId,
        quantity: c.quantity,
        section: c.section,
      })),
    };

    try {
      const res = await apiFetch("/api/decks/validate", {
        method: "POST",
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        setValidationSuccess(true);
        setIsValidating(false);
        return true;
      } else {
        let errorsList: string[] = [];
        try {
          const contentType = res.headers.get("content-type");
          if (contentType && contentType.includes("application/json")) {
            const errorData = await res.json();
            if (errorData) {
              if (Array.isArray(errorData.errors)) {
                errorsList = errorData.errors.map((e: any) => {
                  if (typeof e === "string") return e;
                  if (!e) return "Unknown validation error";
                  return e.defaultMessage || e.message || e.error || String(e);
                });
              } else if (typeof errorData.message === "string") {
                errorsList = [errorData.message];
              } else if (typeof errorData.error === "string") {
                errorsList = [errorData.error];
              }
            }
          } else {
            const text = await res.text();
            if (text) {
              errorsList = [text];
            }
          }
        } catch (parseErr) {
          console.error("Failed to parse validation error response:", parseErr);
        }

        if (errorsList.length === 0) {
          errorsList = [
            `Validation failed with status ${res.status}: ${res.statusText || "Bad Request"}`,
          ];
        }

        setValidationErrors(errorsList);
        setIsValidating(false);
        return false;
      }
    } catch (err: any) {
      setValidationErrors([err.message || "Connection error during deck validation."]);
      setIsValidating(false);
      return false;
    }
  };

  const saveDeck = async () => {
    if (!name.trim()) {
      setSubmitError("Deck name is required.");
      return;
    }

    setIsSaving(true);
    setSubmitError(undefined);

    const isValid = await validateDeckPayload();
    if (!isValid) {
      setSubmitError("Please resolve validation errors before saving.");
      setIsSaving(false);
      return;
    }

    const payload = {
      name: name.trim(),
      description: description.trim(),
      formatName,
      deckCards: deckCards.map((c) => ({
        cardId: c.cardId,
        quantity: c.quantity,
        section: c.section,
      })),
    };

    const url = isEditMode ? `/api/decks/${id}` : "/api/decks";
    const method = isEditMode ? "PUT" : "POST";

    try {
      const res = await apiFetch(url, {
        method,
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        const savedDeck: Deck = await res.json();
        navigate(`/decks/${savedDeck.id}`);
      } else {
        const errText = await res.text();
        throw new Error(errText || "Failed to save deck.");
      }
    } catch (err: any) {
      setSubmitError(err.message || "An error occurred while saving the deck.");
      setIsSaving(false);
    }
  };

  return (
    <DeckBuilderContext.Provider
      value={{
        isEditMode,
        id,
        name,
        setName,
        description,
        setDescription,
        formatName,
        setFormatName,
        deckCards,
        setDeckCards,
        searchPage,
        setSearchPage,
        searchQuery,
        setSearchQuery,
        filters,
        setFilters,
        formats,
        types,
        attributes,
        races,
        archetypes,
        libraryCards,
        libraryLoading,
        totalSearchPages,
        validationErrors,
        validationSuccess,
        isSaving,
        isValidating,
        submitError,
        addCard,
        updateQuantity,
        removeCard,
        validateDeckPayload,
        saveDeck,
      }}
    >
      {children}
    </DeckBuilderContext.Provider>
  );
}

export function useDeckBuilder() {
  const context = useContext(DeckBuilderContext);
  if (context === undefined) {
    throw new Error("useDeckBuilder must be used within a DeckBuilderProvider");
  }
  return context;
}
