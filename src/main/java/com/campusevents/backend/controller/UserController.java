package com.campusevents.backend.controller;

import com.campusevents.backend.entity.User;
import com.campusevents.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {

    private final UserRepository userRepo;

    @GetMapping("/pending")
    public List<User> getPendingUsers() {
        return userRepo.findByApprovedFalse();
    }

    @PatchMapping("/{id}/approve")
    public ResponseEntity<?> approveUser(@PathVariable Long id) {
        User user = userRepo.findById(id).orElseThrow();
        user.setApproved(true);
        userRepo.save(user);
        return ResponseEntity.ok("User approved successfully");
    }

    @PatchMapping("/{id}/reject")
    public ResponseEntity<?> rejectUser(@PathVariable Long id) {
        userRepo.deleteById(id);
        return ResponseEntity.ok("User request rejected and deleted");
    }
}
