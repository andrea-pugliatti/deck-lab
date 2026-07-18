import 'package:flutter/material.dart';
import 'package:mobile/ui/core/theme/theme.dart';

class FilterDropdown extends StatelessWidget {
  final String active;
  final List<String> items;
  final ValueChanged<String?> onChanged;

  const FilterDropdown({
    super.key,
    required this.active,
    required this.items,
    required this.onChanged,
  });

  @override
  Widget build(BuildContext context) {
    return DropdownButtonFormField<String>(
      initialValue: items.contains(active) ? active : items.first,
      dropdownColor: DeckLabTheme.darkSurface,
      style: const TextStyle(color: Colors.white, fontSize: 13),
      decoration: const InputDecoration(
        contentPadding: .symmetric(horizontal: 12, vertical: 8),
      ),
      onChanged: onChanged,
      items: items
          .map((item) => DropdownMenuItem(value: item, child: Text(item)))
          .toList(),
    );
  }
}
