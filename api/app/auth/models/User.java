package org.debatespeak.authify.models;

import java.time.Instant;
import java.util.UUID;

public record User(
        UUID id,
        String email,
        String passwordHash,
        String displayName,
        String cefrLevel,
        Instant createdAt
) {}