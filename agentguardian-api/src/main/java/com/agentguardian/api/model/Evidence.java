package com.agentguardian.api.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.UUID;

@Entity
@Data
@NoArgsConstructor
public class Evidence {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "investigation_id")
    private Investigation investigation;

    private String evidenceType; // URL, EMAIL, DOMAIN, PHONE, PERSON, COMPANY, etc.

    @Column(name = "evidence_value", columnDefinition = "TEXT")
    private String value;

    @Column(columnDefinition = "TEXT")
    private String verificationStatus; // VERIFIED, SUSPICIOUS, UNVERIFIED

    @Column(columnDefinition = "TEXT")
    private String details;

    public void setInvestigation(Investigation investigation) { this.investigation = investigation; }
    public void setEvidenceType(String evidenceType) { this.evidenceType = evidenceType; }
    public void setValue(String value) { this.value = value; }
    public void setVerificationStatus(String verificationStatus) { this.verificationStatus = verificationStatus; }
    public void setDetails(String details) { this.details = details; }
}
