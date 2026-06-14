export interface Investigation {
  id: string;
  title: string;
  description: string;
  type: string;
  status: string;
  createdAt: string;
  updatedAt: string;
}

export interface Evidence {
  id: string;
  evidenceType: string;
  value: string;
  verificationStatus: string;
  details: string;
}

export interface RiskScore {
  id: string;
  score: number;
  level: string;
  reasoning: string;
}

export interface Recommendation {
  id: string;
  action: string;
  reasoning: string;
}

export interface TimelineStep {
  id: string;
  stepOrder: number;
  title: string;
  description: string;
  timestamp: string;
}

export interface FraudSignal {
  id: string;
  type: 'LEGITIMATE' | 'FRAUD';
  name: string;
  explanation: string;
}

export interface InvestigationReport {
  investigation: Investigation;
  evidence: Evidence[];
  riskScore: RiskScore;
  recommendations: Recommendation[];
  timeline: TimelineStep[];
  signals: FraudSignal[];
}
