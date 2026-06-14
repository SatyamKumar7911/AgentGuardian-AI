package com.agentguardian.api.repository;

import com.agentguardian.api.model.Investigation;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.UUID;

public interface InvestigationRepository extends JpaRepository<Investigation, UUID> {
}
