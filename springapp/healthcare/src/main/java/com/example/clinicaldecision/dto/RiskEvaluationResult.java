package com.example.clinicaldecision.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.ArrayList;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class RiskEvaluationResult {
    private double score;
    private String riskLevel;
    private List<String> reasoningFactors = new ArrayList<>();

    public void addReason(String reason) {
        this.reasoningFactors.add(reason);
    }
}
