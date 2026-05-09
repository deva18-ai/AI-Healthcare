package com.example.clinicaldecision.util;

import com.example.clinicaldecision.dto.RiskEvaluationResult;
import com.example.clinicaldecision.model.MedicalHistory;
import com.example.clinicaldecision.model.VitalSigns;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;

class RiskScoringUtilTest {

    private RiskScoringUtil riskScoringUtil;

    @BeforeEach
    void setUp() {
        riskScoringUtil = new RiskScoringUtil();
    }

    @Test
    void testLowRiskScenario() {
        VitalSigns vitals = new VitalSigns();
        vitals.setBloodPressure("120/80");
        vitals.setHeartRate(70);
        vitals.setTemperature(36.6);
        vitals.setOxygenLevel(98);

        RiskEvaluationResult result = riskScoringUtil.calculateRiskScore(vitals, "Mild cough", null);

        assertEquals("LOW", result.getRiskLevel());
        assertTrue(result.getScore() < 0.3);
        assertTrue(result.getReasoningFactors().isEmpty());
    }

    @Test
    void testHighRiskScenario_Hypoxia() {
        VitalSigns vitals = new VitalSigns();
        vitals.setBloodPressure("120/80");
        vitals.setHeartRate(70);
        vitals.setTemperature(36.6);
        vitals.setOxygenLevel(85); // Critical

        RiskEvaluationResult result = riskScoringUtil.calculateRiskScore(vitals, "Shortness of breath", null);

        assertEquals("HIGH", result.getRiskLevel());
        assertTrue(result.getReasoningFactors().contains("Critical Hypoxia (SpO2: 85%)"));
    }

    @Test
    void testMediumRiskScenario_Hypertension() {
        VitalSigns vitals = new VitalSigns();
        vitals.setBloodPressure("150/95"); // Stage 2
        vitals.setHeartRate(85);
        vitals.setTemperature(37.0);
        vitals.setOxygenLevel(96);

        RiskEvaluationResult result = riskScoringUtil.calculateRiskScore(vitals, "Headache", null);

        assertEquals("MEDIUM", result.getRiskLevel());
        assertTrue(result.getReasoningFactors().stream().anyMatch(r -> r.contains("Stage 2 Hypertension")));
    }

    @Test
    void testHighRiskScenario_MultipleFactors() {
        VitalSigns vitals = new VitalSigns();
        vitals.setBloodPressure("190/110"); // Crisis
        vitals.setHeartRate(110);
        vitals.setTemperature(38.5);
        vitals.setOxygenLevel(92);

        MedicalHistory history = new MedicalHistory();
        history.setChronicConditions("Diabetes, Heart Disease");

        RiskEvaluationResult result = riskScoringUtil.calculateRiskScore(vitals, "Chest pain", history);

        assertEquals("HIGH", result.getRiskLevel());
        assertTrue(result.getReasoningFactors().size() >= 3);
        assertTrue(result.getReasoningFactors().contains("High-risk symptoms reported (e.g., chest pain, breathing difficulty)"));
    }
}
