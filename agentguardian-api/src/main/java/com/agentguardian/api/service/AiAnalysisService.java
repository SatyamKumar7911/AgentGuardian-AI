package com.agentguardian.api.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.stereotype.Service;

import java.util.UUID;

@Service
public class AiAnalysisService {

    private final ObjectMapper objectMapper = new ObjectMapper();

    /**
     * In a production environment, this method passes the extracted document text 
     * to an LLM (e.g., GPT-4o via Spring AI) and asks it to return a structured JSON response
     * containing entities, fraud signals, and a risk score.
     */
    public JsonNode analyzeDocument(String documentText, String filename) {
        try {
            String lowerText = documentText.toLowerCase() + " " + filename.toLowerCase();
            
            // SIMULATED LLM JSON RESPONSE GENERATION
            // A real LLM would generate this exact structure dynamically based on the prompt.
            StringBuilder json = new StringBuilder();
            json.append("{");
            
            if (lowerText.contains("investment") || lowerText.contains("crypto") || lowerText.contains("return")) {
                json.append("\"type\": \"INVESTMENT_FRAUD\",");
                json.append("\"score\": 85,");
                json.append("\"level\": \"HIGH_RISK\",");
                json.append("\"reasoning\": \"The document contains hallmark indicators of investment fraud, including unrealistic return promises and pressure tactics.\",");
                json.append("\"signals\": [");
                json.append("  {\"type\": \"FRAUD\", \"name\": \"Unrealistic Returns\", \"explanation\": \"Promising high guaranteed returns is mathematically unsustainable.\"}");
                json.append("],");
            } else if (lowerText.contains("job") || lowerText.contains("offer")) {
                json.append("\"type\": \"JOB_SCAM\",");
                json.append("\"score\": 92,");
                json.append("\"level\": \"CRITICAL_THREAT\",");
                json.append("\"reasoning\": \"Detected an advance-fee job scam requiring upfront payment for equipment.\",");
                json.append("\"signals\": [");
                json.append("  {\"type\": \"FRAUD\", \"name\": \"Upfront Payment\", \"explanation\": \"Legitimate employers do not charge candidates for equipment.\"}");
                json.append("],");
            } else {
                json.append("\"type\": \"PHISHING\",");
                json.append("\"score\": 78,");
                json.append("\"level\": \"HIGH_RISK\",");
                json.append("\"reasoning\": \"Suspicious links detected aiming to harvest user credentials.\",");
                json.append("\"signals\": [");
                json.append("  {\"type\": \"FRAUD\", \"name\": \"Suspicious URL\", \"explanation\": \"Link redirects to an unverified domain.\"}");
                json.append("],");
            }
            
            json.append("\"entities\": [");
            if (lowerText.contains("http")) {
                json.append("  {\"type\": \"URL\", \"value\": \"Suspicious Link Found\", \"status\": \"SUSPICIOUS\", \"details\": \"Extracted from document body\"}");
            }
            json.append("]");
            
            json.append("}");
            
            return objectMapper.readTree(json.toString());
        } catch (Exception e) {
            throw new RuntimeException("Failed to parse AI JSON response", e);
        }
    }
}
