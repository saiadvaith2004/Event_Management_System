package com.campusevents.backend.controller;

import com.campusevents.backend.entity.EventRegistration;
import com.campusevents.backend.entity.User;
import com.campusevents.backend.service.EventRegistrationService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/registrations")
@RequiredArgsConstructor
public class RegistrationController {

    private final EventRegistrationService registrationService;

    @PostMapping("/events/{id}/register")
    public EventRegistration register(@PathVariable Long id, @RequestBody User user) {
        // In a real app, 'user' would come from SecurityContext
        return registrationService.registerForEvent(id, user);
    }

    @PostMapping("/{id}/cancel")
    public void cancel(@PathVariable Long id) {
        registrationService.cancelRegistration(id);
    }
}
