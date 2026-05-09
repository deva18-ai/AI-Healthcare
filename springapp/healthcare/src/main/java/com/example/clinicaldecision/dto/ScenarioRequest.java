package com.example.clinicaldecision.dto;

import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ScenarioRequest {

    @NotNull
    private Long patientId;

    @NotNull
    private String scenarioType;

    private VitalSignsModification modifiedVitals;

    @Getter
    @Setter
    public static class VitalSignsModification {
        private String bloodPressure;
        private Integer heartRate;
        private Double temperature;
        private Integer oxygenLevel;
    }
}

