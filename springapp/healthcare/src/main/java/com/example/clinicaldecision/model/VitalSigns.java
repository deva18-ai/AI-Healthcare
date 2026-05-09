package com.example.clinicaldecision.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "vital_signs")
@Getter
@Setter
@NoArgsConstructor
public class VitalSigns {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String bloodPressure;

    @Column(nullable = false)
    private int heartRate;

    @Column(nullable = false)
    private double temperature;

    @Column(nullable = false)
    private int oxygenLevel;
}

