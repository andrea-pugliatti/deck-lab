package com.deck.lab.backend.seeder;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;

import com.deck.lab.backend.dto.CardEntryDto;
import com.deck.lab.backend.model.Card;
import com.deck.lab.backend.model.Deck;
import com.deck.lab.backend.model.DeckCard;
import com.deck.lab.backend.model.DeckSection;
import com.deck.lab.backend.model.Format;
import com.deck.lab.backend.model.User;
import com.deck.lab.backend.repository.CardRepository;
import com.deck.lab.backend.repository.DeckRepository;
import com.deck.lab.backend.repository.UserRepository;

/**
 * Seeder class responsible for populating the database with sample, competitive
 * deck lists.
 *
 * <p>
 * <strong>Design Pattern: Demo Data Bootstrapper</strong>
 * </p>
 * <p>
 * To help users and developers test features right after starting the
 * application, this component bootstraps real, historically accurate Yu-Gi-Oh!
 * deck lists (like Frog OTK, Frog Monarch, Diva Hero, and Lightsworn). It
 * locates database {@link Card} entities matching card names, maps them to
 * transient {@link DeckCard} instances, links them to seeded user profiles
 * (e.g. "yugi" or "admin"), and saves them through the {@link DeckRepository}.
 * </p>
 */
@Component
public class DeckSeeder {

    private static final Logger logger = LoggerFactory.getLogger(DatabaseSeeder.class);

    private final CardRepository cardRepository;
    private final UserRepository userRepository;
    private final DeckRepository deckRepository;

    public DeckSeeder(CardRepository cardRepository,
            UserRepository userRepository,
            DeckRepository deckRepository) {
        this.cardRepository = cardRepository;
        this.userRepository = userRepository;
        this.deckRepository = deckRepository;
    }

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
        List<CardEntryDto> cards = new ArrayList<>();
        cards.add(new CardEntryDto("Substitoad", "MAIN", 3));
        cards.add(new CardEntryDto("Swap Frog", "MAIN", 3));
        cards.add(new CardEntryDto("Dupe Frog", "MAIN", 3));
        cards.add(new CardEntryDto("Ronintoadin", "MAIN", 3));
        cards.add(new CardEntryDto("Poison Draw Frog", "MAIN", 3));
        cards.add(new CardEntryDto("Fishborg Blaster", "MAIN", 2));
        cards.add(new CardEntryDto("Treeborn Frog", "MAIN", 2));
        cards.add(new CardEntryDto("Mass Driver", "MAIN", 3));
        cards.add(new CardEntryDto("Moray of Greed", "MAIN", 3));
        cards.add(new CardEntryDto("Hand Destruction", "MAIN", 3));
        cards.add(new CardEntryDto("Salvage", "MAIN", 3));
        cards.add(new CardEntryDto("Magical Stone Excavation", "MAIN", 3));
        cards.add(new CardEntryDto("One for One", "MAIN", 1));
        cards.add(new CardEntryDto("Giant Trunade", "MAIN", 1));
        cards.add(new CardEntryDto("Brain Control", "MAIN", 1));
        cards.add(new CardEntryDto("Card Destruction", "MAIN", 1));
        cards.add(new CardEntryDto("Cold Wave", "MAIN", 1));
        cards.add(new CardEntryDto("Foolish Burial", "MAIN", 1));
        cards.add(new CardEntryDto("Heavy Storm", "MAIN", 1));
        // Extra
        cards.add(new CardEntryDto("Tempest Magician", "EXTRA", 3));
        cards.add(new CardEntryDto("Brionac, Dragon of the Ice Barrier", "EXTRA", 2));
        cards.add(new CardEntryDto("Goyo Guardian", "EXTRA", 1));
        cards.add(new CardEntryDto("Mist Wurm", "EXTRA", 1));
        cards.add(new CardEntryDto("Ally of Justice Catastor", "EXTRA", 2));
        cards.add(new CardEntryDto("Magical Android", "EXTRA", 2));
        cards.add(new CardEntryDto("Stardust Dragon", "EXTRA", 2));
        cards.add(new CardEntryDto("Black Rose Dragon", "EXTRA", 2));
        seedDeck("Frog OTK", "Historical OTK using Substitoad and Mass Driver.", "Edison", user, cards);
    }

    private void seedFrogMonarchDeck(User user) {
        List<CardEntryDto> cards = new ArrayList<>();
        cards.add(new CardEntryDto("Caius the Shadow Monarch", "MAIN", 3));
        cards.add(new CardEntryDto("Raiza the Storm Monarch", "MAIN", 3));
        cards.add(new CardEntryDto("Mobius the Frost Monarch", "MAIN", 1));
        cards.add(new CardEntryDto("Thestalos the Firestorm Monarch", "MAIN", 1));
        cards.add(new CardEntryDto("Gorz the Emissary of Darkness", "MAIN", 1));
        cards.add(new CardEntryDto("Treeborn Frog", "MAIN", 2));
        cards.add(new CardEntryDto("Swap Frog", "MAIN", 3));
        cards.add(new CardEntryDto("Dupe Frog", "MAIN", 2));
        cards.add(new CardEntryDto("Ronintoadin", "MAIN", 1));
        cards.add(new CardEntryDto("Ryko, Lightsworn Hunter", "MAIN", 3));
        cards.add(new CardEntryDto("Battle Fader", "MAIN", 3));
        cards.add(new CardEntryDto("Plaguespreader Zombie", "MAIN", 1));
        cards.add(new CardEntryDto("Chaos Sorcerer", "MAIN", 1));
        cards.add(new CardEntryDto("Soul Exchange", "MAIN", 3));
        cards.add(new CardEntryDto("Enemy Controller", "MAIN", 3));
        cards.add(new CardEntryDto("Pot of Avarice", "MAIN", 2));
        cards.add(new CardEntryDto("Brain Control", "MAIN", 1));
        cards.add(new CardEntryDto("Heavy Storm", "MAIN", 1));
        cards.add(new CardEntryDto("Mystical Space Typhoon", "MAIN", 2));
        cards.add(new CardEntryDto("Foolish Burial", "MAIN", 1));
        cards.add(new CardEntryDto("One for One", "MAIN", 1));
        cards.add(new CardEntryDto("Allure of Darkness", "MAIN", 1));
        // Extra
        cards.add(new CardEntryDto("Goyo Guardian", "EXTRA", 1));
        cards.add(new CardEntryDto("Brionac, Dragon of the Ice Barrier", "EXTRA", 1));
        cards.add(new CardEntryDto("Stardust Dragon", "EXTRA", 2));
        cards.add(new CardEntryDto("Black Rose Dragon", "EXTRA", 2));
        cards.add(new CardEntryDto("Ally of Justice Catastor", "EXTRA", 2));
        cards.add(new CardEntryDto("Magical Android", "EXTRA", 2));
        cards.add(new CardEntryDto("Colossal Fighter", "EXTRA", 2));
        cards.add(new CardEntryDto("Mist Wurm", "EXTRA", 1));
        cards.add(new CardEntryDto("Gaia Knight, the Force of Earth", "EXTRA", 2));
        seedDeck("Frog Monarch", "Classic tribute deck abusing Treeborn Frog.", "Edison", user, cards);
    }

    private void seedVayuTurboDeck(User user) {
        List<CardEntryDto> cards = new ArrayList<>();
        cards.add(new CardEntryDto("Blackwing - Vayu the Emblem of Honor", "MAIN", 3));
        cards.add(new CardEntryDto("Blackwing - Sirocco the Dawn", "MAIN", 3));
        cards.add(new CardEntryDto("Blackwing - Gale the Whirlwind", "MAIN", 1));
        cards.add(new CardEntryDto("Blackwing - Elphin the Raven", "MAIN", 1));
        cards.add(new CardEntryDto("Ryko, Lightsworn Hunter", "MAIN", 3));
        cards.add(new CardEntryDto("Lyla, Lightsworn Sorceress", "MAIN", 2));
        cards.add(new CardEntryDto("Armageddon Knight", "MAIN", 2));
        cards.add(new CardEntryDto("Plaguespreader Zombie", "MAIN", 1));
        cards.add(new CardEntryDto("Dark Armed Dragon", "MAIN", 1));
        cards.add(new CardEntryDto("Gorz the Emissary of Darkness", "MAIN", 1));
        cards.add(new CardEntryDto("Chaos Sorcerer", "MAIN", 1));
        cards.add(new CardEntryDto("Blackwing - Bora the Spear", "MAIN", 1));
        cards.add(new CardEntryDto("Charge of the Light Brigade", "MAIN", 1));
        cards.add(new CardEntryDto("Solar Recharge", "MAIN", 2));
        cards.add(new CardEntryDto("Book of Moon", "MAIN", 3));
        cards.add(new CardEntryDto("Allure of Darkness", "MAIN", 1));
        cards.add(new CardEntryDto("Foolish Burial", "MAIN", 1));
        cards.add(new CardEntryDto("Burial from a Different Dimension", "MAIN", 1));
        cards.add(new CardEntryDto("Heavy Storm", "MAIN", 1));
        cards.add(new CardEntryDto("Mystical Space Typhoon", "MAIN", 1));
        cards.add(new CardEntryDto("Brain Control", "MAIN", 1));
        cards.add(new CardEntryDto("Icarus Attack", "MAIN", 3));
        cards.add(new CardEntryDto("Bottomless Trap Hole", "MAIN", 2));
        cards.add(new CardEntryDto("Torrential Tribute", "MAIN", 1));
        cards.add(new CardEntryDto("Solemn Judgment", "MAIN", 1));
        cards.add(new CardEntryDto("Threatening Roar", "MAIN", 1));
        // Extra
        cards.add(new CardEntryDto("Blackwing Armed Wing", "EXTRA", 3));
        cards.add(new CardEntryDto("Blackwing Armor Master", "EXTRA", 2));
        cards.add(new CardEntryDto("Blackwing - Silverwind the Ascendant", "EXTRA", 1));
        cards.add(new CardEntryDto("Goyo Guardian", "EXTRA", 1));
        cards.add(new CardEntryDto("Brionac, Dragon of the Ice Barrier", "EXTRA", 1));
        cards.add(new CardEntryDto("Stardust Dragon", "EXTRA", 2));
        cards.add(new CardEntryDto("Black Rose Dragon", "EXTRA", 2));
        cards.add(new CardEntryDto("Ally of Justice Catastor", "EXTRA", 1));
        cards.add(new CardEntryDto("Colossal Fighter", "EXTRA", 1));
        cards.add(new CardEntryDto("Mist Wurm", "EXTRA", 1));
        seedDeck("Vayu Turbo", "Synchro summon from Graveyard using Vayu.", "Edison", user, cards);
    }

    private void seedDivaHeroDeck(User user) {
        List<CardEntryDto> cards = new ArrayList<>();
        cards.add(new CardEntryDto("Deep Sea Diva", "MAIN", 3));
        cards.add(new CardEntryDto("Spined Gillman", "MAIN", 2));
        cards.add(new CardEntryDto("Elemental HERO Stratos", "MAIN", 1));
        cards.add(new CardEntryDto("Destiny HERO - Malicious", "MAIN", 2));
        cards.add(new CardEntryDto("Destiny HERO - Diamond Dude", "MAIN", 2));
        cards.add(new CardEntryDto("Destiny HERO - Doom Lord", "MAIN", 1));
        cards.add(new CardEntryDto("Plaguespreader Zombie", "MAIN", 1));
        cards.add(new CardEntryDto("Dark Armed Dragon", "MAIN", 1));
        cards.add(new CardEntryDto("Gorz the Emissary of Darkness", "MAIN", 1));
        cards.add(new CardEntryDto("Chaos Sorcerer", "MAIN", 1));
        cards.add(new CardEntryDto("Ryko, Lightsworn Hunter", "MAIN", 3));
        cards.add(new CardEntryDto("Lyla, Lightsworn Sorceress", "MAIN", 2));
        cards.add(new CardEntryDto("Miracle Fusion", "MAIN", 3));
        cards.add(new CardEntryDto("E - Emergency Call", "MAIN", 1));
        cards.add(new CardEntryDto("Reinforcement of the Army", "MAIN", 1));
        cards.add(new CardEntryDto("Destiny Draw", "MAIN", 1));
        cards.add(new CardEntryDto("Allure of Darkness", "MAIN", 1));
        cards.add(new CardEntryDto("Foolish Burial", "MAIN", 1));
        cards.add(new CardEntryDto("Charge of the Light Brigade", "MAIN", 1));
        cards.add(new CardEntryDto("Solar Recharge", "MAIN", 2));
        cards.add(new CardEntryDto("Pot of Avarice", "MAIN", 2));
        cards.add(new CardEntryDto("Book of Moon", "MAIN", 3));
        cards.add(new CardEntryDto("Brain Control", "MAIN", 1));
        cards.add(new CardEntryDto("Heavy Storm", "MAIN", 1));
        cards.add(new CardEntryDto("Mystical Space Typhoon", "MAIN", 1));
        cards.add(new CardEntryDto("Torrential Tribute", "MAIN", 1));
        cards.add(new CardEntryDto("Solemn Judgment", "MAIN", 1));
        // Extra
        cards.add(new CardEntryDto("Elemental HERO Absolute Zero", "EXTRA", 3));
        cards.add(new CardEntryDto("Goyo Guardian", "EXTRA", 1));
        cards.add(new CardEntryDto("Brionac, Dragon of the Ice Barrier", "EXTRA", 1));
        cards.add(new CardEntryDto("Stardust Dragon", "EXTRA", 2));
        cards.add(new CardEntryDto("Black Rose Dragon", "EXTRA", 2));
        cards.add(new CardEntryDto("Ally of Justice Catastor", "EXTRA", 2));
        cards.add(new CardEntryDto("Colossal Fighter", "EXTRA", 2));
        cards.add(new CardEntryDto("Tempest Magician", "EXTRA", 1));
        cards.add(new CardEntryDto("Mist Wurm", "EXTRA", 1));
        seedDeck("Diva Hero", "HERO deck leveraging Deep Sea Diva for Synchros and Fusions.", "Edison", user, cards);
    }

    private void seedLightswornDeck(User user) {
        List<CardEntryDto> cards = new ArrayList<>();
        cards.add(new CardEntryDto("Judgment Dragon", "MAIN", 2));
        cards.add(new CardEntryDto("Lumina, Lightsworn Summoner", "MAIN", 3));
        cards.add(new CardEntryDto("Garoth, Lightsworn Warrior", "MAIN", 2));
        cards.add(new CardEntryDto("Wulf, Lightsworn Beast", "MAIN", 2));
        cards.add(new CardEntryDto("Celestia, Lightsworn Angel", "MAIN", 2));
        cards.add(new CardEntryDto("Lyla, Lightsworn Sorceress", "MAIN", 3));
        cards.add(new CardEntryDto("Ryko, Lightsworn Hunter", "MAIN", 3));
        cards.add(new CardEntryDto("Ehren, Lightsworn Monk", "MAIN", 1));
        cards.add(new CardEntryDto("Honest", "MAIN", 2));
        cards.add(new CardEntryDto("Necro Gardna", "MAIN", 2));
        cards.add(new CardEntryDto("Plaguespreader Zombie", "MAIN", 1));
        cards.add(new CardEntryDto("Chaos Sorcerer", "MAIN", 1));
        cards.add(new CardEntryDto("Charge of the Light Brigade", "MAIN", 1));
        cards.add(new CardEntryDto("Solar Recharge", "MAIN", 3));
        cards.add(new CardEntryDto("Monster Reincarnation", "MAIN", 2));
        cards.add(new CardEntryDto("Beckoning Light", "MAIN", 2));
        cards.add(new CardEntryDto("Heavy Storm", "MAIN", 1));
        cards.add(new CardEntryDto("Mystical Space Typhoon", "MAIN", 1));
        cards.add(new CardEntryDto("Brain Control", "MAIN", 1));
        cards.add(new CardEntryDto("Torrential Tribute", "MAIN", 1));
        // Extra
        cards.add(new CardEntryDto("Goyo Guardian", "EXTRA", 1));
        cards.add(new CardEntryDto("Brionac, Dragon of the Ice Barrier", "EXTRA", 1));
        cards.add(new CardEntryDto("Stardust Dragon", "EXTRA", 2));
        cards.add(new CardEntryDto("Black Rose Dragon", "EXTRA", 2));
        cards.add(new CardEntryDto("Ally of Justice Catastor", "EXTRA", 2));
        cards.add(new CardEntryDto("Colossal Fighter", "EXTRA", 2));
        seedDeck("Lightsworn", "Milling strategy using Lightsworn monsters to summon Judgment Dragon.", "Edison", user,
                cards);
    }

    private void seedQuickdrawDandywarriorDeck(User user) {
        List<CardEntryDto> cards = new ArrayList<>();
        cards.add(new CardEntryDto("Quickdraw Synchron", "MAIN", 3));
        cards.add(new CardEntryDto("Dandylion", "MAIN", 2));
        cards.add(new CardEntryDto("Ryko, Lightsworn Hunter", "MAIN", 3));
        cards.add(new CardEntryDto("Super-Nimble Mega Hamster", "MAIN", 2));
        cards.add(new CardEntryDto("Debris Dragon", "MAIN", 2));
        cards.add(new CardEntryDto("Spore", "MAIN", 1));
        cards.add(new CardEntryDto("Lonefire Blossom", "MAIN", 2));
        cards.add(new CardEntryDto("Caius the Shadow Monarch", "MAIN", 3));
        cards.add(new CardEntryDto("Sangan", "MAIN", 1));
        cards.add(new CardEntryDto("Card Trooper", "MAIN", 1));
        cards.add(new CardEntryDto("Tytannial, Princess of Camellias", "MAIN", 1));
        cards.add(new CardEntryDto("Pot of Avarice", "MAIN", 3));
        cards.add(new CardEntryDto("Book of Moon", "MAIN", 3));
        cards.add(new CardEntryDto("Charge of the Light Brigade", "MAIN", 1));
        cards.add(new CardEntryDto("Foolish Burial", "MAIN", 1));
        cards.add(new CardEntryDto("One for One", "MAIN", 1));
        cards.add(new CardEntryDto("Heavy Storm", "MAIN", 1));
        cards.add(new CardEntryDto("Mystical Space Typhoon", "MAIN", 1));
        cards.add(new CardEntryDto("Brain Control", "MAIN", 1));
        cards.add(new CardEntryDto("Bottomless Trap Hole", "MAIN", 2));
        cards.add(new CardEntryDto("Torrential Tribute", "MAIN", 1));
        cards.add(new CardEntryDto("Solemn Judgment", "MAIN", 1));
        // Extra
        cards.add(new CardEntryDto("Drill Warrior", "EXTRA", 3));
        cards.add(new CardEntryDto("Junk Destroyer", "EXTRA", 2));
        cards.add(new CardEntryDto("Stardust Dragon", "EXTRA", 2));
        cards.add(new CardEntryDto("Black Rose Dragon", "EXTRA", 2));
        cards.add(new CardEntryDto("Goyo Guardian", "EXTRA", 1));
        cards.add(new CardEntryDto("Brionac, Dragon of the Ice Barrier", "EXTRA", 1));
        cards.add(new CardEntryDto("Ally of Justice Catastor", "EXTRA", 2));
        cards.add(new CardEntryDto("Colossal Fighter", "EXTRA", 2));
        seedDeck("Quickdraw Dandywarrior", "Synchro deck utilizing Dandylion tokens and Quickdraw Synchron.", "Edison",
                user, cards);
    }

    private void seedDeck(String name, String description, String formatName, User user, List<CardEntryDto> cardInfos) {
        deckRepository.findByUser(user).stream()
                .filter(d -> d.getName().equalsIgnoreCase(name))
                .forEach(d -> deckRepository.delete(d));

        Format formatEnum = Format.fromString(formatName);
        Deck deck = new Deck(name, description, formatEnum, user);
        List<DeckCard> deckCards = new ArrayList<>();
        for (CardEntryDto info : cardInfos) {
            Optional<Card> cardOpt = cardRepository.findByName(info.getName());
            if (cardOpt.isPresent()) {
                DeckSection sectionEnum = DeckSection.fromString(info.getSection());
                deckCards.add(new DeckCard(deck, cardOpt.get(), sectionEnum, info.getQuantity()));
            } else {
                logger.warn("Card '{}' not found in database. Skipping for deck '{}'.", info.getName(), name);
            }
        }
        deck.setDeckCards(deckCards);
        deckRepository.save(deck);
    }
}
