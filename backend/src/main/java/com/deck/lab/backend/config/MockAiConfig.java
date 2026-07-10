package com.deck.lab.backend.config;

import org.springframework.ai.chat.model.ChatModel;
import org.springframework.ai.chat.model.ChatResponse;
import org.springframework.ai.chat.model.Generation;
import org.springframework.ai.chat.prompt.Prompt;
import org.springframework.ai.chat.messages.AssistantMessage;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Primary;
import org.springframework.context.annotation.Profile;
import reactor.core.publisher.Flux;

import java.util.List;

/**
 * Mock configuration providing a simulated ChatModel implementation.
 *
 * <p>
 * This config is activated only under the {@code ci} profile, replacing
 * external AI network calls with static JSON mock responses representing
 * generated deck configurations and card suggestions.
 * </p>
 */
@Configuration
@Profile("ci")
public class MockAiConfig {

  /**
   * Creates and registers a mock {@link ChatModel} bean as the primary chat
   * model.
   *
   * @return a mock ChatModel instance returning structured sample JSON
   *         configurations
   */
  @Bean
  @Primary
  public ChatModel mockChatModel() {
    return new ChatModel() {
      @Override
      public ChatResponse call(Prompt prompt) {
        String promptText = prompt.getInstructions().get(0).getText();
        String jsonResponse = "";

        if (promptText.contains("suggest") || promptText.contains("synerg")) {
          jsonResponse = """
              {
                "suggestions": [
                  {
                    "name": "Dark Magician",
                    "section": "MAIN",
                    "synergyReason": "Synergy with Magician archetype"
                  },
                  {
                    "name": "Blue-Eyes White Dragon",
                    "section": "MAIN",
                    "synergyReason": "High ATK dragon synergy"
                  },
                  {
                    "name": "Monster Reborn",
                    "section": "MAIN",
                    "synergyReason": "Generic revival utility"
                  },
                  {
                    "name": "Raigeki",
                    "section": "MAIN",
                    "synergyReason": "Generic board wipe utility"
                  },
                  {
                    "name": "Pot of Greed",
                    "section": "MAIN",
                    "synergyReason": "Draw utility"
                  }
                ]
              }
              """;
        } else {
          jsonResponse = """
              {
                "name": "Mock AI Generated Deck",
                "description": "A generated deck list mock",
                "cards": [
                  { "name": "Dark Magician", "section": "MAIN", "quantity": 3 },
                  { "name": "Blue-Eyes White Dragon", "section": "MAIN", "quantity": 3 },
                  { "name": "Red-Eyes Black Dragon", "section": "MAIN", "quantity": 3 },
                  { "name": "Summoned Skull", "section": "MAIN", "quantity": 3 },
                  { "name": "Celtic Guardian", "section": "MAIN", "quantity": 3 },
                  { "name": "Baby Dragon", "section": "MAIN", "quantity": 3 },
                  { "name": "Monster Reborn", "section": "MAIN", "quantity": 1 },
                  { "name": "Raigeki", "section": "MAIN", "quantity": 1 },
                  { "name": "Pot of Greed", "section": "MAIN", "quantity": 1 },
                  { "name": "Graceful Charity", "section": "MAIN", "quantity": 1 },
                  { "name": "Dark Hole", "section": "MAIN", "quantity": 1 },
                  { "name": "Swords of Revealing Light", "section": "MAIN", "quantity": 1 },
                  { "name": "Mirror Force", "section": "MAIN", "quantity": 1 },
                  { "name": "Torrential Tribute", "section": "MAIN", "quantity": 1 },
                  { "name": "Trap Hole", "section": "MAIN", "quantity": 3 },
                  { "name": "Mystical Space Typhoon", "section": "MAIN", "quantity": 3 },
                  { "name": "Heavy Storm", "section": "MAIN", "quantity": 1 },
                  { "name": "Call of the Haunted", "section": "MAIN", "quantity": 1 },
                  { "name": "Premature Burial", "section": "MAIN", "quantity": 1 },
                  { "name": "Cyber Dragon", "section": "MAIN", "quantity": 3 },
                  { "name": "Breaker the Magical Warrior", "section": "MAIN", "quantity": 1 },
                  { "name": "Sangan", "section": "MAIN", "quantity": 1 }
                ]
              }
              """;
        }

        Generation generation = new Generation(new AssistantMessage(jsonResponse));
        return new ChatResponse(List.of(generation));
      }

      @Override
      public Flux<ChatResponse> stream(Prompt prompt) {
        return Flux.empty();
      }
    };
  }
}
