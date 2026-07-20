/// Routing definitions.
class AppRoutes {
  AppRoutes._();

  static const String home = '/';
  static const String cards = '/cards';
  static const String login = '/login';
  static const String register = '/register';

  static const String deckDetailPattern = '/decks/:id';
  static const String cardDetailPattern = '/cards/:id';

  static String deckDetail(int id) => '/decks/$id';
  static String cardDetail(int id) => '/cards/$id';
}
