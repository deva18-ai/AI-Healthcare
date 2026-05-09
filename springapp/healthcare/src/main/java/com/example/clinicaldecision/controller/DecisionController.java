package com.example.clinicaldecision.controller;

import com.example.clinicaldecision.dto.DecisionRequest;
import com.example.clinicaldecision.dto.DecisionResponse;
import com.example.clinicaldecision.model.DecisionHistory;
import com.example.clinicaldecision.model.Patient;
import com.example.clinicaldecision.repository.DecisionHistoryRepository;
import com.example.clinicaldecision.repository.PatientRepository;
import com.example.clinicaldecision.service.DecisionIntelligenceService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

@RestController
@RequestMapping("/api/decision")
@CrossOrigin(origins = "*")
public class DecisionController {

    @Autowired
    private DecisionIntelligenceService decisionIntelligenceService;

    @Autowired
    private PatientRepository patientRepository;

    @Autowired
    private DecisionHistoryRepository decisionHistoryRepository;

    @PostMapping("/evaluate")
    public ResponseEntity<DecisionResponse> evaluateDecision(@Valid @RequestBody DecisionRequest request) {
        Patient patient = patientRepository.findById(request.getPatientId())
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Patient not found"));

        DecisionResponse response = decisionIntelligenceService.generateDecisions(
            patient.getId(), patient.getVitalSigns(), patient.getSymptoms(), patient.getMedicalHistory()
        );

        DecisionHistory decisionHistory = new DecisionHistory();
        decisionHistory.setPatientId(patient.getId());
        decisionHistory.setRiskScore(response.getRiskScore());
        decisionHistory.setRiskLevel(response.getRiskLevel());
        decisionHistory.setRecommendedAction(response.getRecommendedAction());
        decisionHistory.setExplanation(response.getExplanation());
        
        if (response.getReasoningFactors() != null) {
            decisionHistory.setReasoningFactors(String.join("; ", response.getReasoningFactors()));
        }

        decisionHistoryRepository.save(decisionHistory);

        return ResponseEntity.ok(response);
    }
}

