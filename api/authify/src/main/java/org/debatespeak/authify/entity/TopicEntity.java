package org.debatespeak.authify.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "topics")
public class TopicEntity {
    @Id private String id;
    @Column(nullable = false, length = 500) private String motion;
    @Column(nullable = false, length = 80) private String category;
    @Column(name = "cefr_level", nullable = false, length = 10) private String cefrLevel;
    public TopicEntity() { }
    public TopicEntity(String id, String motion, String category, String cefrLevel) { this.id=id; this.motion=motion; this.category=category; this.cefrLevel=cefrLevel; }
    public String getId() { return id; }
    public String getMotion() { return motion; }
    public String getCategory() { return category; }
    public String getCefrLevel() { return cefrLevel; }
}
