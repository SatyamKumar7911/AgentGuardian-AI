package com.agentguardian.api.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Data
@NoArgsConstructor
public class TimelineStep {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "investigation_id")
    private Investigation investigation;

    private Integer stepOrder;
    private String title;
    private String description;
    private LocalDateTime timestamp;

    public void setInvestigation(Investigation investigation) { this.investigation = investigation; }
    public void setStepOrder(Integer stepOrder) { this.stepOrder = stepOrder; }
    public void setTitle(String title) { this.title = title; }
    public void setDescription(String description) { this.description = description; }
    public void setTimestamp(LocalDateTime timestamp) { this.timestamp = timestamp; }

    public TimelineStep(Investigation investigation, Integer stepOrder, String title, String description) {
        this.investigation = investigation;
        this.stepOrder = stepOrder;
        this.title = title;
        this.description = description;
        this.timestamp = LocalDateTime.now();
    }
}
