package com.agentguardian.api.repository;

import com.agentguardian.api.model.TimelineStep;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.UUID;

public interface TimelineStepRepository extends JpaRepository<TimelineStep, UUID> {
    List<TimelineStep> findByInvestigationIdOrderByStepOrderAsc(UUID investigationId);
}
