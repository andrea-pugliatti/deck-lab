/// Routing definitions.
class AppRoutes {
  AppRoutes._();

  static const String home = '/';
  static const String cards = '/cards';
  static const String simulator = '/simulator';
  static const String login = '/login';
  static const String register = '/register';
  static const String deckCreate = '/decks/create';

  static const String deckDetailPattern = '/decks/:id';
  static const String deckEditPattern = '/decks/:id/edit';
  static const String cardDetailPattern = '/cards/:id';

  static String deckDetail(int id) => '/decks/$id';
  static String deckEdit(int id) => '/decks/$id/edit';
  static String cardDetail(int id) => '/cards/$id';
}
