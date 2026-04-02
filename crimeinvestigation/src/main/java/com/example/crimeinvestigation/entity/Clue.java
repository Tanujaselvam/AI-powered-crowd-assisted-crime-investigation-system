package com.example.crimeinvestigation.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

@Entity
@Table(name = "clues")
@JsonIgnoreProperties(ignoreUnknown = true)
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Clue {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long caseId;

    private Long userId;

    @Column(length = 2000)
    private String clueText;

    private Boolean isUnique;

    // Raw similarity score (0.0 - 1.0)
    private Double score;

    // Relevance score 0-100 for frontend badge display
    private Integer relevanceScore;

    private LocalDateTime createdAt;
}
