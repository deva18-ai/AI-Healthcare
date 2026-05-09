package com.example.clinicaldecision.service;

import com.example.clinicaldecision.dto.DecisionResponse;
import com.example.clinicaldecision.dto.ScenarioRequest;
import com.example.clinicaldecision.model.MedicalHistory;
import com.example.clinicaldecision.model.VitalSigns;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class ScenarioSimulationService {

    @Autowired
    private DecisionIntelligenceService decisionIntelligenceService;

    public DecisionResponse simulateScenario(ScenarioRequest request) {
        VitalSigns modifiedVitals = new VitalSigns();
        
        if (request.getModifiedVitals() != null) {
            modifiedVitals.setBloodPressure(
                request.getModifiedVitals().getBloodPressure() != null 
                    ? request.getModifiedVitals().getBloodPressure() 
                    : "120/80"
            );
            modifiedVitals.setHeartRate(
                request.getModifiedVitals().getHeartRate() != null 
                    ? request.getModifiedVitals().getHeartRate() 
                    : 72
            );
            modifiedVitals.setTemperature(
                request.getModifiedVitals().getTemperature() != null 
                    ? request.getModifiedVitals().getTemperature() 
                    : 37.0
            );
            modifiedVitals.setOxygenLevel(
                request.getModifiedVitals().getOxygenLevel() != null 
                    ? request.getModifiedVitals().getOxygenLevel() 
                    : 98
            );
        } else {
            modifiedVitals.setBloodPressure("140/90");
            modifiedVitals.setHeartRate(95);
            modifiedVitals.setTemperature(38.5);
            modifiedVitals.setOxygenLevel(92);
        }

        MedicalHistory history = new MedicalHistory();
        String symptoms = "Worsening condition - " + request.getScenarioType();

        return decisionIntelligenceService.generateDecisions(
            request.getPatientId(), 
            modifiedVitals, 
            symptoms, 
            history
        );
    }
}

