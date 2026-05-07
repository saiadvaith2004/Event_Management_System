package com.campusevents.backend.repository;

import com.campusevents.backend.entity.EventRegistration;
import com.campusevents.backend.entity.RegistrationStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface EventRegistrationRepository extends JpaRepository<EventRegistration, Long> {
    long countByEventIdAndStatus(Long eventId, RegistrationStatus status);
    List<EventRegistration> findByEventIdAndStatusOrderByRegistrationDateAsc(Long eventId, RegistrationStatus status);
    Optional<EventRegistration> findByEventIdAndUserId(Long eventId, Long userId);
}
