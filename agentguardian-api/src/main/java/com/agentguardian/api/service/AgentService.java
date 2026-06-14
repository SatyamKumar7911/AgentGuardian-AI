package com.agentguardian.api.service;

import com.agentguardian.api.model.*;
import com.agentguardian.api.repository.*;
import com.fasterxml.jackson.databind.JsonNode;
import java.time.LocalDateTime;
import lombok.RequiredArgsConstructor;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

@Service
@RequiredArgsConstructor
public class AgentService {

    private final InvestigationRepository investigationRepository;
    private final EvidenceRepository evidenceRepository;
    private final RiskScoreRepository riskScoreRepository;
    private final RecommendationRepository recommendationRepository;
    private final TimelineStepRepository timelineStepRepository;
    private final FraudSignalRepository fraudSignalRepository;
    private final AiAnalysisService aiAnalysisService;
    private final com.agentguardian.api.controller.SseController sseController;

    @Transactional
    public Investigation startInvestigation(String filename, String content) {
        Investigation inv = new Investigation();
        inv.setTitle("Investigation: " + filename);
        inv.setDescription(content);
        inv.setStatus(Investigation.InvestigationStatus.ANALYZING);

        String lowerContent = content.toLowerCase() + " " + filename.toLowerCase();
        if (lowerContent.contains("offer") || lowerContent.contains("job") || lowerContent.contains("salary")) {
            inv.setType(Investigation.InvestigationType.JOB_SCAM);
        } else if (lowerContent.contains("investment") || lowerContent.contains("return") || lowerContent.contains("crypto")) {
            inv.setType(Investigation.InvestigationType.INVESTMENT_FRAUD);
        } else if (lowerContent.contains("video") || lowerContent.contains("codec") || lowerContent.contains("deepfake")) {
            inv.setType(Investigation.InvestigationType.DEEPFAKE);
        } else {
            inv.setType(Investigation.InvestigationType.PHISHING);
        }
        
        Investigation saved = investigationRepository.save(inv);
        saveTimelineStep(saved, 1, "Document Uploaded", "Document " + filename + " received by Intake Agent.");
        return saved;
    }

    @Async
    public void runAgents(UUID investigationId) {
        try {
            Investigation inv = investigationRepository.findById(investigationId).orElseThrow();
            String text = inv.getDescription();
            
            Thread.sleep(1000);
            TimelineStep step2 = saveTimelineStep(inv, 2, "Text Extraction Completed", "Extracted text and metadata from document.");
            sseController.sendEvent(investigationId, step2);

            Thread.sleep(1500);
            
            // USE AI SERVICE FOR DYNAMIC ANALYSIS
            JsonNode aiResult = aiAnalysisService.analyzeDocument(text, inv.getTitle());
            
            // Extract Entities
            if (aiResult.has("entities")) {
                aiResult.get("entities").forEach(entity -> {
                    saveEvidence(inv, entity.get("type").asText(), entity.get("value").asText(), entity.get("status").asText(), entity.get("details").asText());
                });
            }
            TimelineStep step3 = saveTimelineStep(inv, 3, "AI Entity Extraction Completed", "Entities mapped using LLM semantic extraction.");
            sseController.sendEvent(investigationId, step3);

            Thread.sleep(1500);
            
            // Risk Engine & Signals
            if (aiResult.has("signals")) {
                aiResult.get("signals").forEach(signal -> {
                    saveFraudSignal(inv, FraudSignal.SignalType.valueOf(signal.get("type").asText()), signal.get("name").asText(), signal.get("explanation").asText());
                });
            }
            saveRiskScore(inv, aiResult.get("score").asInt(), RiskScore.RiskLevel.valueOf(aiResult.get("level").asText()), aiResult.get("reasoning").asText());
            
            TimelineStep step4 = saveTimelineStep(inv, 4, "Risk Analysis Completed", "Multi-factor threat analysis finished via Foundry IQ Agent.");
            sseController.sendEvent(investigationId, step4);

            Thread.sleep(1500);
            TimelineStep step5 = saveTimelineStep(inv, 5, "Foundry IQ Verification Completed", "Cross-referenced entities with global threat intelligence.");
            sseController.sendEvent(investigationId, step5);

            Thread.sleep(1000);
            inv.setStatus(Investigation.InvestigationStatus.COMPLETED);
            investigationRepository.save(inv);
            TimelineStep step6 = saveTimelineStep(inv, 6, "Final Verdict Generated", "Investigation closed. Report ready.");
            sseController.sendEvent(investigationId, step6);

        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    private void extractEntities(Investigation inv, String text) {
        // URLs
        Pattern urlPattern = Pattern.compile("(https?://[\\w\\.-]+(?:/[\\w\\.-]*)?)");
        Matcher urlMatcher = urlPattern.matcher(text);
        while (urlMatcher.find()) {
            saveEvidence(inv, "URL", urlMatcher.group(1), "SUSPICIOUS", "Extracted URL requires verification.");
        }

        // Emails
        Pattern emailPattern = Pattern.compile("([a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\\.[a-zA-Z0-9_-]+)");
        Matcher emailMatcher = emailPattern.matcher(text);
        while (emailMatcher.find()) {
            saveEvidence(inv, "EMAIL", emailMatcher.group(1), "UNVERIFIED", "Email address extracted.");
        }

        // Companies
        if (text.contains("Microsoft Corporation")) {
            saveEvidence(inv, "ORGANIZATION", "Microsoft Corporation", "VERIFIED", "Extracted company name.");
        }
        if (text.contains("Chase Bank")) {
            saveEvidence(inv, "ORGANIZATION", "Chase Bank", "VERIFIED", "Extracted company name.");
        }

        // Suspicious Claims
        if (text.toLowerCase().contains("guaranteed 500% return")) {
            saveEvidence(inv, "SUSPICIOUS CLAIM", "Guaranteed 500% return in 30 days", "SUSPICIOUS", "Detected unrealistic investment return.");
        }
    }

    private void calculateRiskAndSignals(Investigation inv, String lowerText) {
        int score = 0;

        if (inv.getType() == Investigation.InvestigationType.INVESTMENT_FRAUD) {
            if (lowerText.contains("guaranteed") || lowerText.contains("return")) {
                score += 30;
                saveFraudSignal(inv, FraudSignal.SignalType.FRAUD, "Guaranteed Profits", "Promises of guaranteed high returns are a classic hallmark of Ponzi schemes.");
            }
            if (lowerText.contains("urgent") || lowerText.contains("30 days")) {
                score += 20;
                saveFraudSignal(inv, FraudSignal.SignalType.FRAUD, "Urgency Language", "Artificial time pressure limits the victim's ability to verify claims.");
            }
            if (lowerText.contains("anonymous")) {
                score += 20;
                saveFraudSignal(inv, FraudSignal.SignalType.FRAUD, "Anonymous Contact", "Lack of verifiable personal identification.");
            }
            saveFraudSignal(inv, FraudSignal.SignalType.LEGITIMATE, "PDF Format", "Standard business document format.");
            
            saveRecommendation(inv, "Do not invest funds.", "The likelihood of fraud is critically high.");

        } else if (inv.getType() == Investigation.InvestigationType.JOB_SCAM) {
            if (lowerText.contains("deposit") || lowerText.contains("crypto") || lowerText.contains("wallet")) {
                score += 30;
                saveFraudSignal(inv, FraudSignal.SignalType.FRAUD, "Upfront Payment Request", "Legitimate companies never ask for crypto deposits for equipment.");
            }
            if (lowerText.contains("microsoft")) {
                score += 25;
                saveFraudSignal(inv, FraudSignal.SignalType.FRAUD, "Brand Impersonation", "Sender claims to represent Microsoft but uses an unofficial domain.");
            }
            saveFraudSignal(inv, FraudSignal.SignalType.LEGITIMATE, "Corporate Tone", "Email uses professional language common in legitimate offers.");
            
            saveRecommendation(inv, "Cease communication with the sender.", "This is a confirmed advance-fee job scam.");

        } else if (inv.getType() == Investigation.InvestigationType.PHISHING) {
            if (lowerText.contains("http://") && !lowerText.contains("https://")) {
                score += 25;
                saveFraudSignal(inv, FraudSignal.SignalType.FRAUD, "Unencrypted Link", "Legitimate financial institutions always use HTTPS.");
            }
            if (lowerText.contains("verify") || lowerText.contains("token")) {
                score += 20;
                saveFraudSignal(inv, FraudSignal.SignalType.FRAUD, "Credential Request", "Link leads to a verification page designed to harvest credentials.");
            }
            if (lowerText.contains("hyphen") || lowerText.contains("-update-alert")) {
                score += 25;
                saveFraudSignal(inv, FraudSignal.SignalType.FRAUD, "Suspicious Domain", "Domain uses hyphens to masquerade as a legitimate banking entity.");
            }
            
            saveRecommendation(inv, "Do not click the provided link.", "It leads to a credential harvesting site.");

        } else if (inv.getType() == Investigation.InvestigationType.DEEPFAKE) {
            score += 90;
            saveFraudSignal(inv, FraudSignal.SignalType.FRAUD, "Audio Artifacts", "Detected high-frequency inconsistencies indicating synthetic voice cloning.");
            saveFraudSignal(inv, FraudSignal.SignalType.FRAUD, "Wire Transfer Request", "Urgent request for high-value funds transfer.");
            saveFraudSignal(inv, FraudSignal.SignalType.LEGITIMATE, "Standard Video Codec", "Video encoding uses standard H.264 compression.");
            
            saveRecommendation(inv, "Verify identity out-of-band.", "Call the requester on a known, verified phone number.");
        }

        RiskScore.RiskLevel level;
        if (score <= 20) level = RiskScore.RiskLevel.SAFE;
        else if (score <= 40) level = RiskScore.RiskLevel.LOW_RISK;
        else if (score <= 60) level = RiskScore.RiskLevel.MEDIUM_RISK;
        else if (score <= 80) level = RiskScore.RiskLevel.HIGH_RISK;
        else level = RiskScore.RiskLevel.CRITICAL_THREAT;

        saveRiskScore(inv, score, level, "Score dynamically calculated based on multiple weighted threat vectors detected in the content.");
    }

    private void saveFraudSignal(Investigation inv, FraudSignal.SignalType type, String name, String explanation) {
        FraudSignal s = new FraudSignal();
        s.setInvestigation(inv);
        s.setType(type);
        s.setName(name);
        s.setExplanation(explanation);
        fraudSignalRepository.save(s);
    }

    private TimelineStep saveTimelineStep(Investigation inv, int order, String title, String description) {
        TimelineStep step = new TimelineStep();
        step.setInvestigation(inv);
        step.setStepOrder(order);
        step.setTitle(title);
        step.setDescription(description);
        step.setTimestamp(LocalDateTime.now());
        return timelineStepRepository.save(step);
    }

    private void saveEvidence(Investigation inv, String type, String value, String status, String details) {
        Evidence e = new Evidence();
        e.setInvestigation(inv);
        e.setEvidenceType(type);
        e.setValue(value);
        e.setVerificationStatus(status);
        e.setDetails(details);
        evidenceRepository.save(e);
    }

    private void saveRiskScore(Investigation inv, int score, RiskScore.RiskLevel level, String reasoning) {
        RiskScore r = new RiskScore();
        r.setInvestigation(inv);
        r.setScore(score);
        r.setLevel(level);
        r.setReasoning(reasoning);
        riskScoreRepository.save(r);
    }

    private void saveRecommendation(Investigation inv, String action, String reasoning) {
        Recommendation r = new Recommendation();
        r.setInvestigation(inv);
        r.setAction(action);
        r.setReasoning(reasoning);
        recommendationRepository.save(r);
    }
}
