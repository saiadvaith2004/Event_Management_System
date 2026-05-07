package com.campusevents.backend.dto;

import lombok.Data;
import java.time.LocalDateTime;

@Data
public class EventRequest {
    private String title;
    private String description;
    private LocalDateTime startDatetime;
    private LocalDateTime endDatetime;
    private Long resourceId;
    private Long organizerId;
    private Long clubId;
    private Integer maxParticipants;
}
