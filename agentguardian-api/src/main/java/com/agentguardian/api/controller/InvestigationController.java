package com.agentguardian.api.controller;

import com.agentguardian.api.dto.InvestigationReportDto;
import com.agentguardian.api.model.Investigation;
import com.agentguardian.api.repository.EvidenceRepository;
import com.agentguardian.api.repository.InvestigationRepository;
import com.agentguardian.api.repository.RecommendationRepository;
import com.agentguardian.api.repository.RiskScoreRepository;
import com.agentguardian.api.repository.TimelineStepRepository;
import com.agentguardian.api.repository.FraudSignalRepository;
import com.agentguardian.api.service.AgentService;
import com.agentguardian.api.service.DocumentParserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/investigations")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class InvestigationController {

    private final AgentService agentService;
    private final DocumentParserService documentParserService;
    private final InvestigationRepository investigationRepository;
    private final EvidenceRepository evidenceRepository;
    private final RiskScoreRepository riskScoreRepository;
    private final RecommendationRepository recommendationRepository;

    private final TimelineStepRepository timelineStepRepository;
    private final FraudSignalRepository fraudSignalRepository;

    @PostMapping("/upload")
    public ResponseEntity<Investigation> uploadEvidence(@RequestParam("file") MultipartFile file) throws Exception {
        String filename = file.getOriginalFilename();
        String content = documentParserService.parseContent(file);
        
        Investigation inv = agentService.startInvestigation(filename, content);
        
        // Asynchronously run agents (simulated sync for demo simplicity)
        agentService.runAgents(inv.getId());
        
        return ResponseEntity.ok(inv);
    }

    @GetMapping
    public ResponseEntity<List<Investigation>> getAllInvestigations() {
        return ResponseEntity.ok(investigationRepository.findAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<InvestigationReportDto> getInvestigationReport(@PathVariable UUID id) {
        Investigation inv = investigationRepository.findById(id).orElseThrow();
        
        InvestigationReportDto dto = new InvestigationReportDto();
        dto.setInvestigation(inv);
        dto.setEvidence(evidenceRepository.findByInvestigationId(id));
        dto.setRiskScore(riskScoreRepository.findByInvestigationId(id).orElse(null));
        dto.setRecommendations(recommendationRepository.findByInvestigationId(id));
        dto.setTimeline(timelineStepRepository.findByInvestigationIdOrderByStepOrderAsc(id));
        dto.setSignals(fraudSignalRepository.findByInvestigationId(id));
        
        return ResponseEntity.ok(dto);
    }
}
