package com.example.clinicaldecision.dto;

import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
public class DecisionResponse {

    private Double riskScore;
    private String riskLevel;
    private String recommendedAction;
    private String explanation;
    private List<String> reasoningFactors;
}

