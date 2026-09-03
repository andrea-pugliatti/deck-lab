import { useQuery } from "@tanstack/react-query";
import type { ReactNode } from "react";
import { createContext, useContext } from "react";

import { useCardMetadata } from "../../../features/cards/hooks/useCardMetadata";
import { useCatalogSearch } from "../../../features/cards/hooks/useCatalogSearch";
import { getFormats } from "../../../features/decks";
import { formatKeys } from "../../../services/queryKeys";
import type { Card, CardFiltersState } from "../../../types";

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
const DEFAULT_FORMATS = ["TCG", "OCG", "Goat", "Speed Duel"];

export function CatalogSearchProvider({ children }: { children: ReactNode }) {
  const searchState = useCatalogSearch({ defaultPageSize: 9 });

  // Fetch metadata
  const { data: formatsData } = useQuery<string[]>({
    queryKey: formatKeys.all,
    queryFn: ({ signal }) => getFormats(signal),
  });
  const formats = formatsData || DEFAULT_FORMATS;

  const { types, attributes, races, archetypes } = useCardMetadata();

  const contextValue: CatalogSearchContextType = {
    ...searchState,
    formats,
    types,
    attributes,
    races,
    archetypes,
  };

  return (
    <CatalogSearchContext.Provider value={contextValue}>{children}</CatalogSearchContext.Provider>
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
