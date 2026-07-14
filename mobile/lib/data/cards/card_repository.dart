import 'package:dio/dio.dart';

import '../../domain/models/card.dart';
import '../../domain/models/page.dart';
import '../../domain/repositories/card_repository.dart';
import '../core/api_client.dart';
import 'models/card_response.dart';

/// Repository abstracting card database search and metadata lookup.
///
/// Communicates with `/api/cards/` paths to support pagination, autocomplete suggestion,
/// filters metadata, and card CRUD.
class CardRepositoryImpl implements CardRepository {
  /// Mapped API Client instance.
  final ApiClient apiClient;

  /// Default constructor for [CardRepositoryImpl].
  CardRepositoryImpl({required this.apiClient});

  /// Resolves the absolute URL string pointing to a card artwork asset.
  @override
  String resolveCardImageUrl(String fileName, {bool cropped = false}) {
    final subPath = cropped ? 'cropped/' : '';
    return '${apiClient.dio.options.baseUrl}/api/cards/images/$subPath$fileName';
  }

  /// Queries all cards matching search parameters via `GET /api/cards`.
  ///
  /// Parameters: [query] (name/text match), [type], [attribute], [race], [archetype].
  /// Returns a paginated page of card definitions.
  @override
  Future<Page<Card>> fetchCards({
    String? query,
    String? type,
    String? attribute,
    String? race,
    String? archetype,
    int page = 0,
    int size = 20,
  }) async {
    try {
      final queryParams = <String, dynamic>{'page': page, 'size': size};

      if (query != null && query.trim().isNotEmpty) {
        queryParams['q'] = query.trim();
      }
      if (type != null && type != 'All Types' && type.isNotEmpty) {
        queryParams['type'] = type;
      }
      if (attribute != null &&
          attribute != 'All Attributes' &&
          attribute.isNotEmpty) {
        queryParams['attribute'] = attribute;
      }
      if (race != null && race != 'All Properties' && race.isNotEmpty) {
        queryParams['race'] = race;
      }
      if (archetype != null &&
          archetype != 'All Archetypes' &&
          archetype.isNotEmpty) {
        queryParams['archetype'] = archetype;
      }

      final response = await apiClient.dio.get(
        '/api/cards',
        queryParameters: queryParams,
      );

      return Page<Card>.fromJson(
        response.data as Map<String, dynamic>,
        (json) => CardResponse.fromJson(
          json as Map<String, dynamic>,
        ).toDomain(apiClient.dio.options.baseUrl),
      );
    } on DioException catch (e) {
      throw Exception(_parseError(e));
    }
  }

  /// Fetches details of a single card by its ID via `GET /api/cards/{id}`.
  @override
  Future<Card> fetchCardDetail(int id) async {
    try {
      final response = await apiClient.dio.get('/api/cards/$id');
      return CardResponse.fromJson(
        response.data as Map<String, dynamic>,
      ).toDomain(apiClient.dio.options.baseUrl);
    } on DioException catch (e) {
      throw Exception(_parseError(e));
    }
  }

  /// Fetches a list of valid values for a card attribute type.
  ///
  /// Parameters: [metadataPath] - 'types', 'attributes', 'races', or 'archetypes'.
  /// Hits `GET /api/cards/{metadataPath}`.
  @override
  Future<List<String>> fetchMetadataValues(String metadataPath) async {
    try {
      final response = await apiClient.dio.get('/api/cards/$metadataPath');
      final data = response.data as List<dynamic>? ?? [];
      return data.map((item) => item.toString()).toList();
    } on DioException catch (e) {
      throw Exception(_parseError(e));
    }
  }

  /// Creates a new card catalog definition (authenticated admin path) via POST `/api/cards`.
  @override
  Future<Card> createCard(Card card) async {
    try {
      final response = await apiClient.dio.post(
        '/api/cards',
        data: card.toDto().toJson(),
      );
      return CardResponse.fromJson(
        response.data as Map<String, dynamic>,
      ).toDomain(apiClient.dio.options.baseUrl);
    } on DioException catch (e) {
      throw Exception(_parseError(e));
    }
  }

  /// Updates an existing card catalog definition (authenticated admin path) via PUT `/api/cards/{id}`.
  @override
  Future<Card> updateCard(int id, Card card) async {
    try {
      final response = await apiClient.dio.put(
        '/api/cards/$id',
        data: card.toDto().toJson(),
      );
      return CardResponse.fromJson(
        response.data as Map<String, dynamic>,
      ).toDomain(apiClient.dio.options.baseUrl);
    } on DioException catch (e) {
      throw Exception(_parseError(e));
    }
  }

  /// Deletes a card catalog definition (authenticated admin path) via DELETE `/api/cards/{id}`.
  @override
  Future<void> deleteCard(int id) async {
    try {
      await apiClient.dio.delete('/api/cards/$id');
    } on DioException catch (e) {
      throw Exception(_parseError(e));
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
        return 'Card query failed. Status: ${e.response?.statusCode}';
    }
  }
}

extension CardResponseDomainMapper on CardResponse {
  Card toDomain(String baseUrl) {
    return Card(
      id: id,
      name: name,
      type: type,
      description: description,
      race: race,
      attribute: attribute,
      archetype: archetype,
      imageUrl: _resolveUrl(imageUrl, baseUrl),
      imageUrlCropped: _resolveUrl(imageUrlCropped, baseUrl),
      frameType: frameType,
      atk: atk,
      def: def,
      level: level,
      linkVal: linkVal,
      scale: scale,
    );
  }
}

String? _resolveUrl(String? path, String baseUrl) {
  if (path == null) return null;
  if (path.startsWith('http://') || path.startsWith('https://')) {
    return path;
  }
  final uri = Uri.parse(path);
  final fileName = uri.pathSegments.isNotEmpty ? uri.pathSegments.last : '';
  if (fileName.isEmpty) return null;
  final isCropped = uri.pathSegments.contains('cropped');
  final subPath = isCropped ? 'cropped/' : '';
  return '$baseUrl/api/cards/images/$subPath$fileName';
}

extension CardDomainDtoMapper on Card {
  CardResponse toDto() {
    return CardResponse(
      id: id,
      name: name,
      type: type,
      description: description,
      race: race,
      attribute: attribute,
      archetype: archetype,
      imageUrl: imageUrl,
      imageUrlCropped: imageUrlCropped,
      frameType: frameType,
      atk: atk,
      def: def,
      level: level,
      linkVal: linkVal,
      scale: scale,
    );
  }
}
