package org.debatespeak.authify.entity;
import jakarta.persistence.*;
import java.time.Instant;
import java.util.UUID;
@Entity @Table(name="debate_sessions", uniqueConstraints=@UniqueConstraint(columnNames="room_id"))
public class DebateSessionEntity { @Id private UUID id; @Column(name="room_id", nullable=false) private UUID roomId; @Column(name="created_at", nullable=false) private Instant createdAt; public DebateSessionEntity(){} public UUID getId(){return id;} public void setId(UUID v){id=v;} public UUID getRoomId(){return roomId;} public void setRoomId(UUID v){roomId=v;} public Instant getCreatedAt(){return createdAt;} public void setCreatedAt(Instant v){createdAt=v;} }
