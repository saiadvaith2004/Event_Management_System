package com.campusevents.backend.service;

import com.campusevents.backend.entity.Event;
import com.campusevents.backend.entity.EventRegistration;
import com.campusevents.backend.entity.RegistrationStatus;
import com.campusevents.backend.entity.User;
import com.campusevents.backend.repository.EventRegistrationRepository;
import com.campusevents.backend.repository.EventRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class EventRegistrationService {

    private final EventRegistrationRepository registrationRepo;
    private final EventRepository eventRepo;

    @Transactional
    public EventRegistration registerForEvent(Long eventId, User user) {
        Event event = eventRepo.findById(eventId)
                .orElseThrow(() -> new RuntimeException("Event not found"));

        long confirmedCount = registrationRepo.countByEventIdAndStatus(eventId, RegistrationStatus.CONFIRMED);

        RegistrationStatus status = (confirmedCount < event.getMaxParticipants()) 
                ? RegistrationStatus.CONFIRMED 
                : RegistrationStatus.WAITLISTED;

        EventRegistration registration = EventRegistration.builder()
                .event(event)
                .user(user)
                .status(status)
                .build();

        return registrationRepo.save(registration);
    }

    @Transactional
    public void cancelRegistration(Long registrationId) {
        EventRegistration registration = registrationRepo.findById(registrationId)
                .orElseThrow(() -> new RuntimeException("Registration not found"));

        registration.setStatus(RegistrationStatus.CANCELLED);
        registrationRepo.save(registration);

        // If a confirmed registration was cancelled, promote the first person from waitlist
        if (registration.getStatus() == RegistrationStatus.CONFIRMED) {
            promoteFromWaitlist(registration.getEvent().getId());
        }
    }

    private void promoteFromWaitlist(Long eventId) {
        List<EventRegistration> waitlist = registrationRepo
                .findByEventIdAndStatusOrderByRegistrationDateAsc(eventId, RegistrationStatus.WAITLISTED);

        if (!waitlist.isEmpty()) {
            EventRegistration firstInWaitlist = waitlist.get(0);
            firstInWaitlist.setStatus(RegistrationStatus.CONFIRMED);
            registrationRepo.save(firstInWaitlist);
        }
    }
}
