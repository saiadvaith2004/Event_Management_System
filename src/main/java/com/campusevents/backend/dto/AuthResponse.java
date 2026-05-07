package com.campusevents.backend.dto;

import com.campusevents.backend.entity.User;
import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class AuthResponse {
    private String token;
    private User user;
}
