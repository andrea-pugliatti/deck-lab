import { Filter, Plus, Search } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router";
import DeckListItem from "../components/deck/DeckListItem";
import EmptyState from "../components/EmptyState";
import ErrorAlert from "../components/ErrorAlert";
import FormatSelector from "../components/deck/FormatSelector";
import LoadingSpinner from "../components/LoadingSpinner";
import PageHeader from "../components/PageHeader";
import { useAuth } from "../context/AuthContext";
import { useFetch } from "../hooks/useFetch";
import { apiFetch } from "../services/api";
import type { BackendDeck } from "../types";
import { formatRelativeTime } from "../utils/date";
import Input from "../components/ui/Input";

export default function MyDecks() {
  const { user } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();
  const initialFormat = searchParams.get("format") || "ALL";
  const initialQuery = searchParams.get("q") || "";

  const [selectedFormat, setSelectedFormat] = useState(initialFormat);
  const [searchQuery, setSearchQuery] = useState(initialQuery);

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
    if (searchQuery.trim()) {
      params.q = searchQuery.trim();
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
  }, [searchQuery, selectedFormat, setSearchParams, searchParams]);

  const { data, loading, error, refetch } = useFetch<BackendDeck[]>(
    user?.username ? `/api/decks?username=${encodeURIComponent(user.username)}` : null,
  );
  const decks = data || [];

  const handleDelete = async (deckId: number) => {
    if (!window.confirm("Are you sure you want to delete this deck?")) return;
    try {
      const res = await apiFetch(`/api/decks/${deckId}`, {
        method: "DELETE",
      });
      if (res.ok) {
        refetch();
      } else {
        alert("Failed to delete deck");
      }
    } catch (err) {
      console.error(err);
      alert("Error deleting deck");
    }
  };

  const filteredDecks = decks.filter((deck) => {
    const matchesFormat =
      selectedFormat === "ALL" || deck.formatName.toLowerCase() === selectedFormat.toLowerCase();

    const matchesSearch =
      deck.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (deck.description && deck.description.toLowerCase().includes(searchQuery.toLowerCase()));

    return matchesFormat && matchesSearch;
  });

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      <PageHeader
        title="My Decks"
        description="Create, edit, and manage your deck builds and format experiments."
      >
        <Link
          to="/decks/create"
          className="flex items-center gap-2 bg-gold-accent hover:bg-gold-hover text-dark-bg px-5 py-2.5 rounded font-sans font-semibold text-sm cursor-pointer shadow-md transition-all duration-300 transform hover:-translate-y-0.5 no-underline"
        >
          <Plus className="w-4 h-4" />
          Construct Deck
        </Link>
      </PageHeader>

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <FormatSelector
          selectedFormat={selectedFormat}
          setSelectedFormat={setSelectedFormat}
          formats={formats}
        />

        <Input
          type="text"
          placeholder="Search my decks..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          icon={<Search className="w-4 h-4" />}
          className="bg-dark-surface px-4 py-2 md:max-w-xs"
        />
      </div>

      {loading ? (
        <LoadingSpinner />
      ) : error ? (
        <ErrorAlert title="Failed to load decks" message={error.message} onRetry={refetch} />
      ) : filteredDecks.length > 0 ? (
        <div className="space-y-4">
          {filteredDecks.map((deck) => {
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
                showActions={true}
                onDelete={handleDelete}
              />
            );
          })}
        </div>
      ) : (
        <EmptyState
          icon={Filter}
          title="No decks found matching the filter."
          description="Try selecting a different format or start a new build."
        />
      )}
    </div>
  );
}
