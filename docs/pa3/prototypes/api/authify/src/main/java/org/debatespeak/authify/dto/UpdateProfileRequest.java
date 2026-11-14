package org.debatespeak.authify.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import java.util.List;

public record UpdateProfileRequest(
        @JsonProperty("display_name") String displayName,
        @JsonProperty("cefr_level") String cefrLevel,
        @JsonProperty("native_language") String nativeLanguage,
        List<String> goals,
        String email,
        String role
) {
}