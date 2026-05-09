package com.example.clinicaldecision.dto;

import jakarta.validation.Valid;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class PatientDataRequest {

    @NotNull(message = "Age is required")
    @Min(value = 0, message = "Age must be at least 0")
    @Max(value = 150, message = "Age must be less than 150")
    private Integer age;

    @NotBlank(message = "Gender is required")
    private String gender;

    @NotBlank(message = "Symptoms description is required")
    private String symptoms;

    @NotNull(message = "Vital signs are required")
    @Valid
    private VitalSignsRequest vitalSigns;

    private MedicalHistoryRequest medicalHistory;

    @Getter
    @Setter
    public static class VitalSignsRequest {
        @NotBlank(message = "Blood pressure is required")
        @Pattern(regexp = "^\\d{2,3}/\\d{2,3}$", message = "Blood pressure must be in format '120/80'")
        private String bloodPressure;

        @NotNull(message = "Heart rate is required")
        @Min(value = 20, message = "Heart rate must be at least 20")
        @Max(value = 250, message = "Heart rate must be less than 250")
        private Integer heartRate;

        @NotNull(message = "Temperature is required")
        @Min(value = 30, message = "Temperature must be at least 30 C")
        @Max(value = 45, message = "Temperature must be less than 45 C")
        private Double temperature;

        @NotNull(message = "Oxygen level is required")
        @Min(value = 50, message = "Oxygen level must be at least 50%")
        @Max(value = 100, message = "Oxygen level must be at most 100%")
        private Integer oxygenLevel;
    }

    @Getter
    @Setter
    public static class MedicalHistoryRequest {
        private String chronicConditions;
        private String allergies;
        private String medications;
    }
}

