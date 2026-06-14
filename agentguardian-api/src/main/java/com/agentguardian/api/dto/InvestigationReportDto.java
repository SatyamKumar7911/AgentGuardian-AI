package com.agentguardian.api.dto;

import com.agentguardian.api.model.Evidence;
import com.agentguardian.api.model.Investigation;
import com.agentguardian.api.model.Recommendation;
import com.agentguardian.api.model.RiskScore;
import com.agentguardian.api.model.TimelineStep;
import com.agentguardian.api.model.FraudSignal;
import lombok.Data;

import java.util.List;

@Data
public class InvestigationReportDto {
    private Investigation investigation;
    private List<Evidence> evidence;
    private RiskScore riskScore;
    private List<Recommendation> recommendations;
    private List<TimelineStep> timeline;
    private List<FraudSignal> signals;
}
