package org.debatespeak.authify.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

@Service
public class EmailService {

    private final JavaMailSender mailSender;

    @Value("${spring.mail.username}")
    private String fromEmail;

    public EmailService(JavaMailSender mailSender) {
        this.mailSender = mailSender;
    }

    @Async
    public void sendVerificationCode(String toEmail, String code) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setFrom(fromEmail);
        message.setTo(toEmail);
        message.setSubject("DebateSpeak - Verify your email address");
        message.setText("Your DebateSpeak verification code is: " + code + "\n\nThis code is single-use.");
        mailSender.send(message);
    }

    @Async
    public void sendPasswordResetCode(String toEmail, String code) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setFrom(fromEmail);
        message.setTo(toEmail);
        message.setSubject("DebateSpeak - Reset your password");
        message.setText("Your DebateSpeak password reset code is: " + code + "\n\nIf you did not request this, please ignore this email.");
        mailSender.send(message);
    }
}