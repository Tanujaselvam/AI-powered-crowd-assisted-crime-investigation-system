package com.example.crimeinvestigation.entity;

import jakarta.persistence.*;
import lombok.*;
import lombok.Builder;

@Entity
@Table(name = "users")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;

    @Column(unique = true)
    private String username;

    private String email;

    private String password;

    // ADMIN or USER
    private String role;
}
