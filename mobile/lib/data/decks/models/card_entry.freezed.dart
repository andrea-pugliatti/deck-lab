// GENERATED CODE - DO NOT MODIFY BY HAND
// coverage:ignore-file
// ignore_for_file: type=lint
// ignore_for_file: unused_element, deprecated_member_use, deprecated_member_use_from_same_package, use_function_type_syntax_for_parameters, unnecessary_const, avoid_init_to_null, invalid_override_different_default_values_named, prefer_expression_function_bodies, annotate_overrides, invalid_annotation_target, unnecessary_question_mark

part of 'card_entry.dart';

// **************************************************************************
// FreezedGenerator
// **************************************************************************

// dart format off
T _$identity<T>(T value) => value;

/// @nodoc
mixin _$CardEntry {

 String get name; String get section; int get quantity;
/// Create a copy of CardEntry
/// with the given fields replaced by the non-null parameter values.
@JsonKey(includeFromJson: false, includeToJson: false)
@pragma('vm:prefer-inline')
$CardEntryCopyWith<CardEntry> get copyWith => _$CardEntryCopyWithImpl<CardEntry>(this as CardEntry, _$identity);

  /// Serializes this CardEntry to a JSON map.
  Map<String, dynamic> toJson();


@override
bool operator ==(Object other) {
  return identical(this, other) || (other.runtimeType == runtimeType&&other is CardEntry&&(identical(other.name, name) || other.name == name)&&(identical(other.section, section) || other.section == section)&&(identical(other.quantity, quantity) || other.quantity == quantity));
}

@JsonKey(includeFromJson: false, includeToJson: false)
@override
int get hashCode => Object.hash(runtimeType,name,section,quantity);

@override
String toString() {
  return 'CardEntry(name: $name, section: $section, quantity: $quantity)';
}


}

/// @nodoc
abstract mixin class $CardEntryCopyWith<$Res>  {
  factory $CardEntryCopyWith(CardEntry value, $Res Function(CardEntry) _then) = _$CardEntryCopyWithImpl;
@useResult
$Res call({
 String name, String section, int quantity
});




}
/// @nodoc
class _$CardEntryCopyWithImpl<$Res>
    implements $CardEntryCopyWith<$Res> {
  _$CardEntryCopyWithImpl(this._self, this._then);

  final CardEntry _self;
  final $Res Function(CardEntry) _then;

/// Create a copy of CardEntry
/// with the given fields replaced by the non-null parameter values.
@pragma('vm:prefer-inline') @override $Res call({Object? name = null,Object? section = null,Object? quantity = null,}) {
  return _then(_self.copyWith(
name: null == name ? _self.name : name // ignore: cast_nullable_to_non_nullable
as String,section: null == section ? _self.section : section // ignore: cast_nullable_to_non_nullable
as String,quantity: null == quantity ? _self.quantity : quantity // ignore: cast_nullable_to_non_nullable
as int,
  ));
}

}


/// Adds pattern-matching-related methods to [CardEntry].
extension CardEntryPatterns on CardEntry {
/// A variant of `map` that fallback to returning `orElse`.
///
/// It is equivalent to doing:
/// ```dart
/// switch (sealedClass) {
///   case final Subclass value:
///     return ...;
///   case _:
///     return orElse();
/// }
/// ```

@optionalTypeArgs TResult maybeMap<TResult extends Object?>(TResult Function( _CardEntry value)?  $default,{required TResult orElse(),}){
final _that = this;
switch (_that) {
case _CardEntry() when $default != null:
return $default(_that);case _:
  return orElse();

}
}
/// A `switch`-like method, using callbacks.
///
/// Callbacks receives the raw object, upcasted.
/// It is equivalent to doing:
/// ```dart
/// switch (sealedClass) {
///   case final Subclass value:
///     return ...;
///   case final Subclass2 value:
///     return ...;
/// }
/// ```

@optionalTypeArgs TResult map<TResult extends Object?>(TResult Function( _CardEntry value)  $default,){
final _that = this;
switch (_that) {
case _CardEntry():
return $default(_that);case _:
  throw StateError('Unexpected subclass');

}
}
/// A variant of `map` that fallback to returning `null`.
///
/// It is equivalent to doing:
/// ```dart
/// switch (sealedClass) {
///   case final Subclass value:
///     return ...;
///   case _:
///     return null;
/// }
/// ```

@optionalTypeArgs TResult? mapOrNull<TResult extends Object?>(TResult? Function( _CardEntry value)?  $default,){
final _that = this;
switch (_that) {
case _CardEntry() when $default != null:
return $default(_that);case _:
  return null;

}
}
/// A variant of `when` that fallback to an `orElse` callback.
///
/// It is equivalent to doing:
/// ```dart
/// switch (sealedClass) {
///   case Subclass(:final field):
///     return ...;
///   case _:
///     return orElse();
/// }
/// ```

@optionalTypeArgs TResult maybeWhen<TResult extends Object?>(TResult Function( String name,  String section,  int quantity)?  $default,{required TResult orElse(),}) {final _that = this;
switch (_that) {
case _CardEntry() when $default != null:
return $default(_that.name,_that.section,_that.quantity);case _:
  return orElse();

}
}
/// A `switch`-like method, using callbacks.
///
/// As opposed to `map`, this offers destructuring.
/// It is equivalent to doing:
/// ```dart
/// switch (sealedClass) {
///   case Subclass(:final field):
///     return ...;
///   case Subclass2(:final field2):
///     return ...;
/// }
/// ```

@optionalTypeArgs TResult when<TResult extends Object?>(TResult Function( String name,  String section,  int quantity)  $default,) {final _that = this;
switch (_that) {
case _CardEntry():
return $default(_that.name,_that.section,_that.quantity);case _:
  throw StateError('Unexpected subclass');

}
}
/// A variant of `when` that fallback to returning `null`
///
/// It is equivalent to doing:
/// ```dart
/// switch (sealedClass) {
///   case Subclass(:final field):
///     return ...;
///   case _:
///     return null;
/// }
/// ```

@optionalTypeArgs TResult? whenOrNull<TResult extends Object?>(TResult? Function( String name,  String section,  int quantity)?  $default,) {final _that = this;
switch (_that) {
case _CardEntry() when $default != null:
return $default(_that.name,_that.section,_that.quantity);case _:
  return null;

}
}

}

/// @nodoc
@JsonSerializable()

class _CardEntry implements CardEntry {
  const _CardEntry({required this.name, required this.section, required this.quantity});
  factory _CardEntry.fromJson(Map<String, dynamic> json) => _$CardEntryFromJson(json);

@override final  String name;
@override final  String section;
@override final  int quantity;

/// Create a copy of CardEntry
/// with the given fields replaced by the non-null parameter values.
@override @JsonKey(includeFromJson: false, includeToJson: false)
@pragma('vm:prefer-inline')
_$CardEntryCopyWith<_CardEntry> get copyWith => __$CardEntryCopyWithImpl<_CardEntry>(this, _$identity);

@override
Map<String, dynamic> toJson() {
  return _$CardEntryToJson(this, );
}

@override
bool operator ==(Object other) {
  return identical(this, other) || (other.runtimeType == runtimeType&&other is _CardEntry&&(identical(other.name, name) || other.name == name)&&(identical(other.section, section) || other.section == section)&&(identical(other.quantity, quantity) || other.quantity == quantity));
}

@JsonKey(includeFromJson: false, includeToJson: false)
@override
int get hashCode => Object.hash(runtimeType,name,section,quantity);

@override
String toString() {
  return 'CardEntry(name: $name, section: $section, quantity: $quantity)';
}


}

/// @nodoc
abstract mixin class _$CardEntryCopyWith<$Res> implements $CardEntryCopyWith<$Res> {
  factory _$CardEntryCopyWith(_CardEntry value, $Res Function(_CardEntry) _then) = __$CardEntryCopyWithImpl;
@override @useResult
$Res call({
 String name, String section, int quantity
});




}
/// @nodoc
class __$CardEntryCopyWithImpl<$Res>
    implements _$CardEntryCopyWith<$Res> {
  __$CardEntryCopyWithImpl(this._self, this._then);

  final _CardEntry _self;
  final $Res Function(_CardEntry) _then;

/// Create a copy of CardEntry
/// with the given fields replaced by the non-null parameter values.
@override @pragma('vm:prefer-inline') $Res call({Object? name = null,Object? section = null,Object? quantity = null,}) {
  return _then(_CardEntry(
name: null == name ? _self.name : name // ignore: cast_nullable_to_non_nullable
as String,section: null == section ? _self.section : section // ignore: cast_nullable_to_non_nullable
as String,quantity: null == quantity ? _self.quantity : quantity // ignore: cast_nullable_to_non_nullable
as int,
  ));
}


}

// dart format on
