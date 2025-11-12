package com.service;

import org.springframework.stereotype.Service;

@Service
public class EmailServiceImp implements EmailService {

    @Override
    public void sendPasswordResetEmail(String toEmail, String resetToken) {
        // Email sending via Resend was removed.
        // Current behavior: no-op logging to allow the app to continue running.
        String resetLink = "https://zentro-delivery.vercel.app/reset-password?token=" + resetToken;
        String subject = "🔐 Recupera tu contraseña - Zentro Delivery";

        System.out.println("[EmailService] (disabled) Would send password reset to: " + toEmail);
        System.out.println("[EmailService] Subject: " + subject);
        System.out.println("[EmailService] Reset link: " + resetLink);

        // TODO: replace this implementation with SMTP (JavaMailSender) or another provider.
    }
}
