import 'package:dio/dio.dart';

import '../../domain/models/card_suggestion.dart';
import '../../domain/models/deck_card.dart';
import '../../domain/models/deck_detail.dart';
import '../../domain/models/deck_generation.dart';
import '../../domain/models/deck_summary.dart';
import '../../domain/models/deck_validation.dart';
import '../../domain/models/page.dart';
import '../../domain/repositories/deck_repository.dart';
import '../core/api_client.dart';
import 'mappers/mappers.dart';
import 'models/card_entry.dart';
import 'models/card_suggestion_response.dart';
import 'models/create_deck_request.dart';
import 'models/deck_detail_response.dart';
import 'models/deck_generate_request.dart';
import 'models/deck_generation_response.dart';
import 'models/deck_suggest_request.dart';
import 'models/deck_summary_response.dart';
import 'models/update_deck_request.dart';
import 'models/validate_deck_request.dart';

/// Repository abstracting deck REST API endpoints.
///
/// Integrates CRUD operations, format lists, AI Wizard generation, AI card suggestions,
/// and rules validation.
class DeckRepositoryImpl implements DeckRepository {
  final ApiClient apiClient;
  DeckRepositoryImpl({required this.apiClient});

  /// Creates a new deck blueprint via POST `/api/decks`.
  @override
  Future<DeckDetail> createDeck({
    required String name,
    required String description,
    required String formatName,
    required List<DeckCard> deckCards,
  }) async {
    try {
      final request = CreateDeckRequest(
        name: name,
        description: description,
        formatName: formatName,
        deckCards: deckCards.map((c) => c.toDto()).toList(),
      );
      final response = await apiClient.dio.post(
        '/api/decks',
        data: request.toJson(),
      );
      return DeckDetailResponse.fromJson(
        response.data as Map<String, dynamic>,
      ).toDomain(apiClient.dio.options.baseUrl);
    } on DioException catch (e) {
      throw Exception(_parseError(e));
    }
  }

  /// Deletes a deck by its unique ID via DELETE `/api/decks/{id}`.
  @override
  Future<void> deleteDeck(int id) async {
    try {
      await apiClient.dio.delete('/api/decks/$id');
    } on DioException catch (e) {
      throw Exception(_parseError(e));
    }
  }

  /// Requests card recommendations based on current cards via POST `/api/decks/ai/suggest`.
  @override
  Future<List<CardSuggestion>> fetchAiSuggestions({
    required String formatName,
    required List<DeckCard> currentCards,
  }) async {
    try {
      final request = DeckSuggestRequest(
        formatName: formatName,
        currentCards: currentCards
            .map(
              (c) => CardEntry(
                name: c.name,
                section: c.section,
                quantity: c.quantity,
              ),
            )
            .toList(),
      );
      final response = await apiClient.dio.post(
        '/api/decks/ai/suggest',
        data: request.toJson(),
        options: Options(
          receiveTimeout: const Duration(seconds: 60),
          sendTimeout: const Duration(seconds: 60),
        ),
      );
      final suggestionsData = response.data as List<dynamic>? ?? [];
      return suggestionsData
          .map(
            (item) => CardSuggestionResponse.fromJson(
              item as Map<String, dynamic>,
            ).toDomain(apiClient.dio.options.baseUrl),
          )
          .toList();
    } on DioException catch (e) {
      throw Exception(_parseError(e));
    }
  }

  /// Fetches details of a single deck by its ID via `GET /api/decks/{id}`.
  @override
  Future<DeckDetail> fetchDeckDetail(int id) async {
    try {
      final response = await apiClient.dio.get('/api/decks/$id');
      return DeckDetailResponse.fromJson(
        response.data as Map<String, dynamic>,
      ).toDomain(apiClient.dio.options.baseUrl);
    } on DioException catch (e) {
      throw Exception(_parseError(e));
    }
  }

  /// Queries all distinct supported format names via `GET /api/decks/formats`.
  @override
  Future<List<String>> fetchFormats() async {
    try {
      final response = await apiClient.dio.get('/api/decks/formats');
      final data = response.data as List<dynamic>;
      return data.map((item) => item.toString()).toList();
    } on DioException catch (e) {
      throw Exception(_parseError(e));
    }
  }

  /// Queries all public decks matching parameters via `GET /api/decks`.
  ///
  /// Parameters: [name] (search query), [format], [username] (optional creator filter).
  /// Returns a paginated page of summaries.
  @override
  Future<Page<DeckSummary>> fetchPublicDecks({
    String? name,
    String? format,
    String? username,
    int page = 0,
    int size = 20,
  }) async {
    try {
      final queryParams = <String, dynamic>{'page': page, 'size': size};
      if (name != null && name.trim().isNotEmpty) {
        queryParams['q'] = name.trim();
      }
      if (format != null && format != 'ALL') {
        queryParams['format'] = format;
      }
      if (username != null && username.isNotEmpty) {
        queryParams['username'] = username;
      }

      final response = await apiClient.dio.get(
        '/api/decks',
        queryParameters: queryParams,
      );

      return Page<DeckSummary>.fromJson(
        response.data as Map<String, dynamic>,
        (json) => DeckSummaryResponse.fromJson(
          json as Map<String, dynamic>,
        ).toDomain(apiClient.dio.options.baseUrl),
      );
    } on DioException catch (e) {
      throw Exception(_parseError(e));
    }
  }

  /// Queries all decks owned by the currently authenticated user via `GET /api/decks/user`.
  ///
  /// Returns a paginated page of summaries.
  @override
  Future<Page<DeckSummary>> fetchUserDecks({
    int page = 0,
    int size = 20,
  }) async {
    try {
      final username = await apiClient.sessionStorage.getUsername();
      if (username == null || username.isEmpty) {
        return Page<DeckSummary>(
          content: [],
          number: page,
          size: size,
          totalElements: 0,
          totalPages: 0,
        );
      }
      return fetchPublicDecks(username: username, page: page, size: size);
    } catch (e) {
      throw Exception(e.toString());
    }
  }

  /// Requests the generation of a full deck using AI via POST `/api/decks/ai/generate`.
  @override
  Future<DeckGeneration> generateAiDeck({
    required String archetype,
    required String strategy,
    required String formatName,
    String? customPrompt,
  }) async {
    try {
      final request = DeckGenerateRequest(
        archetype: archetype,
        strategy: strategy,
        formatName: formatName,
        customPrompt: customPrompt,
      );
      final response = await apiClient.dio.post(
        '/api/decks/ai/generate',
        data: request.toJson(),
        options: Options(
          contentType: Headers.jsonContentType,
          receiveTimeout: const Duration(seconds: 60),
          sendTimeout: const Duration(seconds: 60),
        ),
      );
      return DeckGenerationResponse.fromJson(
        response.data as Map<String, dynamic>,
      ).toDomain(apiClient.dio.options.baseUrl);
    } on DioException catch (e) {
      throw Exception(_parseError(e));
    }
  }

  /// Updates an existing deck blueprint via PUT `/api/decks/{id}`.
  @override
  Future<DeckDetail> updateDeck(
    int id, {
    required String name,
    required String description,
    required String formatName,
    required List<DeckCard> deckCards,
  }) async {
    try {
      final request = UpdateDeckRequest(
        id: id,
        name: name,
        description: description,
        formatName: formatName,
        deckCards: deckCards.map((c) => c.toDto()).toList(),
      );
      final response = await apiClient.dio.put(
        '/api/decks/$id',
        data: request.toJson(),
      );
      return DeckDetailResponse.fromJson(
        response.data as Map<String, dynamic>,
      ).toDomain(apiClient.dio.options.baseUrl);
    } on DioException catch (e) {
      throw Exception(_parseError(e));
    }
  }

  /// Validates a deck list against structural rules via POST `/api/decks/validate`.
  ///
  /// Returns a [DeckValidation] wrapping warnings or error messages.
  @override
  Future<DeckValidation> validateDeck({
    required String name,
    required String formatName,
    required List<DeckCard> deckCards,
  }) async {
    try {
      final request = ValidateDeckRequest(
        name: name,
        formatName: formatName,
        deckCards: deckCards.map((c) => c.toDto()).toList(),
      );
      final response = await apiClient.dio.post(
        '/api/decks/validate',
        data: request.toJson(),
      );
      if (response.statusCode == 200) {
        return const DeckValidation(isValid: true);
      }
      return const DeckValidation(
        isValid: false,
        errors: ['Failed to validate deck due to unknown rule checks.'],
      );
    } on DioException catch (e) {
      if (e.response?.data case {'errors': List errorsList}) {
        return DeckValidation(
          isValid: false,
          errors: errorsList.map((err) => err.toString()).toList(),
        );
      }
      return DeckValidation(isValid: false, errors: [_parseError(e)]);
    }
  }

  /// Private helper method to parse error details from a [DioException].
  String _parseError(DioException e) {
    if (e.error != null) {
      return e.error.toString();
    }
    switch (e.response?.data) {
      case {'errors': List errorsList} when errorsList.isNotEmpty:
        return errorsList.join(', ');
      case {'message': var msg}:
        return msg.toString();
      case {'error': var err}:
        return err.toString();
      default:
        return 'Network request failed. Status: ${e.response?.statusCode}';
    }
  }
}
