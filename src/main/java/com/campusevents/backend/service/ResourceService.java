package com.campusevents.backend.service;

import com.campusevents.backend.entity.Resource;
import com.campusevents.backend.repository.ResourceRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ResourceService {

    private final ResourceRepository resourceRepo;

    public List<Resource> getAllResources() {
        return resourceRepo.findAll();
    }
}
