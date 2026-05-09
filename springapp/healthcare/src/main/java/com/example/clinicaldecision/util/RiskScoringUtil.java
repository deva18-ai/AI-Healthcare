package com.example.clinicaldecision.util;

import com.example.clinicaldecision.dto.RiskEvaluationResult;
import com.example.clinicaldecision.model.MedicalHistory;
import com.example.clinicaldecision.model.VitalSigns;
import org.springframework.stereotype.Component;

@Component
public class RiskScoringUtil {

    public RiskEvaluationResult calculateRiskScore(VitalSigns vitals, String symptoms, MedicalHistory history) {
        double score = 0.0;
        RiskEvaluationResult result = new RiskEvaluationResult();

        if (vitals == null) {
            result.setScore(0.0);
            result.setRiskLevel("LOW");
            result.addReason("Vital signs were not available for scoring");
            return result;
        }

        // 1. Blood Pressure Analysis (High weight)
        if (vitals.getBloodPressure() != null) {
            String[] bp = vitals.getBloodPressure().split("/");
            if (bp.length == 2) {
                try {
                    int systolic = Integer.parseInt(bp[0].trim());
                    int diastolic = Integer.parseInt(bp[1].trim());
                    
                    // Hypertensive Crisis
                    if (systolic >= 180 || diastolic >= 120) {
                        score += 0.5;
                        result.addReason("Hypertensive Crisis detected (" + vitals.getBloodPressure() + ")");
                    }
                    // Stage 2 Hypertension
                    else if (systolic >= 140 || diastolic >= 90) {
                        score += 0.3;
                        result.addReason("Stage 2 Hypertension (" + vitals.getBloodPressure() + ")");
                    }
                    // Stage 1 Hypertension
                    else if (systolic >= 130 || diastolic >= 80) {
                        score += 0.15;
                    }
                    // Hypotension (Low BP)
                    else if (systolic < 90) {
                        score += 0.25;
                        result.addReason("Hypotension (Low Blood Pressure) detected");
                    }
                } catch (NumberFormatException e) {
                    // Ignore malformed BP
                }
            }
        }

        // 2. Heart Rate (Tachycardia / Bradycardia)
        if (vitals.getHeartRate() > 120) {
            score += 0.35;
            result.addReason("Severe Tachycardia (HR: " + vitals.getHeartRate() + ")");
        } else if (vitals.getHeartRate() > 100) {
            score += 0.2;
            result.addReason("Tachycardia detected");
        } else if (vitals.getHeartRate() < 50) {
            score += 0.3;
            result.addReason("Severe Bradycardia (HR: " + vitals.getHeartRate() + ")");
        } else if (vitals.getHeartRate() < 60) {
            score += 0.15;
        }

        // 3. Temperature (Fever / Hypothermia)
        if (vitals.getTemperature() > 39.5) {
            score += 0.4;
            result.addReason("High Fever detected (" + vitals.getTemperature() + " C)");
        } else if (vitals.getTemperature() > 38.0) {
            score += 0.2;
            result.addReason("Fever detected");
        } else if (vitals.getTemperature() < 35.5) {
            score += 0.3;
            result.addReason("Hypothermia detected (" + vitals.getTemperature() + " C)");
        }

        // 4. Oxygen Level (Critical indicator)
        if (vitals.getOxygenLevel() < 88) {
            score += 0.6;
            result.addReason("Critical Hypoxia (SpO2: " + vitals.getOxygenLevel() + "%)");
        } else if (vitals.getOxygenLevel() < 92) {
            score += 0.4;
            result.addReason("Hypoxia detected (SpO2: " + vitals.getOxygenLevel() + "%)");
        } else if (vitals.getOxygenLevel() < 95) {
            score += 0.2;
        }

        // 5. Symptoms Severity (Keyword weighted)
        if (symptoms != null) {
            String lower = symptoms.toLowerCase();
            if (lower.contains("chest pain") || lower.contains("shortness of breath") || lower.contains("unconscious")) {
                score += 0.5;
                result.addReason("High-risk symptoms reported (e.g., chest pain, breathing difficulty)");
            } else if (lower.contains("severe") || lower.contains("acute")) {
                score += 0.3;
                result.addReason("Severe symptoms reported");
            }
        }

        // 6. Medical History Comorbidities
        if (history != null && history.getChronicConditions() != null) {
            String chronic = history.getChronicConditions().toLowerCase();
            if (chronic.contains("diabetes") || chronic.contains("heart") || chronic.contains("hypertension")) {
                score += 0.2;
                result.addReason("Significant comorbidities present (Diabetes/Heart/Hypertension)");
            }
        }

        double finalScore = Math.min(score, 1.0);
        result.setScore(finalScore);
        
        if (finalScore >= 0.7) result.setRiskLevel("HIGH");
        else if (finalScore >= 0.3) result.setRiskLevel("MEDIUM");
        else result.setRiskLevel("LOW");

        return result;
    }
}
