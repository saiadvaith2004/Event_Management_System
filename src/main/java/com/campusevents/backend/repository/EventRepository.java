package com.campusevents.backend.repository;

import com.campusevents.backend.entity.Event;
import com.campusevents.backend.entity.EventStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface EventRepository extends JpaRepository<Event, Long> {
    List<Event> findByStatusOrderByStartDatetimeAsc(EventStatus status);
    List<Event> findByResourceIdAndStatus(Long resourceId, EventStatus status);
    List<Event> findByOrganizerIdOrderByStartDatetimeAsc(Long organizerId);

    @Query("SELECT COUNT(e) FROM Event e WHERE e.resource.id = :resourceId " +
           "AND e.status != 'REJECTED' " +
           "AND e.status != 'CANCELLED' " +
           "AND e.startDatetime < :endDatetime " +
           "AND e.endDatetime > :startDatetime")
    long countOverlappingEvents(@Param("resourceId") Long resourceId,
                                @Param("startDatetime") LocalDateTime startDatetime,
                                @Param("endDatetime") LocalDateTime endDatetime);
}
