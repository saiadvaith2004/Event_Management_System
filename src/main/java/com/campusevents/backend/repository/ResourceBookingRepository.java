package com.campusevents.backend.repository;

import com.campusevents.backend.entity.ResourceBooking;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface ResourceBookingRepository extends JpaRepository<ResourceBooking, Long> {

    @Query("""
        SELECT rb FROM ResourceBooking rb
        WHERE rb.resource.id = :resourceId
          AND rb.status = 'APPROVED'
          AND rb.startDatetime < :endTime
          AND rb.endDatetime   > :startTime
    """)
    List<ResourceBooking> findConflictingApprovedBookings(
            @Param("resourceId") Long resourceId,
            @Param("startTime") LocalDateTime startTime,
            @Param("endTime") LocalDateTime endTime);
}
