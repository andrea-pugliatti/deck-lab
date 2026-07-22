/// Represents a strategic playstyle option that can be applied to the deck generator.
class StrategyOption {
  final String label;
  final String value;
  final String description;

  const StrategyOption({
    required this.label,
    required this.value,
    required this.description,
  });

  @override
  bool operator ==(Object other) =>
      identical(this, other) ||
      other is StrategyOption &&
          runtimeType == other.runtimeType &&
          label == other.label &&
          value == other.value &&
          description == other.description;

  @override
  int get hashCode => label.hashCode ^ value.hashCode ^ description.hashCode;
}

/// Predefined list of deck-building playstyle strategies.
const List<StrategyOption> defaultStrategies = [
  StrategyOption(
    label: 'None (Standard)',
    value: 'None',
    description:
        'Build a standard, balanced deck following the archetype\'s core style.',
  ),
  StrategyOption(
    label: 'Combo / Synchro Spam',
    value: 'Combo',
    description:
        'Focuses on explosive special summon chains, search effects, and boss monster boards.',
  ),
  StrategyOption(
    label: 'Control / Stun',
    value: 'Control',
    description:
        'Focuses on counter-traps, hand traps, negates, and resource denial.',
  ),
  StrategyOption(
    label: 'Aggro / OTK',
    value: 'Aggro',
    description:
        'Focuses on high attack stats, board wipes, and quick One-Turn Kills.',
  ),
  StrategyOption(
    label: 'Midrange',
    value: 'Midrange',
    description:
        'A balanced hybrid focusing on recurring resource loops, consistency, and grind game.',
  ),
  StrategyOption(
    label: 'Going Second',
    value: 'Going Second',
    description:
        'Optimized with board breakers and hand traps to break opposing setups.',
  ),
  StrategyOption(
    label: 'Stall / Burn',
    value: 'Stall/Burn',
    description:
        'Uses defense, negation, stalling tactics, and direct burn damage to win.',
  ),
  StrategyOption(
    label: 'Pure Archetype',
    value: 'Pure',
    description:
        'Stick strictly to cards of the chosen archetype for a thematic build.',
  ),
];
