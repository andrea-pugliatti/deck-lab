package com.deck.lab.backend.config;

import java.util.Map;

import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Configuration;

@Configuration
@ConfigurationProperties(prefix = "app.prompts")
public class PromptConfig {
    private Map<String, String> formats;
    private Map<String, String> playstyles;
    private SystemTemplates system;

    public Map<String, String> getFormats() {
        return formats;
    }

    public void setFormats(Map<String, String> formats) {
        this.formats = formats;
    }

    public Map<String, String> getPlaystyles() {
        return playstyles;
    }

    public void setPlaystyles(Map<String, String> playstyles) {
        this.playstyles = playstyles;
    }

    public SystemTemplates getSystem() {
        return system;
    }

    public void setSystem(SystemTemplates system) {
        this.system = system;
    }

    public static class SystemTemplates {
        private String draft;
        private String refinement;
        private String suggestion;

        public String getDraft() {
            return draft;
        }

        public void setDraft(String draft) {
            this.draft = draft;
        }

        public String getRefinement() {
            return refinement;
        }

        public void setRefinement(String refinement) {
            this.refinement = refinement;
        }

        public String getSuggestion() {
            return suggestion;
        }

        public void setSuggestion(String suggestion) {
            this.suggestion = suggestion;
        }
    }
}
