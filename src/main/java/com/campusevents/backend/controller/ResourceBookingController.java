package com.campusevents.backend.controller;

import com.campusevents.backend.entity.ResourceBooking;
import com.campusevents.backend.service.ResourceBookingService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/bookings")
@RequiredArgsConstructor
public class ResourceBookingController {

    private final ResourceBookingService bookingService;

    @PostMapping
    public ResourceBooking requestBooking(@RequestBody ResourceBooking booking) {
        return bookingService.requestBooking(booking);
    }

    @PatchMapping("/{id}/approve")
    public ResourceBooking approve(@PathVariable Long id) {
        return bookingService.approveBooking(id);
    }

    @PatchMapping("/{id}/reject")
    public ResourceBooking reject(@PathVariable Long id) {
        return bookingService.rejectBooking(id);
    }
}
