import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:mobile/ui/core/theme/theme.dart';
import 'package:mobile/ui/core/widgets/custom_button.dart';
import 'package:mobile/ui/core/widgets/shimmer_placeholder.dart';
import 'package:mobile/ui/features/cards/view_models/card_db_provider.dart';
import 'package:mobile/ui/features/cards/widgets/filter_dropdown.dart';

class FilterModal extends StatelessWidget {
  final AsyncValue<List<String>> types;
  final AsyncValue<List<String>> attributes;
  final AsyncValue<List<String>> races;
  final CardDbState state;
  final CardDbNotifier notifier;

  const FilterModal({
    super.key,
    required this.types,
    required this.attributes,
    required this.races,
    required this.state,
    required this.notifier,
  });

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const .all(20.0),
      child: SingleChildScrollView(
        child: Column(
          mainAxisSize: .min,
          crossAxisAlignment: .stretch,
          children: [
            Row(
              mainAxisAlignment: .spaceBetween,
              children: [
                Text(
                  'Catalog Filters',
                  style: DeckLabTheme.darkTheme.textTheme.headlineMedium!,
                ),
                TextButton(
                  onPressed: () {
                    notifier.clearFilters();
                    Navigator.of(context).pop();
                  },
                  child: const Text(
                    'Clear All',
                    style: TextStyle(color: DeckLabTheme.errorAccent),
                  ),
                ),
              ],
            ),
            const Divider(),
            const SizedBox(height: 12),

            // Card Type dropdown
            const Text(
              'Card Type',
              style: TextStyle(
                color: DeckLabTheme.goldAccent,
                fontSize: 11,
                fontWeight: .bold,
              ),
            ),
            const SizedBox(height: 6),
            types.when(
              data: (list) => FilterDropdown(
                active: state.type,
                items: ['All Types', ...list],
                onChanged: (val) => notifier.setType(val!),
              ),
              loading: () =>
                  const ShimmerPlaceholder(width: .infinity, height: 40),
              error: (_, _) => const Text(
                'Error loading types',
                style: TextStyle(color: DeckLabTheme.errorAccent),
              ),
            ),
            const SizedBox(height: 16),

            // Attribute dropdown
            const Text(
              'Monster Attribute',
              style: TextStyle(
                color: DeckLabTheme.goldAccent,
                fontSize: 11,
                fontWeight: .bold,
              ),
            ),
            const SizedBox(height: 6),
            attributes.when(
              data: (list) => FilterDropdown(
                active: state.attribute,
                items: ['All Attributes', ...list],
                onChanged: (val) => notifier.setAttribute(val!),
              ),
              loading: () =>
                  const ShimmerPlaceholder(width: .infinity, height: 40),
              error: (_, _) => const Text(
                'Error loading attributes',
                style: TextStyle(color: DeckLabTheme.errorAccent),
              ),
            ),
            const SizedBox(height: 16),

            // Race/Property dropdown
            const Text(
              'Race / Property',
              style: TextStyle(
                color: DeckLabTheme.goldAccent,
                fontSize: 11,
                fontWeight: .bold,
              ),
            ),
            const SizedBox(height: 6),
            races.when(
              data: (list) => FilterDropdown(
                active: state.race,
                items: ['All Properties', ...list],
                onChanged: (val) => notifier.setRace(val!),
              ),
              loading: () =>
                  const ShimmerPlaceholder(width: .infinity, height: 40),
              error: (_, _) => const Text(
                'Error loading properties',
                style: TextStyle(color: DeckLabTheme.errorAccent),
              ),
            ),
            const SizedBox(height: 24),

            CustomButton(
              text: 'Apply Filters',
              onPressed: () => Navigator.of(context).pop(),
            ),
          ],
        ),
      ),
    );
  }
}
