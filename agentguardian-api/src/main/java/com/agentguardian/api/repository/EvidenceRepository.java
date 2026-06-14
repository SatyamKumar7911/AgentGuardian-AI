package com.agentguardian.api.repository;

import com.agentguardian.api.model.Evidence;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.UUID;

public interface EvidenceRepository extends JpaRepository<Evidence, UUID> {
    List<Evidence> findByInvestigationId(UUID investigationId);
}
