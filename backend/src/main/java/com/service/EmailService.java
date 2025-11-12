package com.service;

public interface EmailService {
    
    void sendPasswordResetEmail(String toEmail, String resetToken);
    
}
