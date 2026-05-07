package com.campusevents.backend.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "resource_bookings")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ResourceBooking {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "resource_id", nullable = false)
    private Resource resource;

    @ManyToOne
    @JoinColumn(name = "event_id")
    private Event event;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(name = "start_datetime", nullable = false)
    private LocalDateTime startDatetime;

    @Column(name = "end_datetime", nullable = false)
    private LocalDateTime endDatetime;

    @Enumerated(EnumType.STRING)
    private BookingStatus status; // PENDING, APPROVED, REJECTED, CANCELLED

    private String purpose;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;
}
