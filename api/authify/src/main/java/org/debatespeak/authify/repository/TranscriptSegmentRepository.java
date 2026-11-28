package org.debatespeak.authify.repository;
import org.debatespeak.authify.entity.TranscriptSegmentEntity;
import org.springframework.data.jpa.repository.*;
import org.springframework.data.repository.query.Param;
import java.util.*;
public interface TranscriptSegmentRepository extends JpaRepository<TranscriptSegmentEntity, UUID> { List<TranscriptSegmentEntity> findByRoomIdAndSeqGreaterThanOrderBySeqAsc(UUID roomId, long seq); @Query("select coalesce(max(t.seq), 0) from TranscriptSegmentEntity t where t.roomId=:roomId") long maxSeq(@Param("roomId") UUID roomId); }
