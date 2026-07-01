import type { ReactNode } from "react";
import { createContext, useContext } from "react";

import { useCardMetadata } from "../hooks/useCardMetadata";
import { useCatalogSearch } from "../hooks/useCatalogSearch";
import { useFetch } from "../hooks/useFetch";
import { getFormatsEndpoint } from "../services/deck";
import type { Card, CardFiltersState } from "../types";

/**
 * Properties and state values provided by the CatalogSearchContext.
 */
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

/**
 * Context container for card catalog search state.
 */
const CatalogSearchContext = createContext<CatalogSearchContextType | undefined>(undefined);

/**
 * CatalogSearchProvider component that manages and exposes search preferences,
 * card catalog loading queries, metadata list selections, and pagination variables.
 *
 * @param props - Children components.
 * @returns React Context Provider wrapping the children.
 */
export function CatalogSearchProvider({ children }: { children: ReactNode }) {
  const searchState = useCatalogSearch({ defaultPageSize: 8 });

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

/**
 * Custom React hook to consume catalog search states from any component downstream.
 *
 * @returns The active CatalogSearchContext properties.
 * @throws {Error} If called outside of a CatalogSearchProvider scope.
 */
export function useCatalogSearchContext() {
  const context = useContext(CatalogSearchContext);
  if (context === undefined) {
    throw new Error("useCatalogSearch must be used within a CatalogSearchProvider");
  }
  return context;
}
