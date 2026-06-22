import { Filter, Search } from "lucide-react";
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router";
import CardFilters from "../components/card/CardFilters";
import CardGridItem from "../components/card/CardGridItem";
import EmptyState from "../components/EmptyState";
import ErrorAlert from "../components/ErrorAlert";
import LoadingSpinner from "../components/LoadingSpinner";
import PageHeader from "../components/PageHeader";
import Pagination from "../components/Pagination";
import { useDebounce } from "../hooks/useDebounce";
import { useFetch } from "../hooks/useFetch";
import type { Card, Page } from "../types";

export default function Cards() {
  const [searchParams, setSearchParams] = useSearchParams();

  const selectedType = searchParams.get("type") || "ALL";
  const selectedAttribute = searchParams.get("attribute") || "ALL";
  const selectedRace = searchParams.get("race") || "ALL";
  const selectedArchetype = searchParams.get("archetype") || "ALL";
  const page = parseInt(searchParams.get("page") || "0", 10);

  const urlQuery = searchParams.get("q") || "";
  const [searchQuery, setSearchQuery] = useState(urlQuery);
  const debouncedQuery = useDebounce(searchQuery, 400);

  const { data: typesData } = useFetch<string[]>("/api/cards/types");
  const { data: attributesData } = useFetch<string[]>("/api/cards/attributes");
  const { data: racesData } = useFetch<string[]>("/api/cards/races");
  const { data: archetypesData } = useFetch<string[]>("/api/cards/archetypes");

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

  useEffect(() => {
    setSearchQuery((prev) => (prev !== urlQuery ? urlQuery : prev));
  }, [urlQuery]);

  useEffect(() => {
    const currentUrlQuery = searchParams.get("q") || "";
    if (debouncedQuery.trim() !== currentUrlQuery.trim()) {
      const params = new URLSearchParams(searchParams);
      if (debouncedQuery.trim()) {
        params.set("q", debouncedQuery.trim());
      } else {
        params.delete("q");
      }
      params.delete("page");
      setSearchParams(params);
    }
  }, [debouncedQuery, searchParams, setSearchParams]);

  const handleFilterChange = (newFilters: {
    type: string;
    attribute: string;
    race: string;
    archetype: string;
  }) => {
    const params = new URLSearchParams(searchParams);

    if (newFilters.type !== "ALL") params.set("type", newFilters.type);
    else params.delete("type");

    if (newFilters.attribute !== "ALL") params.set("attribute", newFilters.attribute);
    else params.delete("attribute");

    if (newFilters.race !== "ALL") params.set("race", newFilters.race);
    else params.delete("race");

    if (newFilters.archetype !== "ALL") params.set("archetype", newFilters.archetype);
    else params.delete("archetype");

    params.delete("page");
    setSearchParams(params);
  };

  const handlePageChange = (newPage: number) => {
    const params = new URLSearchParams(searchParams);
    if (newPage > 0) {
      params.set("page", newPage.toString());
    } else {
      params.delete("page");
    }
    setSearchParams(params);
  };

  const queryParams = new URLSearchParams();
  if (urlQuery.trim()) {
    queryParams.append("q", urlQuery.trim());
  }
  if (selectedType !== "ALL") {
    queryParams.append("type", selectedType);
  }
  if (selectedAttribute !== "ALL") {
    queryParams.append("attribute", selectedAttribute);
  }
  if (selectedRace !== "ALL") {
    queryParams.append("race", selectedRace);
  }
  if (selectedArchetype !== "ALL") {
    queryParams.append("archetype", selectedArchetype);
  }
  queryParams.append("page", page.toString());
  queryParams.append("size", "20");

  const { data, loading, error } = useFetch<Page<Card>>(`/api/cards?${queryParams.toString()}`);

  const cards = data?.content || [];
  const totalElements = data?.page?.totalElements || 0;
  const totalPages = data?.page?.totalPages || 0;

  const startIdx = page * 20 + 1;
  const endIdx = Math.min((page + 1) * 20, totalElements);

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      <PageHeader
        title="Card Database"
        description="Browse, filter, and search the entire Yu-Gi-Oh! catalog."
      />

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <aside className="lg:col-span-1 space-y-6">
          <CardFilters
            filters={{
              type: selectedType,
              attribute: selectedAttribute,
              race: selectedRace,
              archetype: selectedArchetype,
            }}
            onChange={handleFilterChange}
            types={types}
            attributes={attributes}
            races={races}
            archetypes={archetypes}
          />
        </aside>

        <main className="lg:col-span-3 space-y-6">
          <div className="group relative flex items-center bg-dark-surface border border-border-dim rounded px-4 py-2.5 transition-all duration-300 hover:border-border-glow focus-within:border-cyan-accent w-full">
            <Search className="w-5 h-5 text-slate-500 mr-2 group-focus-within:text-cyan-accent" />
            <input
              type="text"
              placeholder="Search card name, type, description, or archetype..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-transparent border-none outline-none text-sm text-white placeholder-slate-500 w-full"
            />
          </div>

          <div className="flex justify-between items-center text-xs text-slate-500">
            <span>
              Showing {totalElements > 0 ? `${startIdx}-${endIdx}` : "0"} of {totalElements} Cards
            </span>
          </div>

          {loading ? (
            <LoadingSpinner />
          ) : error ? (
            <ErrorAlert
              title="Failed to load cards"
              message={error.message}
              onRetry={() => window.location.reload()}
            />
          ) : cards.length > 0 ? (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {cards.map((card) => (
                  <CardGridItem key={card.id} {...card} />
                ))}
              </div>

              <Pagination page={page} totalPages={totalPages} onPageChange={handlePageChange} />
            </>
          ) : (
            <EmptyState
              icon={Filter}
              title="No Cards Found"
              description="Try adjusting your filters or search terms."
            />
          )}
        </main>
      </div>
    </div>
  );
}
