import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:mobile/domain/enums/enums.dart';
import 'package:mobile/domain/models/card.dart';
import 'package:mobile/domain/models/card_suggestion.dart';
import 'package:mobile/domain/models/deck_card.dart';
import 'package:mobile/domain/models/deck_detail.dart';
import 'package:mobile/domain/models/deck_validation.dart';
import 'package:mobile/domain/repositories/card_repository.dart';
import 'package:mobile/domain/repositories/deck_repository.dart';
import 'package:mobile/ui/core/providers.dart';
import 'package:mobile/ui/features/deck_builder/view_models/deck_builder_provider.dart';
import 'package:mockito/annotations.dart';
import 'package:mockito/mockito.dart';

@GenerateNiceMocks([MockSpec<DeckRepository>(), MockSpec<CardRepository>()])
import 'deck_builder_provider_test.mocks.dart';

void main() {
  late MockDeckRepository mockDeckRepository;
  late MockCardRepository mockCardRepository;

  setUp(() {
    mockDeckRepository = MockDeckRepository();
    mockCardRepository = MockCardRepository();
  });

  group('DeckBuilderNotifier Unit Tests', () {
    test(
      'initializes with empty state in creation mode (deckId = null)',
      () async {
        final container = ProviderContainer(
          overrides: [
            deckRepositoryProvider.overrideWithValue(mockDeckRepository),
            cardRepositoryProvider.overrideWithValue(mockCardRepository),
          ],
        );
        addTearDown(container.dispose);

        final notifier = container.read(deckBuilderProvider.notifier);
        await notifier.initialize(null);

        final state = container.read(deckBuilderProvider);

        // Verify empty state using pattern matching destructuring
        if (state case DeckBuilderState(
          id: null,
          name: '',
          description: '',
          formatName: Format.tcg,
          cards: [],
          validationErrors: [],
          isLoading: false,
        )) {
          expect(state.isLoading, isFalse);
        } else {
          fail('State did not match empty deck pattern');
        }
      },
    );

    test(
      'initializes with preloaded data in edit mode (deckId != null)',
      () async {
        const mockDeck = DeckDetail(
          id: 42,
          name: 'Blue-Eyes Blueprint',
          description: 'Kaiba notes',
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

        when(
          mockDeckRepository.fetchDeckDetail(42),
        ).thenAnswer((_) async => mockDeck);

        final container = ProviderContainer(
          overrides: [
            deckRepositoryProvider.overrideWithValue(mockDeckRepository),
            cardRepositoryProvider.overrideWithValue(mockCardRepository),
          ],
        );
        addTearDown(container.dispose);

        final notifier = container.read(deckBuilderProvider.notifier);
        await notifier.initialize(42);

        final state = container.read(deckBuilderProvider);

        verify(mockDeckRepository.fetchDeckDetail(42)).called(1);

        // Verify preloaded state using pattern matching destructuring
        if (state case DeckBuilderState(
          id: 42,
          name: 'Blue-Eyes Blueprint',
          description: 'Kaiba notes',
          formatName: Format.tcg,
          cards: [var card],
          isLoading: false,
        )) {
          expect(card.name, equals('Blue-Eyes White Dragon'));
          expect(card.quantity, equals(3));
        } else {
          fail('State did not match preloaded deck pattern');
        }
      },
    );

    test(
      'adds card, triggers rules validation, and requests AI suggestions successfully',
      () async {
        // Mock validation response: invalid deck warning
        when(
          mockDeckRepository.validateDeck(
            name: anyNamed('name'),
            formatName: anyNamed('formatName'),
            deckCards: anyNamed('deckCards'),
          ),
        ).thenAnswer(
          (_) async => const DeckValidation(
            isValid: false,
            errors: ['Deck must contain at least 40 cards.'],
          ),
        );

        // Mock AI suggestions
        when(
          mockDeckRepository.fetchAiSuggestions(
            formatName: anyNamed('formatName'),
            currentCards: anyNamed('currentCards'),
          ),
        ).thenAnswer(
          (_) async => [
            const CardSuggestion(
              cardId: 102,
              name: 'Trade-In',
              section: DeckSection.main,
              type: CardType.spellCard,
              synergyReason: 'Discard Level 8 to draw.',
            ),
          ],
        );

        final container = ProviderContainer(
          overrides: [
            deckRepositoryProvider.overrideWithValue(mockDeckRepository),
            cardRepositoryProvider.overrideWithValue(mockCardRepository),
          ],
        );
        addTearDown(container.dispose);

        final notifier = container.read(deckBuilderProvider.notifier);
        await notifier.initialize(null);

        // Add a card
        const newCard = Card(
          id: 101,
          name: 'Blue-Eyes White Dragon',
          type: CardType.normalMonster,
        );

        notifier.addCard(newCard, DeckSection.main);
        await Future.delayed(Duration.zero);

        final state = container.read(deckBuilderProvider);

        // Verify that suggestions endpoint was called

        verify(
          mockDeckRepository.fetchAiSuggestions(
            formatName: anyNamed('formatName'),
            currentCards: anyNamed('currentCards'),
          ),
        ).called(1);

        // Verify updated state using pattern matching destructuring
        if (state case DeckBuilderState(
          cards: [var card],
          validationErrors: [var errorMsg],
          aiSuggestions: [var suggestion],
        )) {
          expect(card.cardId, equals(101));
          expect(card.quantity, equals(1));
          expect(errorMsg, contains('at least 40 cards'));
          expect(suggestion.name, equals('Trade-In'));
        } else {
          fail('State did not match updated state patterns');
        }
      },
    );

    test('removes card and runs rules validation successfully', () async {
      const mockDeck = DeckDetail(
        id: 42,
        name: 'Trade-In Deck',
        description: 'Notes',
        formatName: Format.tcg,
        deckCards: [
          DeckCard(
            cardId: 101,
            name: 'Trade-In',
            section: DeckSection.main,
            quantity: 1,
          ),
        ],
      );

      when(
        mockDeckRepository.fetchDeckDetail(42),
      ).thenAnswer((_) async => mockDeck);
      when(
        mockDeckRepository.validateDeck(
          name: anyNamed('name'),
          formatName: anyNamed('formatName'),
          deckCards: anyNamed('deckCards'),
        ),
      ).thenAnswer((_) async => const DeckValidation(isValid: true));

      final container = ProviderContainer(
        overrides: [
          deckRepositoryProvider.overrideWithValue(mockDeckRepository),
          cardRepositoryProvider.overrideWithValue(mockCardRepository),
        ],
      );
      addTearDown(container.dispose);

      final notifier = container.read(deckBuilderProvider.notifier);
      await notifier.initialize(42);

      // Remove the only card
      notifier.removeCard(101, DeckSection.main);
      await Future.delayed(Duration.zero);

      final state = container.read(deckBuilderProvider);

      // Verify card was removed
      if (state case DeckBuilderState(cards: [])) {
        expect(state.cards, isEmpty);
      } else {
        fail('Card was not removed from deck list');
      }
    });

    test(
      'saves new deck blueprint successfully via repository createDeck',
      () async {
        const createdDeck = DeckDetail(
          id: 100,
          name: 'New Custom Deck',
          description: 'New Description',
          formatName: Format.tcg,
          deckCards: [],
        );

        when(
          mockDeckRepository.createDeck(
            name: anyNamed('name'),
            description: anyNamed('description'),
            formatName: anyNamed('formatName'),
            deckCards: anyNamed('deckCards'),
          ),
        ).thenAnswer((_) async => createdDeck);

        final container = ProviderContainer(
          overrides: [
            deckRepositoryProvider.overrideWithValue(mockDeckRepository),
            cardRepositoryProvider.overrideWithValue(mockCardRepository),
          ],
        );
        addTearDown(container.dispose);

        final notifier = container.read(deckBuilderProvider.notifier);
        await notifier.initialize(null);
        notifier.updateName('New Custom Deck');
        notifier.updateDescription('New Description');

        final savedId = await notifier.saveDeck();

        expect(savedId, equals(100));
        verify(
          mockDeckRepository.createDeck(
            name: 'New Custom Deck',
            description: 'New Description',
            formatName: Format.tcg,
            deckCards: [],
          ),
        ).called(1);
      },
    );
  });
}
