package com.example.crimeinvestigation.controller;

import com.example.crimeinvestigation.entity.Case;
import com.example.crimeinvestigation.repository.CaseRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/cases")
@CrossOrigin(origins = "*")
public class CaseController {

    @Autowired
    private CaseRepository caseRepository;

    @PostMapping
    public Case addCase(@RequestBody Case c) {
        c.setStatus("UNSOLVED");
        return caseRepository.save(c);
    }

    @GetMapping
    public List<Case> getAllCases() {
        return caseRepository.findAll();
    }

    // ── MISSING endpoint that caused "Failed to load case details" ──
    @GetMapping("/{id}")
    public ResponseEntity<Case> getCaseById(@PathVariable Long id) {
        return caseRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/{id}")
    public ResponseEntity<Case> updateCase(@PathVariable Long id, @RequestBody Case updated) {
        return caseRepository.findById(id).map(existing -> {
            existing.setTitle(updated.getTitle());
            existing.setDescription(updated.getDescription());
            existing.setEvidenceUrl(updated.getEvidenceUrl());
            existing.setStatus(updated.getStatus() != null ? updated.getStatus() : existing.getStatus());
            return ResponseEntity.ok(caseRepository.save(existing));
        }).orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteCase(@PathVariable Long id) {
        if (!caseRepository.existsById(id)) return ResponseEntity.notFound().build();
        caseRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}
