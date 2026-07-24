import 'package:freezed_annotation/freezed_annotation.dart';

/// Card race or type group.
@JsonEnum()
enum CardRace {
  @JsonValue('Aqua')
  aqua('Aqua'),
  @JsonValue('Beast')
  beast('Beast'),
  @JsonValue('Beast-Warrior')
  beastWarrior('Beast-Warrior'),
  @JsonValue('Creator God')
  creatorGod('Creator God'),
  @JsonValue('Cyberse')
  cyberse('Cyberse'),
  @JsonValue('Dinosaur')
  dinosaur('Dinosaur'),
  @JsonValue('Divine-Beast')
  divineBeast('Divine-Beast'),
  @JsonValue('Dragon')
  dragon('Dragon'),
  @JsonValue('Fairy')
  fairy('Fairy'),
  @JsonValue('Fiend')
  fiend('Fiend'),
  @JsonValue('Fish')
  fish('Fish'),
  @JsonValue('Illusion')
  illusion('Illusion'),
  @JsonValue('Insect')
  insect('Insect'),
  @JsonValue('Machine')
  machine('Machine'),
  @JsonValue('Plant')
  plant('Plant'),
  @JsonValue('Psychic')
  psychic('Psychic'),
  @JsonValue('Pyro')
  pyro('Pyro'),
  @JsonValue('Reptile')
  reptile('Reptile'),
  @JsonValue('Rock')
  rock('Rock'),
  @JsonValue('Sea Serpent')
  seaSerpent('Sea Serpent'),
  @JsonValue('Spellcaster')
  spellcaster('Spellcaster'),
  @JsonValue('Thunder')
  thunder('Thunder'),
  @JsonValue('Warrior')
  warrior('Warrior'),
  @JsonValue('Winged Beast')
  wingedBeast('Winged Beast'),
  @JsonValue('Wyrm')
  wyrm('Wyrm'),
  @JsonValue('Zombie')
  zombie('Zombie'),

  // Spell/Trap Subtypes
  @JsonValue('Normal')
  normal('Normal'),
  @JsonValue('Field')
  field('Field'),
  @JsonValue('Equip')
  equip('Equip'),
  @JsonValue('Continuous')
  continuous('Continuous'),
  @JsonValue('Quick-Play')
  quickPlay('Quick-Play'),
  @JsonValue('Ritual')
  ritual('Ritual'),
  @JsonValue('Counter')
  counter('Counter'),

  // Others
  @JsonValue('Skill')
  skill('Skill'),
  @JsonValue('Token')
  token('Token'),
  @JsonValue('Unknown')
  unknown('Unknown');

  final String value;
  const CardRace(this.value);

  static CardRace fromString(String? val) {
    if (val == null || val.trim().isEmpty) return CardRace.unknown;
    final trimmed = val.trim();
    return CardRace.values.firstWhere(
      (e) => e.value.toLowerCase() == trimmed.toLowerCase(),
      orElse: () => CardRace.unknown,
    );
  }
}
