package com.service;

public interface PasswordResetService {
    
    void createPasswordResetToken(String email) throws Exception;
    
    void resetPassword(String token, String newPassword) throws Exception;
    
}
