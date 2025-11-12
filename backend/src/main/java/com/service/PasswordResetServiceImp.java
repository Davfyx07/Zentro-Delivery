package com.service;

import java.time.LocalDateTime;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.model.PasswordResetToken;
import com.model.User;
import com.repository.PasswordResetTokenRepository;
import com.repository.UserRepository;

@Service
public class PasswordResetServiceImp implements PasswordResetService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordResetTokenRepository tokenRepository;

    @Autowired
    private EmailService emailService;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    @Transactional
    public void createPasswordResetToken(String email) throws Exception {
        User user = userRepository.findByEmail(email);
        if (user == null) {
            throw new Exception("No existe un usuario con ese email");
        }

        // Generar token único
        String token = UUID.randomUUID().toString();
        
        // Eliminar tokens antiguos del usuario
        tokenRepository.deleteByUserId(user.getId());

        // Crear nuevo token con expiración de 1 hora
        PasswordResetToken resetToken = new PasswordResetToken();
        resetToken.setToken(token);
        resetToken.setUser(user);
        resetToken.setExpiryDate(LocalDateTime.now().plusHours(1));
        
        tokenRepository.save(resetToken);

        // Enviar email
        emailService.sendPasswordResetEmail(user.getEmail(), token);
    }

    @Override
    @Transactional
    public void resetPassword(String token, String newPassword) throws Exception {
        PasswordResetToken resetToken = tokenRepository.findByToken(token)
                .orElseThrow(() -> new Exception("Token inválido"));

        if (resetToken.isExpired()) {
            throw new Exception("El token ha expirado");
        }

        User user = resetToken.getUser();
        user.setPassword(passwordEncoder.encode(newPassword));
        userRepository.save(user);

        // Eliminar el token usado
        tokenRepository.delete(resetToken);
    }
}
