package com.agentguardian.api.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.UUID;

@Entity
@Data
@NoArgsConstructor
public class FraudSignal {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "investigation_id")
    private Investigation investigation;

    @Enumerated(EnumType.STRING)
    private SignalType type; // LEGITIMATE or FRAUD

    private String name;
    
    @Column(columnDefinition = "TEXT")
    private String explanation;

    public void setInvestigation(Investigation investigation) { this.investigation = investigation; }
    public void setType(SignalType type) { this.type = type; }
    public void setName(String name) { this.name = name; }
    public void setExplanation(String explanation) { this.explanation = explanation; }

    public enum SignalType {
        LEGITIMATE, FRAUD
    }

    public FraudSignal(Investigation investigation, SignalType type, String name, String explanation) {
        this.investigation = investigation;
        this.type = type;
        this.name = name;
        this.explanation = explanation;
    }
}
