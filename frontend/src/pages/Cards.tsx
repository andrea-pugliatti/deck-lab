import { useState, useEffect } from "react";
import CardGridItem from "../components/CardGridItem";
import PageHeader from "../components/PageHeader";
import CardFilters from "../components/CardFilters";
import { Search, Filter, ChevronLeft, ChevronRight } from "lucide-react";
import { useSearchParams } from "react-router";
import { useFetch } from "../hooks/useFetch";
import { useDebounce } from "../hooks/useDebounce";
import type { Card, Page } from "../types";

export default function Cards() {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialQuery = searchParams.get("q") || "";
  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const debouncedQuery = useDebounce(searchQuery, 400);

  const [selectedType, setSelectedType] = useState("ALL");
  const [selectedAttribute, setSelectedAttribute] = useState("ALL");
  const [page, setPage] = useState(0);

  const types = ["ALL", "Monster", "Spell", "Trap"];
  const attributes = ["ALL", "LIGHT", "DARK", "FIRE", "WIND"];

  useEffect(() => {
    const q = searchParams.get("q") || "";
    setSearchQuery(q);
  }, [searchParams]);

  useEffect(() => {
    const currentQ = searchParams.get("q") || "";
    if (debouncedQuery.trim() !== currentQ) {
      if (debouncedQuery.trim()) {
        setSearchParams({ q: debouncedQuery.trim() });
      } else {
        setSearchParams({});
      }
      setPage(0);
    }
  }, [debouncedQuery, setSearchParams, searchParams]);

  const handleTypeChange = (type: string) => {
    setSelectedType(type);
    setPage(0);
  };

  const handleAttributeChange = (attr: string) => {
    setSelectedAttribute(attr);
    setPage(0);
  };

  const queryParams = new URLSearchParams();
  const qParam = searchParams.get("q") || "";
  if (qParam.trim()) {
    queryParams.append("q", qParam.trim());
  }
  if (selectedType !== "ALL") {
    queryParams.append("type", selectedType);
  }
  if (selectedAttribute !== "ALL") {
    queryParams.append("attribute", selectedAttribute);
  }
  queryParams.append("page", page.toString());
  queryParams.append("size", "20");

  const { data, loading, error } = useFetch<Page<Card>>(`/api/cards?${queryParams.toString()}`);

  const cards = data?.content || [];
  const totalElements = data?.totalElements || 0;
  const totalPages = data?.totalPages || 0;

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
            selectedType={selectedType}
            setSelectedType={handleTypeChange}
            selectedAttribute={selectedAttribute}
            setSelectedAttribute={handleAttributeChange}
            types={types}
            attributes={attributes}
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
            <div className="flex justify-center items-center py-20">
              <div className="w-10 h-10 border-4 border-cyan-accent/20 border-t-cyan-accent rounded-full animate-spin"></div>
            </div>
          ) : error ? (
            <div className="text-center py-12 bg-red-950/10 border border-red-500/20 rounded-lg p-6">
              <p className="text-red-400 font-semibold mb-2">Failed to load cards</p>
              <p className="text-xs text-slate-500 mb-4">{error.message}</p>
              <button
                onClick={() => window.location.reload()}
                className="px-4 py-2 bg-red-500/20 hover:bg-red-500/40 text-red-200 border border-red-500/50 rounded text-xs transition-colors duration-200 cursor-pointer"
                type="button"
              >
                Retry
              </button>
            </div>
          ) : cards.length > 0 ? (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {cards.map((card) => (
                  <CardGridItem key={card.id} {...card} />
                ))}
              </div>

              {totalPages > 1 && (
                <div className="flex items-center justify-center gap-4 mt-12 pt-6 border-t border-border-dim/50">
                  <button
                    onClick={() => setPage((p) => Math.max(0, p - 1))}
                    disabled={page === 0}
                    className="p-2 border border-border-dim rounded bg-dark-surface-elevated text-slate-400 hover:text-cyan-accent hover:border-cyan-accent disabled:opacity-30 disabled:hover:text-slate-400 disabled:hover:border-border-dim transition-all duration-200 cursor-pointer disabled:cursor-not-allowed"
                    type="button"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <span className="text-sm text-slate-400 font-semibold">
                    Page {page + 1} of {totalPages}
                  </span>
                  <button
                    onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
                    disabled={page >= totalPages - 1}
                    className="p-2 border border-border-dim rounded bg-dark-surface-elevated text-slate-400 hover:text-cyan-accent hover:border-cyan-accent disabled:opacity-30 disabled:hover:text-slate-400 disabled:hover:border-border-dim transition-all duration-200 cursor-pointer disabled:cursor-not-allowed"
                    type="button"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-20 border border-dashed border-border-dim rounded-lg bg-dark-surface/10">
              <Filter className="w-10 h-10 text-slate-600 mx-auto mb-3" />
              <h3 className="text-slate-400 font-medium mb-1">No Cards Found</h3>
              <p className="text-slate-600 text-xs">Try adjusting your filters or search terms.</p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
