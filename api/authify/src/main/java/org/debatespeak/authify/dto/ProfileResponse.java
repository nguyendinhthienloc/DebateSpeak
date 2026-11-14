package org.debatespeak.authify.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import java.time.Instant;
import java.util.List;
import java.util.UUID;

public record ProfileResponse(
        UUID id,
        String email,
        @JsonProperty("display_name") String displayName,
        @JsonProperty("cefr_level") String cefrLevel,
        @JsonProperty("created_at") Instant createdAt,
        String role,
        @JsonProperty("native_language") String nativeLanguage,
        List<String> goals
) {
}