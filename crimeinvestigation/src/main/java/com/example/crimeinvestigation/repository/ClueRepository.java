package com.example.crimeinvestigation.repository;

import com.example.crimeinvestigation.entity.Clue;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ClueRepository extends JpaRepository<Clue, Long> {

    List<Clue> findByCaseId(Long caseId);
    List<Clue> findByCaseIdAndIsUniqueTrue(Long caseId);
}
