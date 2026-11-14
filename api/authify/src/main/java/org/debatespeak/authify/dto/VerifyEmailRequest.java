package org.debatespeak.authify.dto;

public record VerifyEmailRequest(
        String email,
        String code
) {
}