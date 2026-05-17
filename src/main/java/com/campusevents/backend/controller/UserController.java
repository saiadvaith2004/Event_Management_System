package com.campusevents.backend.controller;

import com.campusevents.backend.entity.User;
import com.campusevents.backend.repository.UserRepository;
import com.campusevents.backend.service.EmailService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {

    private final UserRepository userRepo;
    private final EmailService emailService;

    @GetMapping("/pending")
    public List<User> getPendingUsers() {
        return userRepo.findByApprovedFalse();
    }

    @PatchMapping("/{id}/approve")
    public ResponseEntity<?> approveUser(@PathVariable Long id) {
        try {
            User user = userRepo.findById(id).orElseThrow();
            user.setApproved(true);
            userRepo.save(user);
            
            try {
                emailService.sendApprovalEmail(user.getEmail(), user.getName());
            } catch (Exception e) {
                // Log the email error but don't fail the approval
                e.printStackTrace();
            }
            
            return ResponseEntity.ok("User approved successfully");
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Approval failed: " + e.getMessage());
        }
    }

    @PatchMapping("/{id}/reject")
    public ResponseEntity<?> rejectUser(@PathVariable Long id) {
        userRepo.deleteById(id);
        return ResponseEntity.ok("User request rejected and deleted");
    }
}
