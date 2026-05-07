package com.campusevents.backend.config;

import com.campusevents.backend.entity.*;
import com.campusevents.backend.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Configuration
@RequiredArgsConstructor
public class DataSeeder {

    @Bean
    CommandLineRunner initDatabase(
            UserRepository userRepo,
            ClubRepository clubRepo,
            ResourceRepository resourceRepo,
            EventRepository eventRepo,
            PasswordEncoder passwordEncoder) {
        return args -> {
            // 1. Create or Update Users
            User admin = userRepo.findByEmail("admin@campus.edu").orElse(null);
            if (admin == null) {
                admin = User.builder()
                        .name("Admin User")
                        .email("admin@campus.edu")
                        .passwordHash(passwordEncoder.encode("password"))
                        .role(Role.ADMIN)
                        .department("Administration")
                        .approved(true)
                        .build();
            } else {
                admin.setPasswordHash(passwordEncoder.encode("password"));
                admin.setApproved(true);
                admin.setRole(Role.ADMIN);
            }
            userRepo.save(admin);

            User clubHead = userRepo.findByEmail("advaith@campus.edu").orElse(null);
            if (clubHead == null) {
                clubHead = User.builder()
                        .name("Sai Advaith")
                        .email("advaith@campus.edu")
                        .passwordHash(passwordEncoder.encode("password"))
                        .role(Role.CLUB_HEAD)
                        .department("Computer Science")
                        .yearOfStudy(3)
                        .approved(true)
                        .build();
            } else {
                clubHead.setPasswordHash(passwordEncoder.encode("password"));
                clubHead.setApproved(true);
                clubHead.setRole(Role.CLUB_HEAD);
            }
            userRepo.save(clubHead);

            User clubHead2 = userRepo.findByEmail("jane@campus.edu")
                    .orElseGet(() -> userRepo.save(User.builder()
                            .name("Jane Smith")
                            .email("jane@campus.edu")
                            .passwordHash(passwordEncoder.encode("password"))
                            .role(Role.CLUB_HEAD)
                            .department("Physics")
                            .yearOfStudy(4)
                            .approved(true)
                            .build()));

            if (userRepo.count() > 0 && eventRepo.count() > 0) return;

            // 2. Create Clubs if not exist
            if (clubRepo.count() == 0) {
                Club techClub = clubRepo.save(Club.builder()
                        .name("Tech Pioneers")
                        .description("Exploring the future of technology and AI.")
                        .clubHead(clubHead)
                        .build());
                
                Club artsClub = clubRepo.save(Club.builder()
                        .name("Creative Arts")
                        .description("Expressing creativity through various art forms.")
                        .clubHead(clubHead2)
                        .build());

                // 3. Create Resources
                Resource auditorium = resourceRepo.save(Resource.builder()
                        .name("Main Auditorium")
                        .type("Venue")
                        .location("Block A")
                        .capacity(500)
                        .isAvailable(true)
                        .build());

                Resource lab = resourceRepo.save(Resource.builder()
                        .name("Innovation Lab")
                        .type("Lab")
                        .location("Block C")
                        .capacity(50)
                        .isAvailable(true)
                        .build());

                // 4. Create Events
                Event hackathon = Event.builder()
                        .title("Campus Hackathon 2024")
                        .description("A 24-hour coding challenge to solve real-world campus problems.")
                        .startDatetime(LocalDateTime.now().plusDays(2))
                        .endDatetime(LocalDateTime.now().plusDays(3))
                        .status(EventStatus.APPROVED)
                        .maxParticipants(100)
                        .organizer(clubHead)
                        .club(techClub)
                        .resource(auditorium)
                        .build();

                Event workshop = Event.builder()
                        .title("React & Tailwind Workshop")
                        .description("Learn modern web development with experts.")
                        .startDatetime(LocalDateTime.now().plusDays(5))
                        .endDatetime(LocalDateTime.now().plusDays(5).plusHours(4))
                        .status(EventStatus.APPROVED)
                        .maxParticipants(50)
                        .organizer(clubHead)
                        .club(techClub)
                        .resource(lab)
                        .build();

                eventRepo.saveAll(List.of(hackathon, workshop));
                System.out.println("Database seeded with sample data!");
            }
        };
    }
}
