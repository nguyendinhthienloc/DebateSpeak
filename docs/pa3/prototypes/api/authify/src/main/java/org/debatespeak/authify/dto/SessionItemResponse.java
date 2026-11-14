package org.debatespeak.authify.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import java.time.Instant;
import java.util.UUID;

public record SessionItemResponse(
        UUID id,
        @JsonProperty("created_at") Instant createdAt,
        @JsonProperty("last_used_at") Instant lastUsedAt,
        String device,
        boolean current
) {
}