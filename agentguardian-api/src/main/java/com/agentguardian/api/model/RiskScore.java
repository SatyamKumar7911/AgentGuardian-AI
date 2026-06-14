package com.agentguardian.api.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.UUID;

@Entity
@Data
@NoArgsConstructor
public class RiskScore {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "investigation_id")
    private Investigation investigation;

    private Integer score; // 0 to 100

    @Enumerated(EnumType.STRING)
    private RiskLevel level;

    @Column(columnDefinition = "TEXT")
    private String reasoning;

    public void setInvestigation(Investigation investigation) { this.investigation = investigation; }
    public void setScore(Integer score) { this.score = score; }
    public void setLevel(RiskLevel level) { this.level = level; }
    public void setReasoning(String reasoning) { this.reasoning = reasoning; }

    public enum RiskLevel {
        SAFE, LOW_RISK, MEDIUM_RISK, HIGH_RISK, CRITICAL_THREAT
    }
}
