import 'dart:io';

import 'package:file_picker/file_picker.dart';
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import 'package:mobile/domain/enums/enums.dart';

import '../../../../navigation/routes.dart';
import '../../../core/theme/theme.dart';
import '../../../core/widgets/custom_input.dart';
import '../../../core/widgets/shimmer_placeholder.dart';
import '../../cards/view_models/card_db_provider.dart';
import '../../decks/view_models/deck_list_provider.dart';
import '../view_models/deck_builder_provider.dart';
import '../widgets/ai_suggestions_panel.dart';
import '../widgets/ai_wizard_modal.dart';
import '../widgets/builder_section.dart';
import '../widgets/cards_catalog.dart';
import '../widgets/generating_state.dart';
import '../widgets/validation_errors.dart';

/// Workspace screen for constructing and editing Yu-Gi-Oh! deck blueprints.
///
/// Features dynamic Main, Extra, Side layout views, rules check engine validation,
/// real-time card search catalog, and AI deck generator wizard integration.
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
  DeckSection _selectedSection = DeckSection.main;

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
      if (previous?.name != next.name ||
          previous?.description != next.description) {
        if (_nameController.text != next.name) {
          _nameController.text = next.name;
        }
        if (_descController.text != next.description) {
          _descController.text = next.description;
        }
      }
    });

    final builderState = ref.watch(deckBuilderProvider);
    final cardDbState = ref.watch(cardDbProvider);
    final formatsAsync = ref.watch(formatsProvider);

    // Sync input fields when preloaded deck values load initially
    if (_nameController.text.isEmpty && builderState.name.isNotEmpty) {
      _nameController.text = builderState.name;
      _descController.text = builderState.description;
    }

    // Filter deck cards by section
    final mainCards = builderState.cards.where(
      (c) => c.section == DeckSection.main,
    );
    final extraCards = builderState.cards.where(
      (c) => c.section == DeckSection.extra,
    );
    final sideCards = builderState.cards.where(
      (c) => c.section == DeckSection.side,
    );

    final mainCount = mainCards.fold(0, (sum, c) => sum + c.quantity);
    final extraCount = extraCards.fold(0, (sum, c) => sum + c.quantity);
    final sideCount = sideCards.fold(0, (sum, c) => sum + c.quantity);

    return Scaffold(
      backgroundColor: DeckLabTheme.darkBg,
      appBar: AppBar(
        title: Text(widget.deckId == null ? 'CONSTRUCT DECK' : 'EDIT DECK'),
        centerTitle: true,
        actions: [
          IconButton(
            icon: const Icon(Icons.file_upload_outlined),
            tooltip: 'Import .ydk File',
            onPressed: () async {
              try {
                final result = await FilePicker.platform.pickFiles(
                  type: FileType.custom,
                  allowedExtensions: ['ydk'],
                  withData: true,
                );
                if (result != null && result.files.isNotEmpty) {
                  final file = result.files.first;
                  final bytes = file.bytes ??
                      (file.path != null ? await File(file.path!).readAsBytes() : null);
                  if (bytes != null) {
                    ref.read(deckBuilderProvider.notifier).importYdk(
                          bytes,
                          file.name,
                        );
                  }
                }
              } catch (e) {
                if (context.mounted) {
                  ScaffoldMessenger.of(context).showSnackBar(
                    SnackBar(
                      content: Text('Failed to pick .ydk file: $e'),
                      backgroundColor: DeckLabTheme.errorAccent,
                    ),
                  );
                }
              }
            },
          ),
          IconButton(
            icon: const Icon(Icons.auto_awesome),
            tooltip: 'AI Generator Wizard',
            onPressed: () => AiWizardModal.show(context),
          ),
          IconButton(
            icon: builderState.isSaving
                ? const SizedBox(
                    width: 20,
                    height: 20,
                    child: CircularProgressIndicator(strokeWidth: 2),
                  )
                : const Icon(Icons.save),
            tooltip: 'Save Blueprint',
            onPressed: builderState.isSaving ? null : _save,
          ),
        ],
        bottom: TabBar(
          controller: _tabController,
          indicatorColor: Theme.of(context).colorScheme.primary,
          tabs: const [
            Tab(text: 'DECK STRUCTURE'),
            Tab(text: 'ADD CARDS'),
          ],
        ),
      ),
      body: builderState.isLoading
          ? Center(
              child: CircularProgressIndicator(
                color: Theme.of(context).colorScheme.primary,
              ),
            )
          : builderState.isGenerating
          ? const Center(child: GeneratingState())
          : Column(
              children: [
                // Error Snackbar Trigger
                if (builderState.error != null)
                  Container(
                    width: .infinity,
                    color: Theme.of(context).colorScheme.errorContainer,
                    padding: const .symmetric(horizontal: 16, vertical: 8),
                    child: Row(
                      children: [
                        Icon(
                          Icons.error_outline,
                          color: Theme.of(context).colorScheme.onErrorContainer,
                          size: 18,
                        ),
                        const SizedBox(width: 8),
                        Expanded(
                          child: Text(
                            builderState.error!,
                            style: Theme.of(context).textTheme.bodySmall!
                                .copyWith(
                                  color: Theme.of(
                                    context,
                                  ).colorScheme.onErrorContainer,
                                ),
                          ),
                        ),
                        IconButton(
                          icon: const Icon(Icons.close, size: 16),
                          onPressed: () {
                            ref.read(deckBuilderProvider.notifier).clearError();
                          },
                        ),
                      ],
                    ),
                  ),

                // Main TabBar View Area
                Expanded(
                  child: TabBarView(
                    controller: _tabController,
                    children: [
                      // Structure Configuration Panel
                      SingleChildScrollView(
                        padding: const .symmetric(horizontal: 16.0),
                        child: Column(
                          crossAxisAlignment: .stretch,
                          children: [
                            const SizedBox(height: 16),
                            CustomInput(
                              label: 'Deck Name',
                              placeholder: 'e.g. Cyber Dragon Aggro',
                              controller: _nameController,
                              prefixIcon: Icons.style,
                            ),
                            const SizedBox(height: 16),
                            CustomInput(
                              label: 'Strategy Notes',
                              placeholder:
                                  'Describe win condition & combo targets...',
                              controller: _descController,
                              prefixIcon: Icons.notes,
                            ),
                            const SizedBox(height: 16),

                            // Format selector dropdown
                            Text(
                              'Format',
                              style: Theme.of(context).textTheme.labelMedium!
                                  .copyWith(
                                    color: Theme.of(
                                      context,
                                    ).colorScheme.primary,
                                    fontWeight: .w600,
                                  ),
                            ),
                            const SizedBox(height: 8),
                            formatsAsync.when(
                              data: (formats) {
                                final formatSet = formats
                                    .map((fmtStr) => Format.fromString(fmtStr))
                                    .toSet();
                                formatSet.add(builderState.formatName);
                                final formatList = formatSet.toList();

                                return DropdownButtonFormField<Format>(
                                  isExpanded: true,
                                  initialValue: builderState.formatName,
                                  style: Theme.of(context).textTheme.bodyMedium!
                                      .copyWith(
                                        color: Theme.of(
                                          context,
                                        ).colorScheme.onSurface,
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
                                  items: formatList.map((fmt) {
                                    return DropdownMenuItem<Format>(
                                      value: fmt,
                                      child: Text(fmt.value.toUpperCase()),
                                    );
                                  }).toList(),
                                );
                              },
                              loading: () => const ShimmerPlaceholder(
                                width: .infinity,
                                height: 48,
                              ),
                              error: (_, _) => const Text(
                                'Failed to load format rules options.',
                              ),
                            ),
                            const SizedBox(height: 24),

                            // Rules check validation banner
                            if (builderState.validationErrors.isNotEmpty) ...[
                              ValidationErrors(
                                errors: builderState.validationErrors,
                              ),
                              const SizedBox(height: 24),
                            ],

                            // Card Lists
                            BuilderSection(
                              title: 'MAIN DECK',
                              cards: mainCards,
                              count: mainCount,
                              indicatorColor: DeckLabTheme.mainDeckAccent,
                              sectionKey: .main,
                              notifier: ref.read(deckBuilderProvider.notifier),
                            ),
                            BuilderSection(
                              title: 'EXTRA DECK',
                              cards: extraCards,
                              count: extraCount,
                              indicatorColor: DeckLabTheme.extraDeckAccent,
                              sectionKey: .extra,
                              notifier: ref.read(deckBuilderProvider.notifier),
                            ),
                            BuilderSection(
                              title: 'SIDE DECK',
                              cards: sideCards,
                              count: sideCount,
                              indicatorColor: DeckLabTheme.sideDeckAccent,
                              sectionKey: .side,
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
                            padding: const EdgeInsets.all(12.0),
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
                                      color: Theme.of(context)
                                          .colorScheme
                                          .onSurface
                                          .withValues(alpha: 0.54),
                                    ),
                                    contentPadding: const .symmetric(
                                      vertical: 10,
                                    ),
                                  ),
                                ),
                                const SizedBox(height: 10),

                                // Target Section Select
                                Row(
                                  mainAxisAlignment: .spaceBetween,
                                  children: [
                                    Text(
                                      'Target Add Section:',
                                      style: Theme.of(context)
                                          .textTheme
                                          .bodySmall!
                                          .copyWith(fontWeight: .bold),
                                    ),
                                    DropdownButton<DeckSection>(
                                      value: _selectedSection,
                                      style: Theme.of(context)
                                          .textTheme
                                          .labelMedium!
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
                                          value: .main,
                                          child: Text('MAIN DECK'),
                                        ),
                                        DropdownMenuItem(
                                          value: .extra,
                                          child: Text('EXTRA DECK'),
                                        ),
                                        DropdownMenuItem(
                                          value: .side,
                                          child: Text('SIDE DECK'),
                                        ),
                                      ],
                                    ),
                                  ],
                                ),
                              ],
                            ),
                          ),

                          // AI Suggestions Panel
                          if (builderState.aiSuggestions.isNotEmpty)
                            AiSuggestionsPanel(
                              suggestions: builderState.aiSuggestions,
                              notifier: ref.read(deckBuilderProvider.notifier),
                            ),

                          // Cards results list
                          Expanded(
                            child:
                                cardDbState.cards.isEmpty &&
                                    cardDbState.isLoading
                                ? Center(
                                    child: CircularProgressIndicator(
                                      color: Theme.of(
                                        context,
                                      ).colorScheme.primary,
                                    ),
                                  )
                                : CardsCatalog(
                                    cards: cardDbState.cards,
                                    selectedSection: _selectedSection,
                                    notifier: ref.read(
                                      deckBuilderProvider.notifier,
                                    ),
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
