import type { ReactNode } from "react";
import { createContext, useContext } from "react";

import { useCardMetadata } from "../hooks/useCardMetadata";
import { useCatalogSearchState } from "../hooks/useCatalogSearchState";
import { useFetch } from "../hooks/useFetch";
import { getFormatsEndpoint } from "../services/deck";
import type { Card, CardFiltersState } from "../types";

interface CatalogSearchContextType {
  searchPage: number;
  setSearchPage: (page: number) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  filters: CardFiltersState;
  setFilters: React.Dispatch<React.SetStateAction<CardFiltersState>>;
  formats: string[];
  types: string[];
  attributes: string[];
  races: string[];
  archetypes: string[];
  libraryCards: Card[];
  libraryLoading: boolean;
  totalSearchPages: number;
}

const CatalogSearchContext = createContext<CatalogSearchContextType | undefined>(undefined);

export function CatalogSearchProvider({ children }: { children: ReactNode }) {
  const searchState = useCatalogSearchState({ syncWithUrl: false, defaultPageSize: 8 });

  // Fetch metadata
  const { data: formatsData } = useFetch<string[]>(getFormatsEndpoint());
  const formats = formatsData || ["TCG", "OCG", "Goat", "Speed Duel"];

  const { types, attributes, races, archetypes } = useCardMetadata();

  return (
    <CatalogSearchContext.Provider
      value={{
        ...searchState,
        formats,
        types,
        attributes,
        races,
        archetypes,
      }}
    >
      {children}
    </CatalogSearchContext.Provider>
  );
}

export function useCatalogSearch() {
  const context = useContext(CatalogSearchContext);
  if (context === undefined) {
    throw new Error("useCatalogSearch must be used within a CatalogSearchProvider");
  }
  return context;
}
