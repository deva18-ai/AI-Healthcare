package com.example.clinicaldecision.controller;

import com.example.clinicaldecision.dto.DecisionRequest;
import com.example.clinicaldecision.dto.DecisionResponse;
import com.example.clinicaldecision.model.DecisionHistory;
import com.example.clinicaldecision.model.MedicalHistory;
import com.example.clinicaldecision.model.Patient;
import com.example.clinicaldecision.model.VitalSigns;
import com.example.clinicaldecision.repository.DecisionHistoryRepository;
import com.example.clinicaldecision.repository.PatientRepository;
import com.example.clinicaldecision.service.DecisionIntelligenceService;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class DecisionControllerTest {

    @Mock
    private DecisionIntelligenceService decisionIntelligenceService;

    @Mock
    private PatientRepository patientRepository;

    @Mock
    private DecisionHistoryRepository decisionHistoryRepository;

    @InjectMocks
    private DecisionController decisionController;

    @Test
    void evaluateDecisionUsesPersistedPatientClinicalDataAndStoresHistory() {
        VitalSigns vitals = new VitalSigns();
        vitals.setBloodPressure("190/120");
        vitals.setHeartRate(126);
        vitals.setTemperature(39.6);
        vitals.setOxygenLevel(86);

        MedicalHistory history = new MedicalHistory();
        history.setChronicConditions("Diabetes");

        Patient patient = new Patient();
        patient.setId(42L);
        patient.setAge(70);
        patient.setGender("Male");
        patient.setSymptoms("Chest pain");
        patient.setVitalSigns(vitals);
        patient.setMedicalHistory(history);

        DecisionResponse response = new DecisionResponse();
        response.setRiskScore(1.0);
        response.setRiskLevel("HIGH");
        response.setRecommendedAction("Immediate clinical evaluation recommended.");
        response.setExplanation("Multiple critical risk factors identified.");
        response.setReasoningFactors(List.of("Critical Hypoxia", "Hypertensive Crisis"));

        DecisionRequest request = new DecisionRequest();
        request.setPatientId(42L);

        when(patientRepository.findById(42L)).thenReturn(Optional.of(patient));
        when(decisionIntelligenceService.generateDecisions(42L, vitals, "Chest pain", history))
            .thenReturn(response);

        DecisionResponse actual = decisionController.evaluateDecision(request).getBody();

        assertEquals("HIGH", actual.getRiskLevel());
        assertEquals(1.0, actual.getRiskScore());
        verify(decisionIntelligenceService).generateDecisions(42L, vitals, "Chest pain", history);

        ArgumentCaptor<DecisionHistory> historyCaptor = ArgumentCaptor.forClass(DecisionHistory.class);
        verify(decisionHistoryRepository).save(historyCaptor.capture());
        DecisionHistory savedHistory = historyCaptor.getValue();
        assertEquals(42L, savedHistory.getPatientId());
        assertEquals("HIGH", savedHistory.getRiskLevel());
        assertEquals("Critical Hypoxia; Hypertensive Crisis", savedHistory.getReasoningFactors());
    }
}
