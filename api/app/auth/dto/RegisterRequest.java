package org.debatespeak.authify.dto;

import com.fasterxml.jackson.annotation.JsonProperty;

public record RegisterRequest(
        String email,
        String password,
        @JsonProperty("display_name") String displayName,
        @JsonProperty("cefr_level") String cefrLevel
) {}