package com.example.crimeinvestigation.controller;

import com.example.crimeinvestigation.entity.User;
import com.example.crimeinvestigation.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/auth")
@CrossOrigin(origins = "*")
public class AuthController {

    @Autowired
    private UserRepository userRepository;

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> body) {
        String username = body.get("username");
        String password = body.get("password");
        String requestedRole = body.get("role");

        if (username == null || password == null)
            return ResponseEntity.badRequest().body(Map.of("error", "Username and password required"));

        Optional<User> userOpt = userRepository.findByUsernameAndPassword(username, password);
        if (userOpt.isEmpty())
            return ResponseEntity.status(401).body(Map.of("error", "Invalid credentials"));

        User user = userOpt.get();
        if (requestedRole != null && !requestedRole.equals(user.getRole()))
            return ResponseEntity.status(403).body(Map.of("error", "Access denied for this role"));

        return ResponseEntity.ok(Map.of(
                "id", user.getId(),
                "name", user.getName(),
                "username", user.getUsername(),
                "role", user.getRole()
        ));
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody Map<String, String> body) {
        String name     = body.get("name");
        String username = body.get("username");
        String email    = body.get("email");
        String password = body.get("password");

        if (name == null || username == null || password == null || email == null)
            return ResponseEntity.badRequest().body(Map.of("error", "All fields are required"));

        if (userRepository.findByUsername(username).isPresent())
            return ResponseEntity.status(409).body(Map.of("error", "Username already taken"));

        User user = User.builder()
                .name(name)
                .username(username)
                .email(email)
                .password(password)
                .role("USER")
                .build();

        User saved = userRepository.save(user);
        return ResponseEntity.ok(Map.of(
                "id", saved.getId(),
                "name", saved.getName(),
                "username", saved.getUsername(),
                "role", saved.getRole()
        ));
    }
}
