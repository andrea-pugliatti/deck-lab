import 'package:freezed_annotation/freezed_annotation.dart';

/// Card frame render styles.
@JsonEnum()
enum FrameType {
  @JsonValue('normal')
  normal('normal'),
  @JsonValue('effect')
  effect('effect'),
  @JsonValue('ritual')
  ritual('ritual'),
  @JsonValue('fusion')
  fusion('fusion'),
  @JsonValue('synchro')
  synchro('synchro'),
  @JsonValue('xyz')
  xyz('xyz'),
  @JsonValue('link')
  link('link'),
  @JsonValue('pendulum')
  pendulum('pendulum'),
  @JsonValue('spell')
  spell('spell'),
  @JsonValue('trap')
  trap('trap'),
  @JsonValue('token')
  token('token'),
  @JsonValue('skill')
  skill('skill'),
  @JsonValue('normal_pendulum')
  normalPendulum('normal_pendulum'),
  @JsonValue('effect_pendulum')
  effectPendulum('effect_pendulum'),
  @JsonValue('fusion_pendulum')
  fusionPendulum('fusion_pendulum'),
  @JsonValue('synchro_pendulum')
  synchroPendulum('synchro_pendulum'),
  @JsonValue('xyz_pendulum')
  xyzPendulum('xyz_pendulum'),
  @JsonValue('unknown')
  unknown('unknown');

  final String value;
  const FrameType(this.value);

  static FrameType fromString(String? val) {
    if (val == null || val.trim().isEmpty) return FrameType.unknown;
    final trimmed = val.trim();
    return FrameType.values.firstWhere(
      (e) => e.value.toLowerCase() == trimmed.toLowerCase(),
      orElse: () => FrameType.unknown,
    );
  }
}
