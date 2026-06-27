import { Filter, Search } from "lucide-react";
import CardFilters from "../components/card/CardFilters";
import CardGridItem from "../components/card/CardGridItem";
import EmptyState from "../components/EmptyState";
import ErrorAlert from "../components/ErrorAlert";
import LoadingSpinner from "../components/LoadingSpinner";
import PageHeader from "../components/PageHeader";
import Pagination from "../components/Pagination";
import Input from "../components/ui/Input";
import { useCardMetadata } from "../hooks/useCardMetadata";
import { useCatalogSearchState } from "../hooks/useCatalogSearchState";

export default function Cards() {
  const {
    searchPage: page,
    setSearchPage: handlePageChange,
    searchQuery,
    setSearchQuery,
    filters,
    setFilters,
    libraryCards: cards,
    libraryLoading: loading,
    totalSearchPages: totalPages,
    totalElements,
    error,
    refetch,
  } = useCatalogSearchState({ syncWithUrl: true, defaultPageSize: 20 });

  const { types, attributes, races, archetypes } = useCardMetadata();

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
            filters={filters}
            onChange={(newFilters) => setFilters(newFilters)}
            types={types}
            attributes={attributes}
            races={races}
            archetypes={archetypes}
          />
        </aside>

        <div className="lg:col-span-3 space-y-6">
          <Input
            type="text"
            placeholder="Search card name, type, description, or archetype..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            icon={<Search className="w-5 h-5" />}
            className="bg-dark-surface px-4 py-2.5"
          />

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
              onRetry={() => refetch()}
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
        </div>
      </div>
    </div>
  );
}
