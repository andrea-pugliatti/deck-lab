import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import 'package:mobile/ui/features/deck_builder/widgets/builder_section.dart';
import 'package:mobile/ui/features/deck_builder/widgets/cards_catalog.dart';
import 'package:mobile/ui/features/deck_builder/widgets/validation_errors.dart';
import '../../../core/theme/theme.dart';
import '../view_models/deck_builder_provider.dart';
import '../../dashboard/view_models/deck_list_provider.dart';
import '../../cards/view_models/card_db_provider.dart';
import '../../../core/widgets/custom_input.dart';
import '../../../core/widgets/shimmer_placeholder.dart';
import '../../../../navigation/routes.dart';

/// Interactive workspace for compiling, editing, and saving deck blueprints.
class DeckBuilderScreen extends ConsumerStatefulWidget {
  final int? deckId;

  const DeckBuilderScreen({super.key, this.deckId});

  @override
  ConsumerState<DeckBuilderScreen> createState() => _DeckBuilderScreenState();
}

class _DeckBuilderScreenState extends ConsumerState<DeckBuilderScreen>
    with SingleTickerProviderStateMixin {
  final _nameController = TextEditingController();
  final _descController = TextEditingController();
  final _catalogSearchController = TextEditingController();
  late TabController _tabController;

  String _selectedSection = 'MAIN';

  @override
  void initState() {
    super.initState();
    _tabController = TabController(length: 2, vsync: this);

    WidgetsBinding.instance.addPostFrameCallback((_) {
      ref.read(deckBuilderProvider.notifier).initialize(widget.deckId);
      ref.read(cardDbProvider.notifier).fetchNextPage(isRefresh: true);
    });
  }

  @override
  void dispose() {
    _nameController.dispose();
    _descController.dispose();
    _catalogSearchController.dispose();
    _tabController.dispose();
    super.dispose();
  }

  void _save() async {
    final builderNotifier = ref.read(deckBuilderProvider.notifier);
    builderNotifier.updateName(_nameController.text);
    builderNotifier.updateDescription(_descController.text);

    final savedId = await builderNotifier.saveDeck();
    if (!mounted) return;

    if (savedId != null) {
      ref.read(deckListProvider.notifier).fetchNextPage(isRefresh: true);
      context.go(AppRoutes.deckDetail(savedId));
    }
  }

  @override
  Widget build(BuildContext context) {
    ref.listen<DeckBuilderState>(deckBuilderProvider, (previous, next) {
      final finishedLoading =
          (previous == null || previous.isLoading) && !next.isLoading;
      final finishedGenerating =
          previous != null && previous.isGenerating && !next.isGenerating;
      if (finishedLoading || finishedGenerating) {
        _nameController.text = next.name;
        _descController.text = next.description;
      }

      if (next.error != null && next.error != previous?.error) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Text(next.error!),
            backgroundColor: DeckLabTheme.errorAccent,
          ),
        );
        ref.read(deckBuilderProvider.notifier).clearError();
      }
    });

    final builderState = ref.watch(deckBuilderProvider);
    final formatsAsync = ref.watch(formatsProvider);
    final cardDbState = ref.watch(cardDbProvider);

    if (builderState.isLoading) {
      return const Scaffold(
        body: Center(
          child: CircularProgressIndicator(color: DeckLabTheme.goldAccent),
        ),
      );
    }

    final mainCards = builderState.cards.where(
      (c) => c.section.toUpperCase() == 'MAIN',
    );
    final extraCards = builderState.cards.where(
      (c) => c.section.toUpperCase() == 'EXTRA',
    );
    final sideCards = builderState.cards.where(
      (c) => c.section.toUpperCase() == 'SIDE',
    );

    final mainCount = mainCards.fold(0, (sum, c) => sum + c.quantity);
    final extraCount = extraCards.fold(0, (sum, c) => sum + c.quantity);
    final sideCount = sideCards.fold(0, (sum, c) => sum + c.quantity);

    return Scaffold(
      appBar: AppBar(
        title: Text(
          widget.deckId != null ? 'EDIT DECK' : 'CONSTRUCT DECK',
          style: Theme.of(
            context,
          ).textTheme.titleMedium!.copyWith(letterSpacing: 1.5, fontSize: 16),
        ),
        actions: [
          if (builderState.isSaving)
            Padding(
              padding: const .symmetric(horizontal: 16.0),
              child: Center(
                child: SizedBox(
                  width: 18,
                  height: 18,
                  child: CircularProgressIndicator(
                    strokeWidth: 2,
                    color: Theme.of(context).colorScheme.primary,
                  ),
                ),
              ),
            )
          else
            IconButton(
              icon: Icon(
                Icons.save,
                color: Theme.of(context).colorScheme.primary,
              ),
              tooltip: 'Save Blueprint',
              onPressed: _save,
            ),
        ],
      ),
      body: Column(
        children: [
          // Tab switches between "Deck Structure" and "Add Cards"
          TabBar(
            controller: _tabController,
            indicatorColor: Theme.of(context).colorScheme.secondary,
            labelColor: Theme.of(context).colorScheme.onSurface,
            unselectedLabelColor: Theme.of(
              context,
            ).colorScheme.onSurface.withValues(alpha: 0.38),
            tabs: const [
              Tab(text: 'STRUCTURE'),
              Tab(text: 'ADD CARDS'),
            ],
          ),

          Expanded(
            child: TabBarView(
              controller: _tabController,
              children: [
                // Deck Structure & Metadata
                SingleChildScrollView(
                  padding: const .all(16.0),
                  child: Column(
                    crossAxisAlignment: .start,
                    children: [
                      CustomInput(
                        label: 'Deck Name',
                        placeholder: 'Enter deck name...',
                        controller: _nameController,
                      ),
                      const SizedBox(height: 16),
                      CustomInput(
                        label: 'Strategy Notes',
                        placeholder: 'Combos, side strategies, notes...',
                        controller: _descController,
                        keyboardType: .multiline,
                        textInputAction: .newline,
                      ),
                      const SizedBox(height: 16),

                      // Format select
                      Text(
                        'Legality Format',
                        style: Theme.of(context).textTheme.labelMedium!
                            .copyWith(
                              color: Theme.of(context).colorScheme.primary,
                              fontWeight: .w600,
                            ),
                      ),
                      const SizedBox(height: 8),
                      formatsAsync.when(
                        data: (formats) => DropdownButtonFormField<String>(
                          isExpanded: true,
                          initialValue:
                              formats.contains(builderState.formatName)
                              ? builderState.formatName
                              : formats.first,
                          style: Theme.of(context).textTheme.bodyMedium!
                              .copyWith(
                                color: Theme.of(context).colorScheme.onSurface,
                              ),
                          dropdownColor: DeckLabTheme.darkSurface,
                          decoration: const InputDecoration(
                            contentPadding: .symmetric(
                              horizontal: 12,
                              vertical: 10,
                            ),
                          ),
                          onChanged: (val) {
                            if (val != null) {
                              ref
                                  .read(deckBuilderProvider.notifier)
                                  .updateFormat(val);
                            }
                          },
                          items: formats.map((fmt) {
                            return DropdownMenuItem<String>(
                              value: fmt,
                              child: Text(fmt.toUpperCase()),
                            );
                          }).toList(),
                        ),
                        loading: () => const ShimmerPlaceholder(
                          width: .infinity,
                          height: 48,
                        ),
                        error: (_, _) => Text(
                          'Failed to load formats',
                          style: Theme.of(context).textTheme.bodySmall!
                              .copyWith(
                                color: Theme.of(context).colorScheme.error,
                              ),
                        ),
                      ),
                      const SizedBox(height: 24),

                      // Rules check validation banner
                      if (builderState.validationErrors.isNotEmpty) ...[
                        ValidationErrors(errors: builderState.validationErrors),
                        const SizedBox(height: 24),
                      ],

                      // Card Lists
                      BuilderSection(
                        title: 'MAIN DECK',
                        cards: mainCards,
                        count: mainCount,
                        indicatorColor: DeckLabTheme.mainDeckAccent,
                        sectionKey: 'MAIN',
                        notifier: ref.read(deckBuilderProvider.notifier),
                      ),
                      BuilderSection(
                        title: 'EXTRA DECK',
                        cards: extraCards,
                        count: extraCount,
                        indicatorColor: DeckLabTheme.extraDeckAccent,
                        sectionKey: 'EXTRA',
                        notifier: ref.read(deckBuilderProvider.notifier),
                      ),
                      BuilderSection(
                        title: 'SIDE DECK',
                        cards: sideCards,
                        count: sideCount,
                        indicatorColor: DeckLabTheme.sideDeckAccent,
                        sectionKey: 'SIDE',
                        notifier: ref.read(deckBuilderProvider.notifier),
                      ),
                      const SizedBox(height: 48),
                    ],
                  ),
                ),

                // Catalog Library Search & AI suggestions panel
                Column(
                  children: [
                    // Search bar
                    Padding(
                      padding: const .all(12.0),
                      child: Column(
                        children: [
                          TextField(
                            controller: _catalogSearchController,
                            onChanged: (val) {
                              ref
                                  .read(cardDbProvider.notifier)
                                  .setSearchQuery(val);
                            },
                            style: Theme.of(context).textTheme.bodyMedium!
                                .copyWith(
                                  color: Theme.of(
                                    context,
                                  ).colorScheme.onSurface,
                                ),
                            decoration: InputDecoration(
                              hintText: 'Search card database...',
                              prefixIcon: Icon(
                                Icons.search,
                                color: Theme.of(
                                  context,
                                ).colorScheme.onSurface.withValues(alpha: 0.54),
                              ),
                              contentPadding: const .symmetric(vertical: 10),
                            ),
                          ),
                          const SizedBox(height: 10),

                          // Target Section Select
                          Row(
                            mainAxisAlignment: .spaceBetween,
                            children: [
                              Text(
                                'Target Add Section:',
                                style: Theme.of(context).textTheme.bodySmall!
                                    .copyWith(fontWeight: .bold),
                              ),
                              DropdownButton<String>(
                                value: _selectedSection,
                                style: Theme.of(context).textTheme.labelMedium!
                                    .copyWith(
                                      color: Theme.of(
                                        context,
                                      ).colorScheme.secondary,
                                      fontWeight: .bold,
                                    ),
                                dropdownColor: DeckLabTheme.darkSurface,
                                underline: const SizedBox.shrink(),
                                onChanged: (val) {
                                  if (val != null) {
                                    setState(() {
                                      _selectedSection = val;
                                    });
                                  }
                                },
                                items: const [
                                  DropdownMenuItem(
                                    value: 'MAIN',
                                    child: Text('MAIN DECK'),
                                  ),
                                  DropdownMenuItem(
                                    value: 'EXTRA',
                                    child: Text('EXTRA DECK'),
                                  ),
                                  DropdownMenuItem(
                                    value: 'SIDE',
                                    child: Text('SIDE DECK'),
                                  ),
                                ],
                              ),
                            ],
                          ),
                        ],
                      ),
                    ),

                    // Cards results list
                    Expanded(
                      child: cardDbState.cards.isEmpty && cardDbState.isLoading
                          ? Center(
                              child: CircularProgressIndicator(
                                color: Theme.of(context).colorScheme.primary,
                              ),
                            )
                          : CardsCatalog(
                              cards: cardDbState.cards,
                              selectedSection: _selectedSection,
                              notifier: ref.read(deckBuilderProvider.notifier),
                            ),
                    ),
                  ],
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }
}
