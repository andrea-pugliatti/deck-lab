import 'package:flutter/material.dart' hide Card;
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import 'package:mobile/ui/core/widgets/empty_state.dart';
import 'package:mobile/ui/features/cards/widgets/card_grid_item.dart';
import 'package:mobile/ui/features/cards/widgets/filter_modal.dart';

import '../../../core/theme/theme.dart';
import '../view_models/card_db_provider.dart';

/// Database search screen to browse the card catalog.
class CardDbScreen extends ConsumerStatefulWidget {
  const CardDbScreen({super.key});

  @override
  ConsumerState<CardDbScreen> createState() => _CardDbScreenState();
}

class _CardDbScreenState extends ConsumerState<CardDbScreen> {
  final ScrollController _scrollController = ScrollController();
  final TextEditingController _searchController = TextEditingController();

  @override
  void initState() {
    super.initState();
    _scrollController.addListener(_onScroll);

    WidgetsBinding.instance.addPostFrameCallback((_) {
      final queryParam = GoRouterState.of(context).uri.queryParameters['q'];
      if (queryParam != null && queryParam.isNotEmpty) {
        _searchController.text = queryParam;
        ref.read(cardDbProvider.notifier).setSearchQuery(queryParam);
      } else {
        ref.read(cardDbProvider.notifier).fetchNextPage(isRefresh: true);
      }
    });
  }

  @override
  void dispose() {
    _scrollController.removeListener(_onScroll);
    _scrollController.dispose();
    _searchController.dispose();
    super.dispose();
  }

  void _onScroll() {
    if (_scrollController.position.pixels >=
        _scrollController.position.maxScrollExtent - 200) {
      ref.read(cardDbProvider.notifier).fetchNextPage();
    }
  }

  void _openFiltersSheet() {
    showModalBottomSheet(
      context: context,
      backgroundColor: DeckLabTheme.darkSurface,
      shape: const RoundedRectangleBorder(
        borderRadius: .vertical(top: .circular(16)),
      ),
      builder: (context) {
        return Consumer(
          builder: (context, ref, _) {
            final state = ref.watch(cardDbProvider);
            final notifier = ref.read(cardDbProvider.notifier);

            final typesAsync = ref.watch(cardTypesProvider);
            final attributesAsync = ref.watch(cardAttributesProvider);
            final racesAsync = ref.watch(cardRacesProvider);

            return FilterModal(
              types: typesAsync,
              attributes: attributesAsync,
              races: racesAsync,
              state: state,
              notifier: notifier,
            );
          },
        );
      },
    );
  }

  @override
  Widget build(BuildContext context) {
    final state = ref.watch(cardDbProvider);

    return Scaffold(
      appBar: AppBar(
        title: Text(
          'Card Database',
          style: DeckLabTheme.darkTheme.textTheme.headlineMedium!.copyWith(
            color: DeckLabTheme.goldAccent,
          ),
        ),
        actions: [
          IconButton(
            icon: Icon(
              Icons.filter_alt,
              color:
                  state.type != 'All Types' ||
                      state.attribute != 'All Attributes' ||
                      state.race != 'All Properties'
                  ? DeckLabTheme.cyanAccent
                  : Colors.white,
            ),
            onPressed: _openFiltersSheet,
          ),
        ],
      ),
      body: Column(
        children: [
          // Search Input panel
          Padding(
            padding: const .all(12.0),
            child: TextField(
              controller: _searchController,
              onChanged: (val) {
                ref.read(cardDbProvider.notifier).setSearchQuery(val);
              },
              style: const TextStyle(color: Colors.white),
              decoration: const InputDecoration(
                hintText: 'Search card name, text descriptions...',
                prefixIcon: Icon(Icons.search, color: Colors.white54),
                contentPadding: .symmetric(vertical: 10),
              ),
            ),
          ),

          // Cards Grid
          Expanded(
            child: RefreshIndicator(
              color: DeckLabTheme.cyanAccent,
              backgroundColor: DeckLabTheme.darkSurface,
              onRefresh: () => ref
                  .read(cardDbProvider.notifier)
                  .fetchNextPage(isRefresh: true),
              child: state.cards.isEmpty && !state.isLoading
                  ? EmptyState(text: 'No Cards Found', icon: Icons.search_off)
                  : GridView.builder(
                      controller: _scrollController,
                      padding: const .all(12.0),
                      gridDelegate:
                          const SliverGridDelegateWithFixedCrossAxisCount(
                            crossAxisCount: 3,
                            crossAxisSpacing: 10,
                            mainAxisSpacing: 10,
                            childAspectRatio: 0.7,
                          ),
                      itemCount: state.cards.length + (state.hasMore ? 3 : 0),
                      itemBuilder: (context, index) {
                        if (index >= state.cards.length) {
                          return const Padding(
                            padding: .all(8.0),
                            child: Center(
                              child: CircularProgressIndicator(
                                color: DeckLabTheme.cyanAccent,
                                strokeWidth: 2,
                              ),
                            ),
                          );
                        }

                        final card = state.cards[index];
                        return CardGridItem(card: card);
                      },
                    ),
            ),
          ),
        ],
      ),
    );
  }
}
