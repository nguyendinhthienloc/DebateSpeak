package org.debatespeak.authify.repository;
import org.debatespeak.authify.entity.TopicEntity;
import org.springframework.data.jpa.repository.JpaRepository;
public interface TopicRepository extends JpaRepository<TopicEntity, String> { }
