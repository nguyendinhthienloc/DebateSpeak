package org.debatespeak.authify.repository;
import org.debatespeak.authify.entity.RoomParticipantEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.*;
public interface RoomParticipantRepository extends JpaRepository<RoomParticipantEntity, UUID> { List<RoomParticipantEntity> findByRoomIdOrderByCreatorDesc(UUID roomId); Optional<RoomParticipantEntity> findByRoomIdAndUserId(UUID roomId, UUID userId); long countByRoomId(UUID roomId); }
