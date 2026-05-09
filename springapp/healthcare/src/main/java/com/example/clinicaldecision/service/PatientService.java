package com.example.clinicaldecision.service;

import com.example.clinicaldecision.dto.PatientDataRequest;
import com.example.clinicaldecision.exception.InvalidPatientDataException;
import com.example.clinicaldecision.model.MedicalHistory;
import com.example.clinicaldecision.model.Patient;
import com.example.clinicaldecision.model.VitalSigns;
import com.example.clinicaldecision.repository.PatientRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class PatientService {

    @Autowired
    private PatientRepository patientRepository;

    @Transactional
    public Patient addPatient(PatientDataRequest request) {
        if (request.getAge() == null || request.getAge() < 0) {
            throw new InvalidPatientDataException("Age must be a non-negative integer");
        }

        if (request.getSymptoms() == null || request.getSymptoms().trim().isEmpty()) {
            throw new InvalidPatientDataException("Symptoms cannot be empty");
        }

        if (request.getVitalSigns() == null) {
            throw new InvalidPatientDataException("Vital signs are required");
        }

        Patient patient = new Patient();
        patient.setAge(request.getAge());
        patient.setGender(request.getGender());
        patient.setSymptoms(request.getSymptoms());

        // Map Vital Signs
        VitalSigns vitals = new VitalSigns();
        vitals.setBloodPressure(request.getVitalSigns().getBloodPressure());
        vitals.setHeartRate(request.getVitalSigns().getHeartRate());
        vitals.setTemperature(request.getVitalSigns().getTemperature());
        vitals.setOxygenLevel(request.getVitalSigns().getOxygenLevel());
        patient.setVitalSigns(vitals);

        // Map Medical History
        if (request.getMedicalHistory() != null) {
            MedicalHistory history = new MedicalHistory();
            history.setChronicConditions(request.getMedicalHistory().getChronicConditions());
            history.setAllergies(request.getMedicalHistory().getAllergies());
            history.setMedications(request.getMedicalHistory().getMedications());
            patient.setMedicalHistory(history);
        }

        return patientRepository.save(patient);
    }

    public Patient getPatient(Long id) {
        return patientRepository.findById(id)
            .orElseThrow(() -> new InvalidPatientDataException("Patient not found with id: " + id));
    }
}

