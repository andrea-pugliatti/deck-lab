import 'package:flutter/material.dart';
import '../../../core/theme/theme.dart';

class FormatCarousel extends StatelessWidget {
  final List<String> formatsList;
  final String currentFormat;
  final Function(String) onSelectedAction;

  const FormatCarousel({
    super.key,
    required this.formatsList,
    required this.currentFormat,
    required this.onSelectedAction,
  });

  @override
  Widget build(BuildContext context) {
    return ListView.builder(
      scrollDirection: .horizontal,
      itemCount: formatsList.length,
      itemBuilder: (context, index) {
        final format = formatsList[index];
        final isSelected = currentFormat.toUpperCase() == format.toUpperCase();
        return Padding(
          padding: const .only(right: 8.0),
          child: FilterChip(
            label: Text(
              format.toUpperCase(),
              style: TextStyle(
                color: isSelected ? DeckLabTheme.darkBg : Colors.white,
                fontWeight: .bold,
                fontSize: 12,
              ),
            ),
            selected: isSelected,
            onSelected: (_) => onSelectedAction(format),
            selectedColor: DeckLabTheme.goldAccent,
            backgroundColor: DeckLabTheme.darkSurface,
            checkmarkColor: DeckLabTheme.darkBg,
            shape: RoundedRectangleBorder(
              borderRadius: .circular(20),
              side: const BorderSide(color: DeckLabTheme.borderDim),
            ),
          ),
        );
      },
    );
  }
}
