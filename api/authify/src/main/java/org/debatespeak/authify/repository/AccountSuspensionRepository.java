package org.debatespeak.authify.repository;

import org.debatespeak.authify.entity.AccountSuspensionEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;
import java.util.UUID;

public interface AccountSuspensionRepository extends JpaRepository<AccountSuspensionEntity, UUID> {
    Optional<AccountSuspensionEntity> findFirstByUserIdAndLiftedAtIsNullOrderByCreatedAtDesc(UUID userId);
}