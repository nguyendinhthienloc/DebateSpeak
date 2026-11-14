package org.debatespeak.authify.repository;

import org.debatespeak.authify.entity.UserEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;
import java.util.UUID;

public interface UserRepository extends JpaRepository<UserEntity, UUID> {
    Optional<UserEntity> findByEmailAndDeletedAtIsNull(String email);
    boolean existsByEmail(String email);
}