package org.debatespeak.authify.entity;
import jakarta.persistence.*;
import java.util.UUID;
@Entity @Table(name = "room_participants", uniqueConstraints = @UniqueConstraint(columnNames = {"room_id", "user_id"}))
public class RoomParticipantEntity {
    @Id private UUID id; @Column(name="room_id", nullable=false) private UUID roomId; @Column(name="user_id", nullable=false) private UUID userId;
    @Column(name="is_creator", nullable=false) private boolean creator; @Column(length=10) private String side; @Column(nullable=false) private boolean ready; @Column(length=10) private String input;
    public RoomParticipantEntity() { }
    public UUID getId(){return id;} public void setId(UUID v){id=v;} public UUID getRoomId(){return roomId;} public void setRoomId(UUID v){roomId=v;} public UUID getUserId(){return userId;} public void setUserId(UUID v){userId=v;} public boolean isCreator(){return creator;} public void setCreator(boolean v){creator=v;} public String getSide(){return side;} public void setSide(String v){side=v;} public boolean isReady(){return ready;} public void setReady(boolean v){ready=v;} public String getInput(){return input;} public void setInput(String v){input=v;}
}
