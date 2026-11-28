package org.debatespeak.authify.dto;

public record LoginRequest(
        String email,
        String password
) {}