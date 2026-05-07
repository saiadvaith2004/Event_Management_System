package com.campusevents.backend.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "event_registrations")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class EventRegistration {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "event_id", nullable = false)
    private Event event;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Enumerated(EnumType.STRING)
    private RegistrationStatus status; // CONFIRMED, WAITLISTED, CANCELLED

    @CreationTimestamp
    @Column(name = "registration_date", updatable = false)
    private LocalDateTime registrationDate;
}
