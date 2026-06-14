package com.agentguardian.api.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.UUID;

@Entity
@Data
@NoArgsConstructor
public class Recommendation {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "investigation_id")
    private Investigation investigation;

    @Column(columnDefinition = "TEXT")
    private String action; // e.g. "Do not click links"

    @Column(columnDefinition = "TEXT")
    private String reasoning;

    public void setInvestigation(Investigation investigation) { this.investigation = investigation; }
    public void setAction(String action) { this.action = action; }
    public void setReasoning(String reasoning) { this.reasoning = reasoning; }
}
