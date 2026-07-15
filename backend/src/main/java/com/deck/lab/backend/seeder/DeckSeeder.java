package com.deck.lab.backend.seeder;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;

import com.deck.lab.backend.model.Card;
import com.deck.lab.backend.model.Deck;
import com.deck.lab.backend.model.DeckCard;
import com.deck.lab.backend.model.DeckSection;
import com.deck.lab.backend.model.Format;
import com.deck.lab.backend.model.User;
import com.deck.lab.backend.repository.CardRepository;
import com.deck.lab.backend.repository.DeckRepository;
import com.deck.lab.backend.repository.UserRepository;
import com.deck.lab.backend.service.generation.model.CardEntry;

/**
 * Seeder class responsible for populating the database with sample, competitive deck lists.
 *
 * <p>
 * <strong>Design Pattern: Demo Data Bootstrapper</strong>
 * </p>
 * <p>
 * To help users and developers test features right after starting the application, this component
 * bootstraps real, historically accurate Yu-Gi-Oh! deck lists (like Frog OTK, Frog Monarch, Diva
 * Hero, and Lightsworn). It locates database {@link Card} entities matching card names, maps them
 * to transient {@link DeckCard} instances, links them to seeded user profiles (e.g. "yugi" or
 * "admin"), and saves them through the {@link DeckRepository}.
 * </p>
 */
@Component
public class DeckSeeder {

    private static final Logger logger = LoggerFactory.getLogger(DatabaseSeeder.class);

    private final CardRepository cardRepository;
    private final UserRepository userRepository;
    private final DeckRepository deckRepository;

    public DeckSeeder(CardRepository cardRepository, UserRepository userRepository,
                      DeckRepository deckRepository) {
        this.cardRepository = cardRepository;
        this.userRepository = userRepository;
        this.deckRepository = deckRepository;
    }

    /**
     * Seeds historically accurate competitive deck blueprints for standard seeded users (e.g. yugi,
     * admin).
     */
    public void seedSampleDecks() {
        userRepository.findByUsername("yugi").ifPresent(yugi -> {
            deckRepository.findByUser(yugi).forEach(deckRepository::delete);
            seedFrogOtkDeck(yugi);
            seedFrogMonarchDeck(yugi);
            seedVayuTurboDeck(yugi);
            seedDivaHeroDeck(yugi);
        });

        userRepository.findByUsername("admin").ifPresent(admin -> {
            deckRepository.findByUser(admin).forEach(deckRepository::delete);
            seedLightswornDeck(admin);
            seedQuickdrawDandywarriorDeck(admin);
        });
    }

    private void seedFrogOtkDeck(User user) {
        List<CardEntry> cards = new ArrayList<>();
        cards.add(new CardEntry("Substitoad", "MAIN", 3));
        cards.add(new CardEntry("Swap Frog", "MAIN", 3));
        cards.add(new CardEntry("Dupe Frog", "MAIN", 3));
        cards.add(new CardEntry("Ronintoadin", "MAIN", 3));
        cards.add(new CardEntry("Poison Draw Frog", "MAIN", 3));
        cards.add(new CardEntry("Fishborg Blaster", "MAIN", 2));
        cards.add(new CardEntry("Treeborn Frog", "MAIN", 2));
        cards.add(new CardEntry("Mass Driver", "MAIN", 3));
        cards.add(new CardEntry("Moray of Greed", "MAIN", 3));
        cards.add(new CardEntry("Hand Destruction", "MAIN", 3));
        cards.add(new CardEntry("Salvage", "MAIN", 3));
        cards.add(new CardEntry("Magical Stone Excavation", "MAIN", 3));
        cards.add(new CardEntry("One for One", "MAIN", 1));
        cards.add(new CardEntry("Giant Trunade", "MAIN", 1));
        cards.add(new CardEntry("Brain Control", "MAIN", 1));
        cards.add(new CardEntry("Card Destruction", "MAIN", 1));
        cards.add(new CardEntry("Cold Wave", "MAIN", 1));
        cards.add(new CardEntry("Foolish Burial", "MAIN", 1));
        cards.add(new CardEntry("Heavy Storm", "MAIN", 1));
        // Extra
        cards.add(new CardEntry("Tempest Magician", "EXTRA", 3));
        cards.add(new CardEntry("Brionac, Dragon of the Ice Barrier", "EXTRA", 2));
        cards.add(new CardEntry("Goyo Guardian", "EXTRA", 1));
        cards.add(new CardEntry("Mist Wurm", "EXTRA", 1));
        cards.add(new CardEntry("Ally of Justice Catastor", "EXTRA", 2));
        cards.add(new CardEntry("Magical Android", "EXTRA", 2));
        cards.add(new CardEntry("Stardust Dragon", "EXTRA", 2));
        cards.add(new CardEntry("Black Rose Dragon", "EXTRA", 2));
        seedDeck("Frog OTK",
                "Historical OTK using Substitoad and Mass Driver.",
                "Edison",
                user,
                cards);
    }

    private void seedFrogMonarchDeck(User user) {
        List<CardEntry> cards = new ArrayList<>();
        cards.add(new CardEntry("Caius the Shadow Monarch", "MAIN", 3));
        cards.add(new CardEntry("Raiza the Storm Monarch", "MAIN", 3));
        cards.add(new CardEntry("Mobius the Frost Monarch", "MAIN", 1));
        cards.add(new CardEntry("Thestalos the Firestorm Monarch", "MAIN", 1));
        cards.add(new CardEntry("Gorz the Emissary of Darkness", "MAIN", 1));
        cards.add(new CardEntry("Treeborn Frog", "MAIN", 2));
        cards.add(new CardEntry("Swap Frog", "MAIN", 3));
        cards.add(new CardEntry("Dupe Frog", "MAIN", 2));
        cards.add(new CardEntry("Ronintoadin", "MAIN", 1));
        cards.add(new CardEntry("Ryko, Lightsworn Hunter", "MAIN", 3));
        cards.add(new CardEntry("Battle Fader", "MAIN", 3));
        cards.add(new CardEntry("Plaguespreader Zombie", "MAIN", 1));
        cards.add(new CardEntry("Chaos Sorcerer", "MAIN", 1));
        cards.add(new CardEntry("Soul Exchange", "MAIN", 3));
        cards.add(new CardEntry("Enemy Controller", "MAIN", 3));
        cards.add(new CardEntry("Pot of Avarice", "MAIN", 2));
        cards.add(new CardEntry("Brain Control", "MAIN", 1));
        cards.add(new CardEntry("Heavy Storm", "MAIN", 1));
        cards.add(new CardEntry("Mystical Space Typhoon", "MAIN", 2));
        cards.add(new CardEntry("Foolish Burial", "MAIN", 1));
        cards.add(new CardEntry("One for One", "MAIN", 1));
        cards.add(new CardEntry("Allure of Darkness", "MAIN", 1));
        // Extra
        cards.add(new CardEntry("Goyo Guardian", "EXTRA", 1));
        cards.add(new CardEntry("Brionac, Dragon of the Ice Barrier", "EXTRA", 1));
        cards.add(new CardEntry("Stardust Dragon", "EXTRA", 2));
        cards.add(new CardEntry("Black Rose Dragon", "EXTRA", 2));
        cards.add(new CardEntry("Ally of Justice Catastor", "EXTRA", 2));
        cards.add(new CardEntry("Magical Android", "EXTRA", 2));
        cards.add(new CardEntry("Colossal Fighter", "EXTRA", 2));
        cards.add(new CardEntry("Mist Wurm", "EXTRA", 1));
        cards.add(new CardEntry("Gaia Knight, the Force of Earth", "EXTRA", 2));
        seedDeck("Frog Monarch",
                "Classic tribute deck abusing Treeborn Frog.",
                "Edison",
                user,
                cards);
    }

    private void seedVayuTurboDeck(User user) {
        List<CardEntry> cards = new ArrayList<>();
        cards.add(new CardEntry("Blackwing - Vayu the Emblem of Honor", "MAIN", 3));
        cards.add(new CardEntry("Blackwing - Sirocco the Dawn", "MAIN", 3));
        cards.add(new CardEntry("Blackwing - Gale the Whirlwind", "MAIN", 1));
        cards.add(new CardEntry("Blackwing - Elphin the Raven", "MAIN", 1));
        cards.add(new CardEntry("Ryko, Lightsworn Hunter", "MAIN", 3));
        cards.add(new CardEntry("Lyla, Lightsworn Sorceress", "MAIN", 2));
        cards.add(new CardEntry("Armageddon Knight", "MAIN", 2));
        cards.add(new CardEntry("Plaguespreader Zombie", "MAIN", 1));
        cards.add(new CardEntry("Dark Armed Dragon", "MAIN", 1));
        cards.add(new CardEntry("Gorz the Emissary of Darkness", "MAIN", 1));
        cards.add(new CardEntry("Chaos Sorcerer", "MAIN", 1));
        cards.add(new CardEntry("Blackwing - Bora the Spear", "MAIN", 1));
        cards.add(new CardEntry("Charge of the Light Brigade", "MAIN", 1));
        cards.add(new CardEntry("Solar Recharge", "MAIN", 2));
        cards.add(new CardEntry("Book of Moon", "MAIN", 3));
        cards.add(new CardEntry("Allure of Darkness", "MAIN", 1));
        cards.add(new CardEntry("Foolish Burial", "MAIN", 1));
        cards.add(new CardEntry("Burial from a Different Dimension", "MAIN", 1));
        cards.add(new CardEntry("Heavy Storm", "MAIN", 1));
        cards.add(new CardEntry("Mystical Space Typhoon", "MAIN", 1));
        cards.add(new CardEntry("Brain Control", "MAIN", 1));
        cards.add(new CardEntry("Icarus Attack", "MAIN", 3));
        cards.add(new CardEntry("Bottomless Trap Hole", "MAIN", 2));
        cards.add(new CardEntry("Torrential Tribute", "MAIN", 1));
        cards.add(new CardEntry("Solemn Judgment", "MAIN", 1));
        cards.add(new CardEntry("Threatening Roar", "MAIN", 1));
        // Extra
        cards.add(new CardEntry("Blackwing Armed Wing", "EXTRA", 3));
        cards.add(new CardEntry("Blackwing Armor Master", "EXTRA", 2));
        cards.add(new CardEntry("Blackwing - Silverwind the Ascendant", "EXTRA", 1));
        cards.add(new CardEntry("Goyo Guardian", "EXTRA", 1));
        cards.add(new CardEntry("Brionac, Dragon of the Ice Barrier", "EXTRA", 1));
        cards.add(new CardEntry("Stardust Dragon", "EXTRA", 2));
        cards.add(new CardEntry("Black Rose Dragon", "EXTRA", 2));
        cards.add(new CardEntry("Ally of Justice Catastor", "EXTRA", 1));
        cards.add(new CardEntry("Colossal Fighter", "EXTRA", 1));
        cards.add(new CardEntry("Mist Wurm", "EXTRA", 1));
        seedDeck("Vayu Turbo", "Synchro summon from Graveyard using Vayu.", "Edison", user, cards);
    }

    private void seedDivaHeroDeck(User user) {
        List<CardEntry> cards = new ArrayList<>();
        cards.add(new CardEntry("Deep Sea Diva", "MAIN", 3));
        cards.add(new CardEntry("Spined Gillman", "MAIN", 2));
        cards.add(new CardEntry("Elemental HERO Stratos", "MAIN", 1));
        cards.add(new CardEntry("Destiny HERO - Malicious", "MAIN", 2));
        cards.add(new CardEntry("Destiny HERO - Diamond Dude", "MAIN", 2));
        cards.add(new CardEntry("Destiny HERO - Doom Lord", "MAIN", 1));
        cards.add(new CardEntry("Plaguespreader Zombie", "MAIN", 1));
        cards.add(new CardEntry("Dark Armed Dragon", "MAIN", 1));
        cards.add(new CardEntry("Gorz the Emissary of Darkness", "MAIN", 1));
        cards.add(new CardEntry("Chaos Sorcerer", "MAIN", 1));
        cards.add(new CardEntry("Ryko, Lightsworn Hunter", "MAIN", 3));
        cards.add(new CardEntry("Lyla, Lightsworn Sorceress", "MAIN", 2));
        cards.add(new CardEntry("Miracle Fusion", "MAIN", 3));
        cards.add(new CardEntry("E - Emergency Call", "MAIN", 1));
        cards.add(new CardEntry("Reinforcement of the Army", "MAIN", 1));
        cards.add(new CardEntry("Destiny Draw", "MAIN", 1));
        cards.add(new CardEntry("Allure of Darkness", "MAIN", 1));
        cards.add(new CardEntry("Foolish Burial", "MAIN", 1));
        cards.add(new CardEntry("Charge of the Light Brigade", "MAIN", 1));
        cards.add(new CardEntry("Solar Recharge", "MAIN", 2));
        cards.add(new CardEntry("Pot of Avarice", "MAIN", 2));
        cards.add(new CardEntry("Book of Moon", "MAIN", 3));
        cards.add(new CardEntry("Brain Control", "MAIN", 1));
        cards.add(new CardEntry("Heavy Storm", "MAIN", 1));
        cards.add(new CardEntry("Mystical Space Typhoon", "MAIN", 1));
        cards.add(new CardEntry("Torrential Tribute", "MAIN", 1));
        cards.add(new CardEntry("Solemn Judgment", "MAIN", 1));
        // Extra
        cards.add(new CardEntry("Elemental HERO Absolute Zero", "EXTRA", 3));
        cards.add(new CardEntry("Goyo Guardian", "EXTRA", 1));
        cards.add(new CardEntry("Brionac, Dragon of the Ice Barrier", "EXTRA", 1));
        cards.add(new CardEntry("Stardust Dragon", "EXTRA", 2));
        cards.add(new CardEntry("Black Rose Dragon", "EXTRA", 2));
        cards.add(new CardEntry("Ally of Justice Catastor", "EXTRA", 2));
        cards.add(new CardEntry("Colossal Fighter", "EXTRA", 2));
        cards.add(new CardEntry("Tempest Magician", "EXTRA", 1));
        cards.add(new CardEntry("Mist Wurm", "EXTRA", 1));
        seedDeck("Diva Hero",
                "HERO deck leveraging Deep Sea Diva for Synchros and Fusions.",
                "Edison",
                user,
                cards);
    }

    private void seedLightswornDeck(User user) {
        List<CardEntry> cards = new ArrayList<>();
        cards.add(new CardEntry("Judgment Dragon", "MAIN", 2));
        cards.add(new CardEntry("Lumina, Lightsworn Summoner", "MAIN", 3));
        cards.add(new CardEntry("Garoth, Lightsworn Warrior", "MAIN", 2));
        cards.add(new CardEntry("Wulf, Lightsworn Beast", "MAIN", 2));
        cards.add(new CardEntry("Celestia, Lightsworn Angel", "MAIN", 2));
        cards.add(new CardEntry("Lyla, Lightsworn Sorceress", "MAIN", 3));
        cards.add(new CardEntry("Ryko, Lightsworn Hunter", "MAIN", 3));
        cards.add(new CardEntry("Ehren, Lightsworn Monk", "MAIN", 1));
        cards.add(new CardEntry("Honest", "MAIN", 2));
        cards.add(new CardEntry("Necro Gardna", "MAIN", 2));
        cards.add(new CardEntry("Plaguespreader Zombie", "MAIN", 1));
        cards.add(new CardEntry("Chaos Sorcerer", "MAIN", 1));
        cards.add(new CardEntry("Charge of the Light Brigade", "MAIN", 1));
        cards.add(new CardEntry("Solar Recharge", "MAIN", 3));
        cards.add(new CardEntry("Monster Reincarnation", "MAIN", 2));
        cards.add(new CardEntry("Beckoning Light", "MAIN", 2));
        cards.add(new CardEntry("Heavy Storm", "MAIN", 1));
        cards.add(new CardEntry("Mystical Space Typhoon", "MAIN", 1));
        cards.add(new CardEntry("Brain Control", "MAIN", 1));
        cards.add(new CardEntry("Torrential Tribute", "MAIN", 1));
        // Extra
        cards.add(new CardEntry("Goyo Guardian", "EXTRA", 1));
        cards.add(new CardEntry("Brionac, Dragon of the Ice Barrier", "EXTRA", 1));
        cards.add(new CardEntry("Stardust Dragon", "EXTRA", 2));
        cards.add(new CardEntry("Black Rose Dragon", "EXTRA", 2));
        cards.add(new CardEntry("Ally of Justice Catastor", "EXTRA", 2));
        cards.add(new CardEntry("Colossal Fighter", "EXTRA", 2));
        seedDeck("Lightsworn",
                "Milling strategy using Lightsworn monsters to summon Judgment Dragon.",
                "Edison",
                user,
                cards);
    }

    private void seedQuickdrawDandywarriorDeck(User user) {
        List<CardEntry> cards = new ArrayList<>();
        cards.add(new CardEntry("Quickdraw Synchron", "MAIN", 3));
        cards.add(new CardEntry("Dandylion", "MAIN", 2));
        cards.add(new CardEntry("Ryko, Lightsworn Hunter", "MAIN", 3));
        cards.add(new CardEntry("Super-Nimble Mega Hamster", "MAIN", 2));
        cards.add(new CardEntry("Debris Dragon", "MAIN", 2));
        cards.add(new CardEntry("Spore", "MAIN", 1));
        cards.add(new CardEntry("Lonefire Blossom", "MAIN", 2));
        cards.add(new CardEntry("Caius the Shadow Monarch", "MAIN", 3));
        cards.add(new CardEntry("Sangan", "MAIN", 1));
        cards.add(new CardEntry("Card Trooper", "MAIN", 1));
        cards.add(new CardEntry("Tytannial, Princess of Camellias", "MAIN", 1));
        cards.add(new CardEntry("Pot of Avarice", "MAIN", 3));
        cards.add(new CardEntry("Book of Moon", "MAIN", 3));
        cards.add(new CardEntry("Charge of the Light Brigade", "MAIN", 1));
        cards.add(new CardEntry("Foolish Burial", "MAIN", 1));
        cards.add(new CardEntry("One for One", "MAIN", 1));
        cards.add(new CardEntry("Heavy Storm", "MAIN", 1));
        cards.add(new CardEntry("Mystical Space Typhoon", "MAIN", 1));
        cards.add(new CardEntry("Brain Control", "MAIN", 1));
        cards.add(new CardEntry("Bottomless Trap Hole", "MAIN", 2));
        cards.add(new CardEntry("Torrential Tribute", "MAIN", 1));
        cards.add(new CardEntry("Solemn Judgment", "MAIN", 1));
        // Extra
        cards.add(new CardEntry("Drill Warrior", "EXTRA", 3));
        cards.add(new CardEntry("Junk Destroyer", "EXTRA", 2));
        cards.add(new CardEntry("Stardust Dragon", "EXTRA", 2));
        cards.add(new CardEntry("Black Rose Dragon", "EXTRA", 2));
        cards.add(new CardEntry("Goyo Guardian", "EXTRA", 1));
        cards.add(new CardEntry("Brionac, Dragon of the Ice Barrier", "EXTRA", 1));
        cards.add(new CardEntry("Ally of Justice Catastor", "EXTRA", 2));
        cards.add(new CardEntry("Colossal Fighter", "EXTRA", 2));
        seedDeck("Quickdraw Dandywarrior",
                "Synchro deck utilizing Dandylion tokens and Quickdraw Synchron.",
                "Edison",
                user,
                cards);
    }

    private void seedDeck(String name,
                          String description,
                          String formatName,
                          User user,
                          List<CardEntry> cardInfos) {
        deckRepository.findByUser(user)
                .stream()
                .filter(d -> d.getName().equalsIgnoreCase(name))
                .forEach(d -> deckRepository.delete(d));

        Format formatEnum = Format.fromString(formatName);
        Deck deck = new Deck(name, description, formatEnum, user);
        List<DeckCard> deckCards = new ArrayList<>();
        for (CardEntry info : cardInfos) {
            Optional<Card> cardOpt = cardRepository.findByName(info.getName());
            if (cardOpt.isPresent()) {
                DeckSection sectionEnum = DeckSection.fromString(info.getSection());
                deckCards.add(new DeckCard(deck, cardOpt.get(), sectionEnum, info.getQuantity()));
            } else {
                logger.warn("Card '{}' not found in database. Skipping for deck '{}'.",
                        info.getName(),
                        name);
            }
        }
        deck.setDeckCards(deckCards);
        deckRepository.save(deck);
    }
}
