package org.debatespeak.authify.dto;

import java.util.List;

public record SessionListResponse(List<SessionItemResponse> sessions) {
}