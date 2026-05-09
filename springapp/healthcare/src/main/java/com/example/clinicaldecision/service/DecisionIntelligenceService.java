package com.example.clinicaldecision.service;

import com.example.clinicaldecision.dto.DecisionResponse;
import com.example.clinicaldecision.dto.RiskEvaluationResult;
import com.example.clinicaldecision.model.MedicalHistory;
import com.example.clinicaldecision.model.VitalSigns;
import com.example.clinicaldecision.util.RiskScoringUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class DecisionIntelligenceService {

    @Autowired
    private RiskScoringUtil riskScoringUtil;

    public DecisionResponse generateDecisions(Long patientId, VitalSigns vitals, String symptoms, MedicalHistory history) {
        RiskEvaluationResult evaluation = riskScoringUtil.calculateRiskScore(vitals, symptoms, history);

        DecisionResponse response = new DecisionResponse();
        response.setRiskScore(evaluation.getScore());
        response.setRiskLevel(evaluation.getRiskLevel());
        response.setReasoningFactors(evaluation.getReasoningFactors());

        if ("HIGH".equals(evaluation.getRiskLevel())) {
            response.setRecommendedAction("Immediate clinical evaluation recommended. Consider emergency department referral if symptoms worsen. Continuous monitoring advised.");
            response.setExplanation("Multiple critical risk factors identified. Urgent medical attention may be required to prevent complications.");
        } else if ("MEDIUM".equals(evaluation.getRiskLevel())) {
            response.setRecommendedAction("Increase monitoring frequency. Consider additional diagnostic tests. Schedule follow-up within 3-5 days.");
            response.setExplanation("Some concerning indicators present. Enhanced monitoring and systematic diagnostic evaluation warranted.");
        } else {
            response.setRecommendedAction("Continue routine monitoring. Schedule follow-up in 1-2 weeks. Provide patient education materials.");
            response.setExplanation("Patient presents with stable vital signs and low-risk symptoms. Standard care protocol recommended.");
        }

        return response;
    }
}
