package com.example.clinicaldecision.controller;

import com.example.clinicaldecision.dto.DecisionResponse;
import com.example.clinicaldecision.dto.ScenarioRequest;
import com.example.clinicaldecision.service.ScenarioSimulationService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/scenario")
@CrossOrigin(origins = "*")
public class ScenarioController {

    @Autowired
    private ScenarioSimulationService scenarioSimulationService;

    @PostMapping("/simulate")
    public ResponseEntity<DecisionResponse> simulateScenario(@Valid @RequestBody ScenarioRequest request) {
        DecisionResponse response = scenarioSimulationService.simulateScenario(request);
        return ResponseEntity.ok(response);
    }
}

