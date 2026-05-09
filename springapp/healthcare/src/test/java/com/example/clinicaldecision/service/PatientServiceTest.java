package com.example.clinicaldecision.service;

import com.example.clinicaldecision.dto.PatientDataRequest;
import com.example.clinicaldecision.model.Patient;
import com.example.clinicaldecision.repository.PatientRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class PatientServiceTest {

    @Mock
    private PatientRepository patientRepository;

    @InjectMocks
    private PatientService patientService;

    @Test
    void addPatientPersistsVitalsAndMedicalHistory() {
        PatientDataRequest request = new PatientDataRequest();
        request.setAge(64);
        request.setGender("Female");
        request.setSymptoms("Chest pain and shortness of breath");

        PatientDataRequest.VitalSignsRequest vitals = new PatientDataRequest.VitalSignsRequest();
        vitals.setBloodPressure("185/122");
        vitals.setHeartRate(128);
        vitals.setTemperature(39.8);
        vitals.setOxygenLevel(86);
        request.setVitalSigns(vitals);

        PatientDataRequest.MedicalHistoryRequest history = new PatientDataRequest.MedicalHistoryRequest();
        history.setChronicConditions("Diabetes, hypertension");
        history.setAllergies("Penicillin");
        history.setMedications("Metformin");
        request.setMedicalHistory(history);

        when(patientRepository.save(any(Patient.class))).thenAnswer(invocation -> invocation.getArgument(0));

        Patient patient = patientService.addPatient(request);

        assertEquals(64, patient.getAge());
        assertEquals("Female", patient.getGender());
        assertEquals("Chest pain and shortness of breath", patient.getSymptoms());
        assertNotNull(patient.getVitalSigns());
        assertEquals("185/122", patient.getVitalSigns().getBloodPressure());
        assertEquals(128, patient.getVitalSigns().getHeartRate());
        assertEquals(39.8, patient.getVitalSigns().getTemperature());
        assertEquals(86, patient.getVitalSigns().getOxygenLevel());
        assertNotNull(patient.getMedicalHistory());
        assertEquals("Diabetes, hypertension", patient.getMedicalHistory().getChronicConditions());
        assertEquals("Penicillin", patient.getMedicalHistory().getAllergies());
        assertEquals("Metformin", patient.getMedicalHistory().getMedications());
    }
}
