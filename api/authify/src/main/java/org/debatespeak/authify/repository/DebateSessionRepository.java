package org.debatespeak.authify.repository;
import org.debatespeak.authify.entity.DebateSessionEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.UUID;
public interface DebateSessionRepository extends JpaRepository<DebateSessionEntity, UUID> { boolean existsByRoomId(UUID roomId); }
