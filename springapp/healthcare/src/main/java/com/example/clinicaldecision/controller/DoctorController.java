package com.example.clinicaldecision.controller;

import com.example.clinicaldecision.model.DecisionHistory;
import com.example.clinicaldecision.repository.DecisionHistoryRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/doctor")
@CrossOrigin(origins = "*")
public class DoctorController {

    @Autowired
    private DecisionHistoryRepository decisionHistoryRepository;

    @GetMapping("/decisions/{patientId}")
    public ResponseEntity<List<DecisionHistory>> getDecisionHistory(@PathVariable Long patientId) {
        List<DecisionHistory> history = decisionHistoryRepository.findByPatientIdOrderByCreatedAtDesc(patientId);
        return ResponseEntity.ok(history);
    }
}

