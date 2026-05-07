package com.campusevents.backend.controller;

import com.campusevents.backend.dto.AuthResponse;
import com.campusevents.backend.dto.LoginRequest;
import com.campusevents.backend.dto.RegisterRequest;
import com.campusevents.backend.entity.Role;
import com.campusevents.backend.entity.User;
import com.campusevents.backend.repository.UserRepository;
import com.campusevents.backend.security.JwtUtils;
import com.campusevents.backend.service.EmailService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final UserRepository userRepo;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtils jwtUtils;
    private final EmailService emailService;

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest req) {
        Optional<User> userOpt = userRepo.findByEmail(req.getEmail());
        
        if (userOpt.isPresent()) {
            User user = userOpt.get();
            if (passwordEncoder.matches(req.getPassword(), user.getPasswordHash())) {
                if (!user.isApproved()) {
                    return ResponseEntity.status(403).body("Account pending admin approval");
                }
                String token = jwtUtils.generateToken(user.getEmail());
                return ResponseEntity.ok(new AuthResponse(token, user));
            }
        }
        
        return ResponseEntity.status(401).body("Invalid email or password");
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody RegisterRequest req) {
        if (userRepo.findByEmail(req.getEmail()).isPresent()) {
            return ResponseEntity.status(400).body("Email already exists");
        }

        Role role = Role.STUDENT;
        try {
            if (req.getRole() != null) {
                role = Role.valueOf(req.getRole().toUpperCase());
                // Security: Don't allow ADMIN creation via public register
                if (role == Role.ADMIN) role = Role.CLUB_HEAD;
            }
        } catch (Exception e) {}

        boolean approved = (role == Role.STUDENT);

        User user = User.builder()
                .name(req.getName())
                .email(req.getEmail())
                .passwordHash(passwordEncoder.encode(req.getPassword()))
                .department(req.getDepartment())
                .yearOfStudy(req.getYearOfStudy())
                .role(role)
                .approved(approved)
                .build();

        User savedUser = userRepo.save(user);
        emailService.sendWelcomeEmail(savedUser.getEmail(), savedUser.getName());
        
        if (!approved) {
            return ResponseEntity.ok("Registration successful. Pending admin approval.");
        }

        String token = jwtUtils.generateToken(savedUser.getEmail());
        return ResponseEntity.ok(new AuthResponse(token, savedUser));
    }
}
