package org.debatespeak.authify.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import java.time.Instant;
import java.util.UUID;

public record AdminUserResponse(
        UUID id,
        String email,
        @JsonProperty("display_name") String displayName,
        String role,
        @JsonProperty("is_suspended") boolean isSuspended,
        @JsonProperty("created_at") Instant createdAt
) {
}