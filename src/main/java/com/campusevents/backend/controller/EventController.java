package com.campusevents.backend.controller;

import com.campusevents.backend.dto.EventRequest;
import com.campusevents.backend.entity.Event;
import com.campusevents.backend.entity.EventStatus;
import com.campusevents.backend.service.EventService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/events")
@RequiredArgsConstructor
public class EventController {

    private final EventService eventService;

    @PostMapping("/upload")
    public ResponseEntity<String> uploadImage(@RequestParam("file") MultipartFile file) {
        try {
            String fileName = UUID.randomUUID().toString() + "_" + file.getOriginalFilename();
            Path path = Paths.get("uploads/events/" + fileName);
            Files.write(path, file.getBytes());
            return ResponseEntity.ok("/uploads/events/" + fileName);
        } catch (IOException e) {
            return ResponseEntity.status(500).body("Upload failed");
        }
    }

    @GetMapping
    public List<Event> listEvents() {
        return eventService.getApprovedEvents();
    }

    @GetMapping("/all")
    public List<Event> listAllEvents() {
        return eventService.getAllEvents();
    }

    @GetMapping("/my-events/{organizerId}")
    public List<Event> listMyEvents(@PathVariable Long organizerId) {
        return eventService.getEventsByOrganizer(organizerId);
    }

    @GetMapping("/{id}")
    public Event getEventDetails(@PathVariable Long id) {
        return eventService.getEventById(id);
    }

    @PostMapping
    public Event createEvent(@RequestBody EventRequest eventRequest) {
        return eventService.createEvent(eventRequest);
    }

    @PatchMapping("/{id}/approve")
    public Event approveEvent(@PathVariable Long id) {
        return eventService.updateStatus(id, EventStatus.APPROVED);
    }

    @PatchMapping("/{id}/reject")
    public Event rejectEvent(@PathVariable Long id) {
        return eventService.updateStatus(id, EventStatus.REJECTED);
    }

    @DeleteMapping("/{id}")
    public void deleteEvent(@PathVariable Long id) {
        eventService.deleteEvent(id);
    }
}
