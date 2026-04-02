package com.example.crimeinvestigation.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "cases")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Case {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String title;

    @Column(length = 3000)
    private String description;

    private String evidenceUrl;

    // UNSOLVED | SOLVED | CLOSED
    private String status;

    private Long createdBy;
}
