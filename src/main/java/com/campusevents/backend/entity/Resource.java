package com.campusevents.backend.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "resources")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Resource {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    private String type; // e.g., AUDITORIUM, CLASSROOM, LAB

    private Integer capacity;

    private String location;

    @Builder.Default
    private Boolean isAvailable = true;
}
