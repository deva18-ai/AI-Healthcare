package com.example.clinicaldecision.repository;

import com.example.clinicaldecision.model.DecisionHistory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface DecisionHistoryRepository extends JpaRepository<DecisionHistory, Long> {
    List<DecisionHistory> findByPatientIdOrderByCreatedAtDesc(Long patientId);
}

