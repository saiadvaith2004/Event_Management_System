package com.campusevents.backend.service;

import com.campusevents.backend.dto.EventRequest;
import com.campusevents.backend.entity.*;
import com.campusevents.backend.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class EventService {

    private final EventRepository eventRepo;
    private final EmailService emailService;
    private final UserRepository userRepo;
    private final ResourceRepository resourceRepo;
    private final ClubRepository clubRepo;

    public List<Event> getAllEvents() {
        return eventRepo.findAll();
    }

    public List<Event> getApprovedEvents() {
        return eventRepo.findByStatusOrderByStartDatetimeAsc(EventStatus.APPROVED);
    }

    public List<Event> getEventsByOrganizer(Long organizerId) {
        return eventRepo.findByOrganizerIdOrderByStartDatetimeAsc(organizerId);
    }

    public Event getEventById(Long id) {
        return eventRepo.findById(id).orElseThrow(() -> new RuntimeException("Event not found"));
    }

    public Event createEvent(EventRequest req) {
        User organizer = userRepo.findById(req.getOrganizerId())
                .orElseThrow(() -> new RuntimeException("Organizer not found"));

        Resource resource = resourceRepo.findById(req.getResourceId())
                .orElseThrow(() -> new RuntimeException("Resource not found"));

        Club club = req.getClubId() != null ? clubRepo.findById(req.getClubId()).orElse(null) : null;

        long overlaps = eventRepo.countOverlappingEvents(
                req.getResourceId(),
                req.getStartDatetime(),
                req.getEndDatetime());

        if (overlaps > 0) {
            throw new RuntimeException(
                    "This venue is already booked or has a pending request for the selected timeframe.");
        }

        Event event = Event.builder()
                .title(req.getTitle())
                .description(req.getDescription())
                .startDatetime(req.getStartDatetime())
                .endDatetime(req.getEndDatetime())
                .organizer(organizer)
                .resource(resource)
                .club(club)
                .status(EventStatus.PENDING)
                .maxParticipants(req.getMaxParticipants())
                .build();

        return eventRepo.save(event);
    }

    public Event updateStatus(Long id, EventStatus status) {
        Event event = getEventById(id);
        event.setStatus(status);
        Event updated = eventRepo.save(event);
        if (updated.getOrganizer() != null) {
            emailService.sendEventStatusEmail(updated.getOrganizer().getEmail(), updated.getTitle(), status.name());
        }
        return updated;
    }

    public void deleteEvent(Long id) {
        eventRepo.deleteById(id);
    }
}
