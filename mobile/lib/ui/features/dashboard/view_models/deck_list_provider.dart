import 'dart:async';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../../core/providers.dart';
import '../../../../domain/models/deck_summary.dart';

/// State representation for the paginated deck blueprint catalog.
class DeckListState {
  final List<DeckSummary> decks;
  final int page;
  final bool hasMore;
  final String format;
  final String searchQuery;
  final String activeTab;
  final bool isLoading;
  final String? error;

  const DeckListState({
    required this.decks,
    required this.page,
    required this.hasMore,
    required this.format,
    required this.searchQuery,
    required this.activeTab,
    required this.isLoading,
    this.error,
  });

  DeckListState copyWith({
    List<DeckSummary>? decks,
    int? page,
    bool? hasMore,
    String? format,
    String? searchQuery,
    String? activeTab,
    bool? isLoading,
    String? error,
  }) {
    return DeckListState(
      decks: decks ?? this.decks,
      page: page ?? this.page,
      hasMore: hasMore ?? this.hasMore,
      format: format ?? this.format,
      searchQuery: searchQuery ?? this.searchQuery,
      activeTab: activeTab ?? this.activeTab,
      isLoading: isLoading ?? this.isLoading,
      error: error,
    );
  }
}

/// Notifier handling search queries, format selections, tab configurations, and pagination offsets.
class DeckListNotifier extends Notifier<DeckListState> {
  Timer? _debounceTimer;

  @override
  DeckListState build() {
    ref.onDispose(() {
      _debounceTimer?.cancel();
    });

    return const DeckListState(
      decks: [],
      page: 0,
      hasMore: true,
      format: 'ALL',
      searchQuery: '',
      activeTab: 'ALL',
      isLoading: false,
    );
  }

  /// Sets format query filter and triggers reload.
  void setFormat(String formatName) {
    state = state.copyWith(
      format: formatName,
      page: 0,
      decks: [],
      hasMore: true,
    );
    fetchNextPage(isRefresh: true);
  }

  /// Sets catalog tab switch ('ALL' or 'USER') and triggers reload.
  void setActiveTab(String tabName) {
    state = state.copyWith(
      activeTab: tabName,
      page: 0,
      decks: [],
      hasMore: true,
    );
    fetchNextPage(isRefresh: true);
  }

  /// Implements debounced text filtering.
  void setSearchQuery(String query) {
    state = state.copyWith(searchQuery: query);
    _debounceTimer?.cancel();
    _debounceTimer = Timer(const Duration(milliseconds: 400), () {
      state = state.copyWith(page: 0, decks: [], hasMore: true);
      fetchNextPage(isRefresh: true);
    });
  }

  /// Loads next page of decks from the repository.
  Future<void> fetchNextPage({bool isRefresh = false}) async {
    if (!isRefresh && (state.isLoading || !state.hasMore)) return;

    final targetTab = state.activeTab;
    final targetQuery = state.searchQuery;
    final targetFormat = state.format;

    if (isRefresh) {
      state = state.copyWith(
        page: 0,
        decks: [],
        hasMore: true,
        isLoading: true,
        error: null,
      );
    } else {
      state = state.copyWith(isLoading: true, error: null);
    }

    try {
      final repo = ref.read(deckRepositoryProvider);
      final currentPage = isRefresh ? 0 : state.page;

      final pageData = targetTab == 'USER'
          ? await repo.fetchUserDecks(
              name: targetQuery,
              format: targetFormat,
              page: currentPage,
              size: 10,
            )
          : await repo.fetchPublicDecks(
              name: targetQuery,
              format: targetFormat,
              page: currentPage,
              size: 10,
            );

      if (targetTab != state.activeTab ||
          targetQuery != state.searchQuery ||
          targetFormat != state.format) {
        // Discard results if parameters changed in flight
        return;
      }

      final nextDecks = pageData.content;
      final accumulatedDecks = isRefresh
          ? nextDecks
          : [...state.decks, ...nextDecks];
      final finishedLoading = nextDecks.length < 10;

      state = state.copyWith(
        decks: accumulatedDecks,
        page: currentPage + 1,
        hasMore: !finishedLoading,
        isLoading: false,
        error: null,
      );
    } catch (e) {
      if (targetTab != state.activeTab ||
          targetQuery != state.searchQuery ||
          targetFormat != state.format) {
        return;
      }
      state = state.copyWith(isLoading: false, error: e.toString());
    }
  }
}

/// Provider exposing the deck list notifier and active paging states.
final deckListProvider = NotifierProvider<DeckListNotifier, DeckListState>(
  DeckListNotifier.new,
);

/// Provider fetching supported format strings dynamically from the server.
final formatsProvider = FutureProvider<List<String>>((ref) async {
  return await ref.watch(deckRepositoryProvider).fetchFormats();
});
