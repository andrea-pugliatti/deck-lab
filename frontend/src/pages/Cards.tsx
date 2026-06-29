import { BookOpen, Search } from "lucide-react";

import CardFilters from "../components/card/CardFilters";
import CardGridItem from "../components/card/CardGridItem";
import EmptyState from "../components/EmptyState";
import ErrorAlert from "../components/ErrorAlert";
import LoadingSpinner from "../components/LoadingSpinner";
import PageHeader from "../components/PageHeader";
import Pagination from "../components/Pagination";
import ShowingPageIndicator from "../components/ShowingPageIndicator";
import Input from "../components/ui/Input";
import { useCardMetadata } from "../hooks/useCardMetadata";
import { useUrlSyncedSearch } from "../hooks/useUrlSyncedSearch";

const PAGE_SIZE = 21;

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
  } = useUrlSyncedSearch({ defaultPageSize: PAGE_SIZE });

  const { types, attributes, races, archetypes } = useCardMetadata();

  return (
    <div className="mx-auto max-w-7xl px-6 py-12">
      <PageHeader
        title="Card Database"
        description="Browse, filter, and search the entire Yu-Gi-Oh! catalog."
      />

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-4">
        <aside className="space-y-6 lg:col-span-1">
          <CardFilters
            filters={filters}
            onChange={(newFilters) => setFilters(newFilters)}
            types={types}
            attributes={attributes}
            races={races}
            archetypes={archetypes}
          />
        </aside>

        <div className="space-y-6 lg:col-span-3">
          <Input
            type="text"
            placeholder="Search card name, type, description, or archetype..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            icon={<Search className="h-5 w-5" />}
            className="bg-dark-surface px-4 py-2.5"
          />

          <ShowingPageIndicator
            page={page}
            pageSize={PAGE_SIZE}
            totalElements={totalElements}
            itemType="card"
          />

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
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
                {cards.map((card) => (
                  <CardGridItem key={card.id} {...card} />
                ))}
              </div>

              <Pagination page={page} totalPages={totalPages} onPageChange={handlePageChange} />
            </>
          ) : (
            <EmptyState
              icon={BookOpen}
              title="No Cards Found"
              description="Try adjusting your filters or search terms."
            />
          )}
        </div>
      </div>
    </div>
  );
}
