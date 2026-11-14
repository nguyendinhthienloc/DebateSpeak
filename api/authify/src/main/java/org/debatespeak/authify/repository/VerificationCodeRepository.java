package org.debatespeak.authify.repository;

import org.debatespeak.authify.entity.VerificationCodeEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import java.time.Instant;
import java.util.Optional;
import java.util.UUID;

public interface VerificationCodeRepository extends JpaRepository<VerificationCodeEntity, UUID> {
    Optional<VerificationCodeEntity> findFirstByEmailAndPurposeAndConsumedAtIsNullAndExpiresAtAfterOrderByExpiresAtDesc(
            String email, String purpose, Instant now
    );
}