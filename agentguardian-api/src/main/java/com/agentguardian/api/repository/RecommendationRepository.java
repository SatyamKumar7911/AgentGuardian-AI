package com.agentguardian.api.repository;

import com.agentguardian.api.model.Recommendation;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.UUID;

public interface RecommendationRepository extends JpaRepository<Recommendation, UUID> {
    List<Recommendation> findByInvestigationId(UUID investigationId);
}
