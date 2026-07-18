import 'dart:async';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../../core/providers.dart';
import '../../../../domain/repositories/card_repository.dart';
import '../../../../domain/models/card.dart';

/// State representation of the Card database catalog view.
class CardDbState {
  final List<Card> cards;
  final int page;
  final bool hasMore;
  final String type;
  final String attribute;
  final String race;
  final String archetype;
  final String searchQuery;
  final bool isLoading;
  final String? error;

  const CardDbState({
    required this.cards,
    required this.page,
    required this.hasMore,
    required this.type,
    required this.attribute,
    required this.race,
    required this.archetype,
    required this.searchQuery,
    required this.isLoading,
    this.error,
  });

  CardDbState copyWith({
    List<Card>? cards,
    int? page,
    bool? hasMore,
    String? type,
    String? attribute,
    String? race,
    String? archetype,
    String? searchQuery,
    bool? isLoading,
    String? error,
  }) {
    return CardDbState(
      cards: cards ?? this.cards,
      page: page ?? this.page,
      hasMore: hasMore ?? this.hasMore,
      type: type ?? this.type,
      attribute: attribute ?? this.attribute,
      race: race ?? this.race,
      archetype: archetype ?? this.archetype,
      searchQuery: searchQuery ?? this.searchQuery,
      isLoading: isLoading ?? this.isLoading,
      error: error,
    );
  }
}

/// Notifier handling card paginations, text search queries, and catalog filters.
class CardDbNotifier extends Notifier<CardDbState> {
  Timer? _debounceTimer;

  @override
  CardDbState build() {
    ref.onDispose(() {
      _debounceTimer?.cancel();
    });

    return const CardDbState(
      cards: [],
      page: 0,
      hasMore: true,
      type: 'All Types',
      attribute: 'All Attributes',
      race: 'All Properties',
      archetype: 'All Archetypes',
      searchQuery: '',
      isLoading: false,
    );
  }

  void setType(String value) {
    state = state.copyWith(type: value, page: 0, cards: [], hasMore: true);
    fetchNextPage();
  }

  void setAttribute(String value) {
    state = state.copyWith(attribute: value, page: 0, cards: [], hasMore: true);
    fetchNextPage();
  }

  void setRace(String value) {
    state = state.copyWith(race: value, page: 0, cards: [], hasMore: true);
    fetchNextPage();
  }

  void setArchetype(String value) {
    state = state.copyWith(archetype: value, page: 0, cards: [], hasMore: true);
    fetchNextPage();
  }

  void clearFilters() {
    state = state.copyWith(
      type: 'All Types',
      attribute: 'All Attributes',
      race: 'All Properties',
      archetype: 'All Archetypes',
      page: 0,
      cards: [],
      hasMore: true,
      error: null,
    );
    fetchNextPage();
  }

  void setSearchQuery(String query) {
    state = state.copyWith(searchQuery: query);
    _debounceTimer?.cancel();
    _debounceTimer = Timer(const Duration(milliseconds: 400), () {
      state = state.copyWith(page: 0, cards: [], hasMore: true);
      fetchNextPage();
    });
  }

  /// Fetches next page of card definitions from database.
  Future<void> fetchNextPage({bool isRefresh = false}) async {
    if (state.isLoading || (!state.hasMore && !isRefresh)) return;

    if (isRefresh) {
      state = state.copyWith(
        page: 0,
        cards: [],
        hasMore: true,
        isLoading: true,
        error: null,
      );
    } else {
      state = state.copyWith(isLoading: true, error: null);
    }

    try {
      final repo = ref.read(cardRepositoryProvider);
      final currentPage = isRefresh ? 0 : state.page;

      final pageData = await repo.fetchCards(
        query: state.searchQuery,
        type: state.type,
        attribute: state.attribute,
        race: state.race,
        archetype: state.archetype,
        page: currentPage,
        size: 20,
      );

      final nextCards = pageData.content;
      final accumulatedCards = isRefresh
          ? nextCards
          : [...state.cards, ...nextCards];
      final finishedLoading = nextCards.length < 20;

      state = state.copyWith(
        cards: accumulatedCards,
        page: currentPage + 1,
        hasMore: !finishedLoading,
        isLoading: false,
        error: null,
      );
    } catch (e) {
      state = state.copyWith(isLoading: false, error: e.toString());
    }
  }
}

/// Provider exposing the card database notifier state.
final cardDbProvider = NotifierProvider<CardDbNotifier, CardDbState>(
  CardDbNotifier.new,
);

/// Provider fetching card classification types dynamically from the database.
final cardTypesProvider = FutureProvider<List<String>>((ref) async {
  return await ref.watch(cardRepositoryProvider).fetchMetadataValues('types');
});

/// Provider fetching monster attributes dynamically from the database.
final cardAttributesProvider = FutureProvider<List<String>>((ref) async {
  return await ref
      .watch(cardRepositoryProvider)
      .fetchMetadataValues('attributes');
});

/// Provider fetching monster races dynamically from the database.
final cardRacesProvider = FutureProvider<List<String>>((ref) async {
  return await ref.watch(cardRepositoryProvider).fetchMetadataValues('races');
});

/// Provider fetching archetypes dynamically from the database.
final cardArchetypesProvider = FutureProvider<List<String>>((ref) async {
  return await ref.watch(cardRepositoryProvider).watchMetadataArchetypes();
});

/// Private helper extension to fetch archetype metadata values.
extension on CardRepository {
  Future<List<String>> watchMetadataArchetypes() =>
      fetchMetadataValues('archetypes');
}
