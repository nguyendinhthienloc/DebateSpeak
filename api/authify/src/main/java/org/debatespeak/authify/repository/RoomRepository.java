package org.debatespeak.authify.repository;
import jakarta.persistence.LockModeType;
import org.debatespeak.authify.entity.RoomEntity;
import org.springframework.data.jpa.repository.*;
import org.springframework.data.repository.query.Param;
import java.util.*;
public interface RoomRepository extends JpaRepository<RoomEntity, UUID> {
  Optional<RoomEntity> findByCode(String code);
  @Lock(LockModeType.PESSIMISTIC_WRITE) @Query("select r from RoomEntity r where r.id=:id") Optional<RoomEntity> findLockedById(@Param("id") UUID id);
  @Lock(LockModeType.PESSIMISTIC_WRITE) @Query("select r from RoomEntity r where r.code=:code") Optional<RoomEntity> findLockedByCode(@Param("code") String code);
}
