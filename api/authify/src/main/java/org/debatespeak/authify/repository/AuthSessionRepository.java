package org.debatespeak.authify.repository;

import org.debatespeak.authify.entity.AuthSessionEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import java.time.Instant;
import java.util.List;
import java.util.UUID;

public interface AuthSessionRepository extends JpaRepository<AuthSessionEntity, UUID> {
    List<AuthSessionEntity> findByUserIdAndRevokedFalseAndExpiresAtAfterOrderByCreatedAtDesc(UUID userId, Instant now);
    List<AuthSessionEntity> findByUserIdAndRevokedFalse(UUID userId);
}