package com.campusevents.backend.controller;

import com.campusevents.backend.entity.Resource;
import com.campusevents.backend.service.ResourceService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/resources")
@RequiredArgsConstructor
public class ResourceController {

    private final ResourceService resourceService;

    @GetMapping
    public List<Resource> listResources() {
        return resourceService.getAllResources();
    }
}
