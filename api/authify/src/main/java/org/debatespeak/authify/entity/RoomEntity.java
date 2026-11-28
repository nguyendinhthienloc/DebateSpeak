package org.debatespeak.authify.entity;

import jakarta.persistence.*;
import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name = "debate_rooms", indexes = @Index(name = "idx_room_code", columnList = "code", unique = true))
public class RoomEntity {
    @Id private UUID id;
    @Column(unique = true, length = 8) private String code;
    @Column(nullable = false, length = 16) private String status;
    @Column(name = "topic_id", nullable = false) private String topicId;
    @Column(nullable = false, length = 16) private String format;
    @Column(name = "duration_seconds", nullable = false) private int durationSeconds;
    @Column(name = "creator_id", nullable = false) private UUID creatorId;
    @Column(name = "creator_side", nullable = false, length = 10) private String creatorSide;
    @Column(name = "expires_at", nullable = false) private Instant expiresAt;
    @Column(name = "started_at") private Instant startedAt;
    @Column(name = "ended_at") private Instant endedAt;
    @Column(name = "end_reason", length = 16) private String endReason;
    @Column(name = "ended_by") private UUID endedBy;
    public RoomEntity() { }
    public UUID getId(){return id;} public void setId(UUID v){id=v;} public String getCode(){return code;} public void setCode(String v){code=v;}
    public String getStatus(){return status;} public void setStatus(String v){status=v;} public String getTopicId(){return topicId;} public void setTopicId(String v){topicId=v;}
    public String getFormat(){return format;} public void setFormat(String v){format=v;} public int getDurationSeconds(){return durationSeconds;} public void setDurationSeconds(int v){durationSeconds=v;}
    public UUID getCreatorId(){return creatorId;} public void setCreatorId(UUID v){creatorId=v;} public String getCreatorSide(){return creatorSide;} public void setCreatorSide(String v){creatorSide=v;}
    public Instant getExpiresAt(){return expiresAt;} public void setExpiresAt(Instant v){expiresAt=v;} public Instant getStartedAt(){return startedAt;} public void setStartedAt(Instant v){startedAt=v;}
    public Instant getEndedAt(){return endedAt;} public void setEndedAt(Instant v){endedAt=v;} public String getEndReason(){return endReason;} public void setEndReason(String v){endReason=v;}
    public UUID getEndedBy(){return endedBy;} public void setEndedBy(UUID v){endedBy=v;}
}
