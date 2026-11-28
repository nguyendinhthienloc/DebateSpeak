package org.debatespeak.authify.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import org.debatespeak.authify.models.User;
import java.time.Instant;
import java.util.UUID;

public record UserResponse(
        UUID id,
        String email,
        @JsonProperty("display_name") String displayName,
        @JsonProperty("cefr_level") String cefrLevel,
        @JsonProperty("created_at") Instant createdAt
) {
    public static UserResponse from(User user) {
        return new UserResponse(
                user.id(),
                user.email(),
                user.displayName(),
                user.cefrLevel(),
                user.createdAt()
        );
    }
}