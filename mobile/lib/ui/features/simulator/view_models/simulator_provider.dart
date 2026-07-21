import 'dart:math';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../../../domain/models/deck_detail.dart';
import '../../../../domain/models/simulator_card_instance.dart';
import '../../../../domain/models/simulation_session.dart';

/// State representation of the Standalone Simulator workspace.
class SimulatorState {
  final DeckDetail? selectedDeck;
  final SimulationSession? session;
  final SimulatorCardInstance? inspectedCard;
  final bool isExplorerOpen;

  const SimulatorState({
    this.selectedDeck,
    this.session,
    this.inspectedCard,
    required this.isExplorerOpen,
  });

  /// Getter delegators mapping to simulation session to avoid breaking view layer.
  List<SimulatorCardInstance> get mainDeck => session?.mainDeck ?? const [];
  List<SimulatorCardInstance> get hand => session?.hand ?? const [];
  List<SimulatorCardInstance> get field => session?.field ?? const [];
  List<SimulatorCardInstance> get graveyard => session?.graveyard ?? const [];
  List<SimulatorCardInstance> get banished => session?.banished ?? const [];
  int get drawSize => session?.drawSize ?? 5;
  String? get targetCardName => session?.targetCardName;
  double get drawProbability => session?.drawProbability ?? 0.0;

  SimulatorState copyWith({
    DeckDetail? selectedDeck,
    SimulationSession? session,
    SimulatorCardInstance? inspectedCard,
    bool? isExplorerOpen,
  }) {
    return SimulatorState(
      selectedDeck: selectedDeck ?? this.selectedDeck,
      session: session ?? this.session,
      inspectedCard: inspectedCard ?? this.inspectedCard,
      isExplorerOpen: isExplorerOpen ?? this.isExplorerOpen,
    );
  }
}

/// State notifier managing simulator actions and hypergeometric probability calculations.
class SimulatorNotifier extends Notifier<SimulatorState> {
  final Random _random = Random();

  @override
  SimulatorState build() {
    return const SimulatorState(
      selectedDeck: null,
      session: null,
      inspectedCard: null,
      isExplorerOpen: false,
    );
  }

  /// Loads a deck structure and resets game zones.
  void loadDeck(DeckDetail deck) {
    state = SimulatorState(
      selectedDeck: deck,
      session: SimulationSession.initial(
        deck.deckCards,
        drawSize: state.drawSize,
      ),
      inspectedCard: null,
      isExplorerOpen: false,
    );
  }

  /// Shuffles the active Main Deck list.
  void shuffle() {
    if (state.session == null) return;
    state = state.copyWith(session: state.session!.shuffle(_random));
  }

  /// Sets the starting hand draw size constraint (5 or 6).
  void setDrawSize(int size) {
    if (state.session == null) return;
    state = state.copyWith(session: state.session!.setDrawSize(size));
  }

  /// Draws cards from the deck top and places them in hand.
  void drawCards(int count) {
    if (state.session == null) return;
    state = state.copyWith(session: state.session!.drawCards(count));
  }

  /// Resets workspace, return all cards to main deck, and shuffles.
  void resetWorkspace() {
    if (state.selectedDeck == null) return;
    loadDeck(state.selectedDeck!);
  }

  /// Updates inspector display selection.
  void setInspectedCard(SimulatorCardInstance? card) {
    state = state.copyWith(inspectedCard: card);
  }

  /// Toggles Deck Explorer popup visibility.
  void setExplorerOpen(bool open) {
    state = state.copyWith(isExplorerOpen: open);
  }

  /// Transfers card instance between zones.
  void moveCard(SimulatorCardInstance card, String fromZone, String toZone) {
    if (state.session == null) return;
    state = state.copyWith(
      session: state.session!.moveCard(card, fromZone, toZone),
    );
  }

  /// Triggers hypergeometric odds calculation for a specific card name.
  void selectTargetCardForOdds(String? cardName) {
    if (state.session == null) return;
    state = state.copyWith(session: state.session!.selectTargetCard(cardName));
  }
}

/// Provider exposing the standalone Simulator notifier.
final simulatorProvider = NotifierProvider<SimulatorNotifier, SimulatorState>(
  SimulatorNotifier.new,
);
