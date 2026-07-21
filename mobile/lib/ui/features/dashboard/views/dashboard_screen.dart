import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import 'package:mobile/ui/core/widgets/empty_state.dart';
import 'package:mobile/ui/features/dashboard/widgets/deck_item_card.dart';
import 'package:mobile/ui/features/dashboard/widgets/format_carousel.dart';
import 'package:mobile/ui/core/widgets/tab_button.dart';

import '../../../../navigation/routes.dart';
import '../../../core/theme/theme.dart';
import '../../../core/widgets/shimmer_placeholder.dart';
import '../../auth/view_models/auth_provider.dart';
import '../view_models/deck_list_provider.dart';

/// Catalog dashboard screen containing Public Decks and Personal Decks directories.
class DashboardScreen extends ConsumerStatefulWidget {
  const DashboardScreen({super.key});

  @override
  ConsumerState<DashboardScreen> createState() => _DashboardScreenState();
}

class _DashboardScreenState extends ConsumerState<DashboardScreen> {
  final ScrollController _scrollController = ScrollController();
  final TextEditingController _searchController = TextEditingController();

  @override
  void initState() {
    super.initState();
    _scrollController.addListener(_onScroll);

    WidgetsBinding.instance.addPostFrameCallback((_) {
      ref.read(deckListProvider.notifier).fetchNextPage(isRefresh: true);
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
      ref.read(deckListProvider.notifier).fetchNextPage();
    }
  }

  @override
  Widget build(BuildContext context) {
    final authState = ref.watch(authProvider);
    final deckState = ref.watch(deckListProvider);
    final formatsAsync = ref.watch(formatsProvider);
    final isLoggedIn = authState.value != null;
    final cs = Theme.of(context).colorScheme;
    final tt = Theme.of(context).textTheme;

    return Scaffold(
      appBar: AppBar(
        title: Text(
          'DeckLab',
          style: tt.headlineMedium!.copyWith(color: cs.primary),
        ),
        actions: [
          if (isLoggedIn)
            IconButton(
              icon: Icon(Icons.logout, color: cs.error),
              tooltip: 'Logout',
              onPressed: () async {
                await ref.read(authProvider.notifier).logout();
              },
            )
          else
            TextButton(
              onPressed: () => context.push(AppRoutes.login),
              child: Text(
                'LOGIN',
                style: tt.labelMedium!.copyWith(
                  color: cs.secondary,
                  fontWeight: .bold,
                  letterSpacing: 1.0,
                ),
              ),
            ),
        ],
      ),
      floatingActionButton: isLoggedIn
          ? FloatingActionButton(
              backgroundColor: DeckLabTheme.goldAccent,
              foregroundColor: DeckLabTheme.darkBg,
              onPressed: () => context.push(AppRoutes.deckCreate),
              child: const Icon(Icons.add),
            )
          : null,
      body: Column(
        children: [
          // Tab switches for authenticated users
          if (isLoggedIn)
            Container(
              color: DeckLabTheme.darkSurface,
              child: Row(
                children: [
                  Expanded(
                    child: TabButton(
                      label: 'PUBLIC DECKS',
                      isActive: deckState.activeTab == 'ALL',
                      onTap: () {
                        ref.read(deckListProvider.notifier).setActiveTab('ALL');
                      },
                    ),
                  ),
                  Expanded(
                    child: TabButton(
                      label: 'MY DECKS',
                      isActive: deckState.activeTab == 'USER',
                      onTap: () {
                        ref
                            .read(deckListProvider.notifier)
                            .setActiveTab('USER');
                      },
                    ),
                  ),
                ],
              ),
            ),

          // Filters & Searches panel
          Padding(
            padding: const .symmetric(horizontal: 16.0, vertical: 12.0),
            child: Column(
              children: [
                // Search Input
                TextField(
                  controller: _searchController,
                  onChanged: (val) {
                    ref.read(deckListProvider.notifier).setSearchQuery(val);
                  },
                  style: tt.bodyMedium!.copyWith(color: cs.onSurface),
                  decoration: InputDecoration(
                    hintText: 'Search decks...',
                    prefixIcon: Icon(
                      Icons.search,
                      color: cs.onSurface.withValues(alpha: 0.54),
                    ),
                    contentPadding: const .symmetric(vertical: 10),
                  ),
                ),
                const SizedBox(height: 12),

                // Horizontal format carousel list
                SizedBox(
                  height: 38,
                  child: formatsAsync.when(
                    data: (formats) {
                      final formatsList = ['ALL', ...formats];
                      final currentFormat = deckState.format;
                      return FormatCarousel(
                        formatsList: formatsList,
                        currentFormat: currentFormat,
                        onSelectedAction: ref
                            .read(deckListProvider.notifier)
                            .setFormat,
                      );
                    },
                    loading: () => ListView.builder(
                      scrollDirection: .horizontal,
                      itemCount: 5,
                      itemBuilder: (context, index) => const Padding(
                        padding: .only(right: 8.0),
                        child: ShimmerPlaceholder(
                          width: 80,
                          height: 32,
                          borderRadius: 20,
                        ),
                      ),
                    ),
                    error: (_, _) => Align(
                      alignment: Alignment.centerLeft,
                      child: Text(
                        'Failed to load formats',
                        style: tt.bodySmall!.copyWith(color: cs.error),
                      ),
                    ),
                  ),
                ),
              ],
            ),
          ),

          // Decks List Catalog panel
          Expanded(
            child: RefreshIndicator(
              color: DeckLabTheme.goldAccent,
              backgroundColor: DeckLabTheme.darkSurface,
              onRefresh: () => ref
                  .read(deckListProvider.notifier)
                  .fetchNextPage(isRefresh: true),
              child: deckState.decks.isEmpty && !deckState.isLoading
                  ? EmptyState(text: 'No Decks Found', icon: Icons.layers_clear)
                  : ListView.builder(
                      controller: _scrollController,
                      padding: const .all(16.0),
                      itemCount:
                          deckState.decks.length + (deckState.hasMore ? 1 : 0),
                      itemBuilder: (context, index) {
                        if (index == deckState.decks.length) {
                          return const Padding(
                            padding: .symmetric(vertical: 24.0),
                            child: Center(
                              child: CircularProgressIndicator(
                                color: DeckLabTheme.goldAccent,
                              ),
                            ),
                          );
                        }

                        final deck = deckState.decks[index];
                        return DeckItemCard(deck: deck);
                      },
                    ),
            ),
          ),
        ],
      ),
    );
  }
}
