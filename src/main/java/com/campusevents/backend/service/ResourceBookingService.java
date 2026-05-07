package com.campusevents.backend.service;

import com.campusevents.backend.entity.BookingStatus;
import com.campusevents.backend.entity.ResourceBooking;
import com.campusevents.backend.repository.ResourceBookingRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ResourceBookingService {

    private final ResourceBookingRepository bookingRepo;

    @Transactional
    public ResourceBooking requestBooking(ResourceBooking booking) {
        booking.setStatus(BookingStatus.PENDING);
        return bookingRepo.save(booking);
    }

    @Transactional
    public ResourceBooking approveBooking(Long bookingId) {
        ResourceBooking booking = bookingRepo.findById(bookingId)
                .orElseThrow(() -> new RuntimeException("Booking not found"));

        List<ResourceBooking> conflicts = bookingRepo.findConflictingApprovedBookings(
                booking.getResource().getId(),
                booking.getStartDatetime(),
                booking.getEndDatetime()
        );

        if (!conflicts.isEmpty()) {
            throw new RuntimeException("Resource is already booked for this time period");
        }

        booking.setStatus(BookingStatus.APPROVED);
        return bookingRepo.save(booking);
    }

    @Transactional
    public ResourceBooking rejectBooking(Long bookingId) {
        ResourceBooking booking = bookingRepo.findById(bookingId)
                .orElseThrow(() -> new RuntimeException("Booking not found"));

        booking.setStatus(BookingStatus.REJECTED);
        return bookingRepo.save(booking);
    }
}
