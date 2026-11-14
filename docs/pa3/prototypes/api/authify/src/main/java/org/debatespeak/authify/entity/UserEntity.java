package org.debatespeak.authify.entity;

import jakarta.persistence.*;
import java.time.Instant;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Entity
@Table(name = "users")
public class UserEntity {

    @Id
    private UUID id;

    @Column(nullable = false, unique = true, length = 254)
    private String email;

    @Column(name = "password_hash", nullable = false)
    private String passwordHash;

    @Column(name = "display_name", nullable = false, length = 80)
    private String displayName;

    @Column(name = "cefr_level", nullable = false, length = 10)
    private String cefrLevel;

    @Column(nullable = false, length = 20)
    private String role;

    @Column(name = "email_verified", nullable = false)
    private boolean emailVerified;

    @Column(name = "is_suspended", nullable = false)
    private boolean isSuspended;

    @Column(name = "native_language", length = 64)
    private String nativeLanguage;

    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(name = "user_goals", joinColumns = @JoinColumn(name = "user_id"))
    @Column(name = "goal", length = 120)
    @OrderColumn(name = "goal_order")
    private List<String> goals = new ArrayList<>();

    @Column(name = "created_at", nullable = false)
    private Instant createdAt;

    @Column(name = "deleted_at")
    private Instant deletedAt;

    public UserEntity() {}

    // Getters & Setters (trong IntelliJ bấm Alt + Insert -> Getter and Setter -> chọn tất cả)
    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
    public String getPasswordHash() { return passwordHash; }
    public void setPasswordHash(String passwordHash) { this.passwordHash = passwordHash; }
    public String getDisplayName() { return displayName; }
    public void setDisplayName(String displayName) { this.displayName = displayName; }
    public String getCefrLevel() { return cefrLevel; }
    public void setCefrLevel(String cefrLevel) { this.cefrLevel = cefrLevel; }
    public String getRole() { return role; }
    public void setRole(String role) { this.role = role; }
    public boolean isEmailVerified() { return emailVerified; }
    public void setEmailVerified(boolean emailVerified) { this.emailVerified = emailVerified; }
    public boolean isSuspended() { return isSuspended; }
    public void setSuspended(boolean suspended) { isSuspended = suspended; }
    public String getNativeLanguage() { return nativeLanguage; }
    public void setNativeLanguage(String nativeLanguage) { this.nativeLanguage = nativeLanguage; }
    public List<String> getGoals() { return goals; }
    public void setGoals(List<String> goals) { this.goals = goals; }
    public Instant getCreatedAt() { return createdAt; }
    public void setCreatedAt(Instant createdAt) { this.createdAt = createdAt; }
    public Instant getDeletedAt() { return deletedAt; }
    public void setDeletedAt(Instant deletedAt) { this.deletedAt = deletedAt; }
}