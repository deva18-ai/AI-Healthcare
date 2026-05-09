package com.example.clinicaldecision.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Entity
@Table(name = "decision_history")
@Getter
@Setter
@NoArgsConstructor
public class DecisionHistory {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private Long patientId;

    @Column(nullable = false)
    private Double riskScore;

    @Column(nullable = false)
    private String riskLevel;

    @Column(nullable = false, length = 2000)
    private String recommendedAction;

    @Column(nullable = false, length = 2000)
    private String explanation;

    @Column(length = 4000)
    private String reasoningFactors;

    @Column(nullable = false)
    private LocalDateTime createdAt = LocalDateTime.now();
}

