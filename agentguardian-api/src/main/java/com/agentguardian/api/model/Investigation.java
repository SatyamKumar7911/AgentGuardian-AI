package com.agentguardian.api.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Entity
@Data
@NoArgsConstructor
public class Investigation {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    private String title;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Enumerated(EnumType.STRING)
    private InvestigationType type;

    @Enumerated(EnumType.STRING)
    private InvestigationStatus status;

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    public InvestigationType getType() { return type; }
    public void setType(InvestigationType type) { this.type = type; }
    public InvestigationStatus getStatus() { return status; }
    public void setStatus(InvestigationStatus status) { this.status = status; }

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }

    public enum InvestigationType {
        PHISHING, JOB_SCAM, DEEPFAKE, INVESTMENT_FRAUD, IDENTITY_THEFT,
        FAKE_LOTTERY, SOCIAL_ENGINEERING, FINANCIAL_SCAM, SUSPICIOUS_WEBSITE, UNKNOWN
    }

    public enum InvestigationStatus {
        PENDING, ANALYZING, COMPLETED, FAILED
    }
}
