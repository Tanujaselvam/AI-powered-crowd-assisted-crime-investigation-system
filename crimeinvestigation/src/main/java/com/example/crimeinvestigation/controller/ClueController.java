package com.example.crimeinvestigation.controller;

import com.example.crimeinvestigation.entity.Clue;
import com.example.crimeinvestigation.repository.ClueRepository;
import com.example.crimeinvestigation.service.ClueAIService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/clues")
@CrossOrigin(origins = "*")
public class ClueController {

    @Autowired
    private ClueRepository clueRepository;

    // ── POST /clues — Submit a new clue ──────────────────────────────
    @PostMapping
    public ResponseEntity<?> addClue(@RequestBody Clue clue) {

        // Validate input
        if (clue.getClueText() == null || clue.getClueText().trim().isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of("error", "Clue text cannot be empty"));
        }
        if (clue.getCaseId() == null) {
            return ResponseEntity.badRequest().body(Map.of("error", "Case ID is required"));
        }

        clue.setClueText(clue.getClueText().trim());
        clue.setCreatedAt(LocalDateTime.now());

        List<Clue> existingClues = clueRepository.findByCaseId(clue.getCaseId());

        boolean isDuplicate = false;
        double maxScore = 0;

        for (Clue existing : existingClues) {
            double similarity = ClueAIService.calculateSimilarity(
                    clue.getClueText(), existing.getClueText());

            if (similarity > 0.7) {
                isDuplicate = true;
            }
            if (similarity > maxScore) {
                maxScore = similarity;
            }
        }

        // Reject duplicate clues with 409 Conflict
        if (isDuplicate) {
            return ResponseEntity.status(409).body(
                Map.of("error", "Duplicate clue — this information is already recorded.")
            );
        }

        clue.setIsUnique(true);
        clue.setScore(maxScore);
        // Higher uniqueness = higher relevance score
        clue.setRelevanceScore((int) Math.round((1.0 - maxScore) * 100));

        return ResponseEntity.ok(clueRepository.save(clue));
    }

    // ── GET /clues — All clues across all cases (admin view) ──────
    @GetMapping
    public List<Clue> getAllClues() {
        return clueRepository.findAll();
    }

    // ── GET /clues/case/{caseId} — All clues for a case (public view) ─
    @GetMapping("/case/{caseId}")
    public List<Clue> getAllCluesByCaseId(@PathVariable Long caseId) {
        System.out.println("[DEBUG] GET /clues/case/" + caseId + " called");
        List<Clue> clues = clueRepository.findByCaseId(caseId);
        System.out.println("[DEBUG] Found " + clues.size() + " clues for case " + caseId);
        return clues;
    }

    // ── GET /clues/unique/{caseId} — Only AI-verified unique clues ────
    @GetMapping("/unique/{caseId}")
    public List<Clue> getUniqueClues(@PathVariable Long caseId) {
        return clueRepository.findByCaseIdAndIsUniqueTrue(caseId);
    }
}
