import { BookOpen, Search } from "lucide-react";

import CardFilters from "../components/card/CardFilters";
import CardGridItem from "../components/card/CardGridItem";
import CardListItem from "../components/card/CardListItem";
import EmptyState from "../components/EmptyState";
import ErrorAlert from "../components/ErrorAlert";
import LoadingSpinner from "../components/LoadingSpinner";
import PageHeader from "../components/PageHeader";
import Pagination from "../components/Pagination";
import ShowingPageIndicator from "../components/ShowingPageIndicator";
import Input from "../components/ui/Input";
import ViewToggle from "../components/ui/ViewToggle";
import { useCardMetadata } from "../hooks/useCardMetadata";
import { useCatalogSearch } from "../hooks/useCatalogSearch";
import { useViewPreference } from "../hooks/useViewPreference";

/**
 * Number of cards to display per page in the pagination grid.
 */
const PAGE_SIZE = 21;

/**
 * Cards Page Component.
 *
 * Provides a searchable, filterable catalog of all available cards. Uses synced URL parameters
 * to maintain search query, current filters, and pagination state.
 *
 * @returns {React.JSX.Element} The Cards page component containing search input, filters sidebar, and card grid.
 */
export default function Cards(): React.JSX.Element {
  const [viewMode, setViewMode] = useViewPreference("cards-view-mode", "grid");
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
  } = useCatalogSearch({ defaultPageSize: PAGE_SIZE, syncUrl: true });

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
          <div className="flex gap-4 items-end flex-row">
            <div className="flex-1">
              <Input
                type="text"
                placeholder="Search cards..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                icon={<Search className="h-5 w-5" />}
                className="bg-dark-surface w-full px-4 py-2.5"
              />
            </div>
            <ViewToggle viewMode={viewMode} onViewModeChange={setViewMode} />
          </div>

          <div className="flex items-center justify-between gap-4">
            <ShowingPageIndicator
              page={page}
              pageSize={PAGE_SIZE}
              totalElements={totalElements}
              itemType="card"
            />
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
              {viewMode === "grid" ? (
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
                  {cards.map((card) => (
                    <CardGridItem key={card.id} {...card} />
                  ))}
                </div>
              ) : (
                <div className="space-y-3">
                  {cards.map((card) => (
                    <CardListItem key={card.id} {...card} />
                  ))}
                </div>
              )}

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
