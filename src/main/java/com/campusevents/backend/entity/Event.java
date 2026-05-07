package com.campusevents.backend.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "events")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Event {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String title;

    @Column(columnDefinition = "TEXT")
    private String description;

    private String imageUrl;

    @Column(name = "start_datetime", nullable = false)
    private LocalDateTime startDatetime;

    @Column(name = "end_datetime", nullable = false)
    private LocalDateTime endDatetime;

    @ManyToOne
    @JoinColumn(name = "resource_id")
    private Resource resource;

    @ManyToOne
    @JoinColumn(name = "organizer_id", nullable = false)
    private User organizer;

    @ManyToOne
    @JoinColumn(name = "club_id")
    private Club club;

    @Enumerated(EnumType.STRING)
    private EventStatus status; // PENDING, APPROVED, REJECTED, CANCELLED, COMPLETED

    @Column(name = "max_participants")
    private Integer maxParticipants;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
}
