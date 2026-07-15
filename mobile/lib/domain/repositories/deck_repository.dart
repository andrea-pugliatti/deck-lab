import '../models/card_suggestion.dart';
import '../models/deck_card.dart';
import '../models/deck_detail.dart';
import '../models/deck_generation.dart';
import '../models/deck_summary.dart';
import '../models/deck_validation.dart';
import '../models/page.dart';

/// Abstract contract for deck operations.
abstract class DeckRepository {
  /// Queries public decks with optional filters.
  Future<Page<DeckSummary>> fetchPublicDecks({
    String? name,
    String? format,
    String? username,
    int page = 0,
    int size = 20,
  });

  /// Queries decks created by active authenticated user.
  Future<Page<DeckSummary>> fetchUserDecks({int page = 0, int size = 20});

  /// Queries detail of a deck by ID.
  Future<DeckDetail> fetchDeckDetail(int id);

  /// Saves a new deck record.
  Future<DeckDetail> createDeck({
    required String name,
    required String description,
    required String formatName,
    required List<DeckCard> deckCards,
  });

  /// Edits an existing deck record.
  Future<DeckDetail> updateDeck(
    int id, {
    required String name,
    required String description,
    required String formatName,
    required List<DeckCard> deckCards,
  });

  /// Removes a deck record.
  Future<void> deleteDeck(int id);

  /// Resolves valid deck formats.
  Future<List<String>> fetchFormats();

  /// Requests validation of deck content constraints.
  Future<DeckValidation> validateDeck({
    required String name,
    required String formatName,
    required List<DeckCard> deckCards,
  });

  /// Requests card recommendations based on current list.
  Future<List<CardSuggestion>> fetchAiSuggestions({
    required String formatName,
    required List<DeckCard> currentCards,
  });

  /// Requests AI deck layout generation.
  Future<DeckGeneration> generateAiDeck({
    required String archetype,
    required String strategy,
    required String formatName,
    String? customPrompt,
  });
}
