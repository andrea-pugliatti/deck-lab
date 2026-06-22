import { Filter, Search } from "lucide-react";
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router";
import DeckListItem from "../components/deck/DeckListItem";
import EmptyState from "../components/EmptyState";
import ErrorAlert from "../components/ErrorAlert";
import FormatSelector from "../components/deck/FormatSelector";
import LoadingSpinner from "../components/LoadingSpinner";
import PageHeader from "../components/PageHeader";
import { useDebounce } from "../hooks/useDebounce";
import { useFetch } from "../hooks/useFetch";
import type { BackendDeck } from "../types";
import { formatRelativeTime } from "../utils/date";
import Input from "../components/ui/Input";

export default function Decks() {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialFormat = searchParams.get("format") || "ALL";
  const initialQuery = searchParams.get("q") || "";

  const [selectedFormat, setSelectedFormat] = useState(initialFormat);
  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const debouncedQuery = useDebounce(searchQuery, 400);

  const { data: formatsData } = useFetch<string[]>("/api/decks/formats");
  const formats = formatsData
    ? ["ALL", ...formatsData]
    : ["ALL", "TCG", "OCG", "Goat", "Speed Duel"];

  useEffect(() => {
    const format = searchParams.get("format") || "ALL";
    const q = searchParams.get("q") || "";
    setSelectedFormat(format);
    setSearchQuery((prev) => (prev !== q ? q : prev));
  }, [searchParams]);

  useEffect(() => {
    const params: Record<string, string> = {};
    if (debouncedQuery.trim()) {
      params.q = debouncedQuery.trim();
    }
    if (selectedFormat !== "ALL") {
      params.format = selectedFormat;
    }

    const currentParams = Object.fromEntries(searchParams.entries());
    const hasChanged =
      Object.keys(params).length !== Object.keys(currentParams).length ||
      Object.keys(params).some((k) => params[k] !== currentParams[k]);

    if (hasChanged) {
      setSearchParams(params);
    }
  }, [debouncedQuery, selectedFormat, setSearchParams, searchParams]);

  const queryParams = new URLSearchParams();
  if (debouncedQuery.trim()) {
    queryParams.append("q", debouncedQuery.trim());
  }
  if (selectedFormat !== "ALL") {
    queryParams.append("format", selectedFormat);
  }

  const { data, loading, error } = useFetch<BackendDeck[]>(`/api/decks?${queryParams.toString()}`);
  const decks = data || [];

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      <PageHeader
        title="Public Decks"
        description="Browse, filter, and discover community-built Yu-Gi-Oh! decks."
      />

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <FormatSelector
          selectedFormat={selectedFormat}
          setSelectedFormat={(fmt) => setSelectedFormat(fmt)}
          formats={formats}
        />

        <Input
          type="text"
          placeholder="Search decks..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          icon={<Search className="w-4 h-4" />}
          className="bg-dark-surface px-4 py-2 md:max-w-xs"
        />
      </div>

      {loading ? (
        <LoadingSpinner />
      ) : error ? (
        <ErrorAlert
          title="Failed to load decks"
          message={error.message}
          onRetry={() => window.location.reload()}
        />
      ) : decks.length > 0 ? (
        <div className="space-y-4">
          {decks.map((deck) => {
            const cardCount = deck.deckCards?.reduce((acc, c) => acc + (c.quantity || 0), 0) || 0;
            return (
              <DeckListItem
                key={deck.id}
                id={deck.id}
                name={deck.name}
                description={deck.description}
                formatName={deck.formatName}
                cardCount={cardCount}
                updatedAt={formatRelativeTime(deck.updatedAt)}
                showActions={false}
              />
            );
          })}
        </div>
      ) : (
        <EmptyState
          icon={Filter}
          title="No decks found matching the search criteria."
          description="Try adjusting your search query or format filter."
        />
      )}
    </div>
  );
}
