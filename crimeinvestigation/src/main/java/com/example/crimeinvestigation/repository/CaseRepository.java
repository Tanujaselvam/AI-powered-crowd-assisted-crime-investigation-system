package com.example.crimeinvestigation.repository;

import com.example.crimeinvestigation.entity.Case;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CaseRepository extends JpaRepository<Case, Long> {
}