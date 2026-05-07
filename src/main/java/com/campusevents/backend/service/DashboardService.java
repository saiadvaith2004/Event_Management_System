package com.campusevents.backend.service;

import com.campusevents.backend.repository.EventRegistrationRepository;
import com.campusevents.backend.repository.EventRepository;
import com.campusevents.backend.repository.ResourceRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class DashboardService {

    private final EventRepository eventRepo;
    private final EventRegistrationRepository registrationRepo;
    private final ResourceRepository resourceRepo;

    public Map<String, Long> getStats() {
        Map<String, Long> stats = new HashMap<>();
        stats.put("totalEvents", eventRepo.count());
        stats.put("totalRegistrations", registrationRepo.count());
        stats.put("totalResources", resourceRepo.count());
        return stats;
    }
}
