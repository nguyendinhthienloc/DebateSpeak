package org.debatespeak.authify.dto;

public record ResetPasswordRequest(
        String email,
        String code,
        String password
) {
}