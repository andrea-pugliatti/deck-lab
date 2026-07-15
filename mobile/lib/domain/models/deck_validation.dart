/// Domain model representing the result of a deck validation rules check.
class DeckValidation {
  final bool isValid;
  final List<String> errors;

  const DeckValidation({required this.isValid, this.errors = const []});

  DeckValidation copyWith({bool? isValid, List<String>? errors}) {
    return DeckValidation(
      isValid: isValid ?? this.isValid,
      errors: errors ?? this.errors,
    );
  }

  @override
  bool operator ==(Object other) =>
      identical(this, other) ||
      other is DeckValidation &&
          runtimeType == other.runtimeType &&
          isValid == other.isValid &&
          _listEquals(errors, other.errors);

  @override
  int get hashCode => isValid.hashCode ^ errors.hashCode;

  bool _listEquals<T>(List<T> a, List<T> b) {
    if (a.length != b.length) return false;
    for (int i = 0; i < a.length; i++) {
      if (a[i] != b[i]) return false;
    }
    return true;
  }
}
