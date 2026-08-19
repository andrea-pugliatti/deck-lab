import 'package:dio/dio.dart';
import 'package:mobile/domain/enums/enums.dart';
import 'package:mobile/domain/models/auth_session.dart';
import 'package:mobile/domain/models/card.dart';
import 'package:mobile/domain/models/card_suggestion.dart';
import 'package:mobile/domain/models/deck_card.dart';
import 'package:mobile/domain/models/deck_detail.dart';
import 'package:mobile/domain/models/deck_generation.dart';
import 'package:mobile/domain/models/deck_summary.dart';
import 'package:mobile/domain/models/deck_validation.dart';
import 'package:mobile/domain/models/page.dart';
import 'package:mobile/domain/repositories/auth_repository.dart';
import 'package:mobile/domain/repositories/card_repository.dart';
import 'package:mobile/domain/repositories/deck_repository.dart';

class MockAuthRepository implements AuthRepository {
  bool shouldFail = false;
  String? silentLoginResult = 'mock-jwt-token';
  AuthSession sessionResult = const AuthSession(
    accessToken: 'mock-jwt-token',
    username: 'testuser',
  );

  @override
  Future<AuthSession> login(String username, String password) async {
    if (shouldFail) {
      throw Exception('Invalid username or password');
    }
    return sessionResult;
  }

  @override
  Future<AuthSession> register(
    String username,
    String password,
    String email,
  ) async {
    if (shouldFail) {
      throw Exception('Registration failed: Email already in use');
    }
    return sessionResult;
  }

  @override
  Future<void> logout() async {
    if (shouldFail) {
      throw Exception('Logout failed');
    }
  }

  @override
  Future<String?> trySilentLogin() async {
    return silentLoginResult;
  }
}

class MockDeckRepository implements DeckRepository {
  bool shouldFail = false;
  List<DeckSummary> publicDecksList = [
    const DeckSummary(
      id: 1,
      name: 'Blue-Eyes Ultimate',
      description: 'Classic beatdown deck.',
      formatName: Format.tcg,
      creatorUsername: 'Kaiba',
      updatedAt: '2026-07-10T12:00:00Z',
      deckCards: [],
    ),
  ];
  List<DeckSummary> userDecksList = [
    const DeckSummary(
      id: 2,
      name: 'Dark Magician Control',
      description: 'Classic control deck.',
      formatName: Format.tcg,
      creatorUsername: 'Yugi',
      updatedAt: '2026-07-10T12:00:00Z',
      deckCards: [],
    ),
  ];

  DeckDetail deckDetail = const DeckDetail(
    id: 1,
    name: 'Blue-Eyes Ultimate',
    description: 'Classic beatdown deck.',
    formatName: Format.tcg,
    creatorUsername: 'Kaiba',
    updatedAt: '2026-07-10T12:00:00Z',
    deckCards: [
      DeckCard(
        cardId: 101,
        name: 'Blue-Eyes White Dragon',
        section: DeckSection.main,
        quantity: 3,
      ),
    ],
  );

  List<String> formats = ['TCG', 'OCG', 'GOAT', 'Edison'];
  DeckValidation validationResponse = const DeckValidation(isValid: true);
  List<CardSuggestion> aiSuggestions = [
    const CardSuggestion(
      cardId: 102,
      name: 'Trade-In',
      section: DeckSection.main,
      type: CardType.spellCard,
      synergyReason: 'Excellent synergy with Level 8 monsters.',
    ),
  ];
  DeckGeneration aiGenerationResult = const DeckGeneration(
    name: 'AI Generated Dragon Deck',
    formatName: Format.tcg,
    description: 'AI optimized beatdown strategy.',
    deckCards: [
      DeckCard(
        cardId: 101,
        name: 'Blue-Eyes White Dragon',
        section: DeckSection.main,
        quantity: 3,
      ),
    ],
  );

  @override
  Future<Page<DeckSummary>> fetchPublicDecks({
    String? name,
    String? format,
    String? username,
    int page = 0,
    int size = 20,
  }) async {
    if (shouldFail) throw Exception('Failed to fetch public decks');
    return Page<DeckSummary>(
      content: publicDecksList,
      number: page,
      size: size,
      totalElements: publicDecksList.length,
      totalPages: 1,
    );
  }

  @override
  Future<Page<DeckSummary>> fetchUserDecks({
    String? name,
    String? format,
    int page = 0,
    int size = 20,
  }) async {
    if (shouldFail) throw Exception('Failed to fetch user decks');
    return Page<DeckSummary>(
      content: userDecksList,
      number: page,
      size: size,
      totalElements: userDecksList.length,
      totalPages: 1,
    );
  }

  @override
  Future<DeckDetail> fetchDeckDetail(int id) async {
    if (shouldFail) throw Exception('Failed to fetch deck detail');
    return deckDetail;
  }

  @override
  Future<DeckDetail> createDeck({
    required String name,
    required String description,
    required Format formatName,
    required List<DeckCard> deckCards,
  }) async {
    if (shouldFail) throw Exception('Failed to create deck');
    return deckDetail.copyWith(name: name, description: description);
  }

  @override
  Future<DeckDetail> updateDeck(
    int id, {
    required String name,
    required String description,
    required Format formatName,
    required List<DeckCard> deckCards,
  }) async {
    if (shouldFail) throw Exception('Failed to update deck');
    return deckDetail.copyWith(name: name, description: description);
  }

  @override
  Future<void> deleteDeck(int id) async {
    if (shouldFail) throw Exception('Failed to delete deck');
  }

  @override
  Future<List<String>> fetchFormats() async {
    if (shouldFail) throw Exception('Failed to fetch formats');
    return formats;
  }

  @override
  Future<DeckValidation> validateDeck({
    required String name,
    required Format formatName,
    required List<DeckCard> deckCards,
  }) async {
    if (shouldFail) throw Exception('Validation service unavailable');
    return validationResponse;
  }

  @override
  Future<List<CardSuggestion>> fetchAiSuggestions({
    required Format formatName,
    required List<DeckCard> currentCards,
    CancelToken? cancelToken,
  }) async {
    if (shouldFail) throw Exception('AI Suggestion failed');
    return aiSuggestions;
  }

  @override
  Future<DeckGeneration> generateAiDeck({
    required String archetype,
    required Strategy strategy,
    required Format formatName,
    String? customPrompt,
  }) async {
    if (shouldFail) throw Exception('AI Generation failed');
    return aiGenerationResult;
  }

  @override
  Future<DeckDetail> importYdk({
    required List<int> bytes,
    required String fileName,
  }) async {
    if (shouldFail) throw Exception('Import failed');
    return deckDetail;
  }

  @override
  Future<String> exportYdk(int deckId) async {
    if (shouldFail) throw Exception('Export failed');
    return '#created by DeckLab\n#main\n46986414\n#extra\n!side\n';
  }
}

class MockCardRepository implements CardRepository {
  bool shouldFail = false;
  List<Card> cardCatalog = [
    const Card(
      id: 101,
      name: 'Blue-Eyes White Dragon',
      type: CardType.normalMonster,
      description: 'This legendary dragon is a powerful engine of destruction.',
      race: CardRace.dragon,
      attribute: CardAttribute.light,
      archetype: 'Blue-Eyes',
      atk: 3000,
      def: 2500,
      level: 8,
    ),
    const Card(
      id: 102,
      name: 'Trade-In',
      type: CardType.spellCard,
      description: 'Discard 1 Level 8 monster; draw 2 cards.',
    ),
  ];

  List<String> archetypesList = ['Blue-Eyes', 'Dark Magician', 'HERO'];

  @override
  String resolveCardImageUrl(String fileName, {bool cropped = false}) =>
      'http://localhost/$fileName';

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
    if (shouldFail) throw Exception('Failed to fetch cards');
    return Page<Card>(
      content: cardCatalog,
      number: page,
      size: size,
      totalElements: cardCatalog.length,
      totalPages: 1,
    );
  }

  @override
  Future<Card> fetchCardDetail(int id) async {
    if (shouldFail) throw Exception('Failed to fetch card detail');
    return cardCatalog.firstWhere(
      (c) => c.id == id,
      orElse: () => cardCatalog.first,
    );
  }

  @override
  Future<List<String>> fetchMetadataValues(String metadataPath) async {
    if (shouldFail) throw Exception('Failed to fetch metadata');
    return archetypesList;
  }

  @override
  Future<Card> createCard(Card card) async => card;

  @override
  Future<Card> updateCard(int id, Card card) async => card;

  @override
  Future<void> deleteCard(int id) async {}
}
