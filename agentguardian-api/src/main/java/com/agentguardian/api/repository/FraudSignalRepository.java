package com.agentguardian.api.repository;

import com.agentguardian.api.model.FraudSignal;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.UUID;

public interface FraudSignalRepository extends JpaRepository<FraudSignal, UUID> {
    List<FraudSignal> findByInvestigationId(UUID investigationId);
}
