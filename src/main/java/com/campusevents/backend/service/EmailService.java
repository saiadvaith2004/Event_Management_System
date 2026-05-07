package com.campusevents.backend.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Slf4j
public class EmailService {

    // private final JavaMailSender mailSender; // Uncomment for real SMTP

    public void sendEmail(String to, String subject, String body) {
        log.info("📧 SENDING EMAIL TO: {}", to);
        log.info("📝 SUBJECT: {}", subject);
        log.info("📄 BODY: \n{}", body);
        
        /* 
        // Real implementation:
        SimpleMailMessage message = new SimpleMailMessage();
        message.setFrom("no-reply@campusevents.edu");
        message.setTo(to);
        message.setSubject(subject);
        message.setText(body);
        mailSender.send(message);
        */
    }

    public void sendWelcomeEmail(String email, String name) {
        String body = String.format("Hi %s,\n\nWelcome to Campus Events! Your account has been successfully created. Explore upcoming events and stay connected with your campus community.", name);
        sendEmail(email, "Welcome to Campus Events!", body);
    }

    public void sendEventStatusEmail(String email, String eventTitle, String status) {
        String body = String.format("Hello,\n\nYour event request for '%s' has been %s by the administrator.", eventTitle, status.toLowerCase());
        sendEmail(email, "Event Status Update", body);
    }
}
