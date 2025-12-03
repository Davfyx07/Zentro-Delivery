package com.service;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

@Service
public class EmailServiceImp implements EmailService {

    @Autowired
    private JavaMailSender javaMailSender;

    @Override
    public void sendPasswordResetEmail(String toEmail, String resetToken) {
        try {
            MimeMessage message = javaMailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true);

            helper.setTo(toEmail);
            helper.setSubject("🔐 Recupera tu contraseña - Zentro Delivery");

            String resetLink = "https://zentro-delivery.vercel.app/reset-password?token=" + resetToken;

            String htmlContent = "<div style='font-family: Arial, sans-serif; padding: 20px; color: #333;'>"
                    + "<h2>Recuperación de Contraseña</h2>"
                    + "<p>Hola,</p>"
                    + "<p>Hemos recibido una solicitud para restablecer tu contraseña en Zentro Delivery.</p>"
                    + "<p>Haz clic en el siguiente botón para crear una nueva contraseña:</p>"
                    + "<a href='" + resetLink
                    + "' style='background-color: #ff6b6b; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block; margin: 10px 0;'>Restablecer Contraseña</a>"
                    + "<p>Si no solicitaste este cambio, puedes ignorar este correo.</p>"
                    + "<p>El enlace expirará en 10 minutos.</p>"
                    + "<hr>"
                    + "<p style='font-size: 12px; color: #777;'>Zentro Delivery Team</p>"
                    + "</div>";

            helper.setText(htmlContent, true);

            javaMailSender.send(message);
            System.out.println("Email sent successfully to: " + toEmail);

        } catch (MessagingException e) {
            System.err.println("Failed to send email: " + e.getMessage());
            throw new RuntimeException("Failed to send password reset email");
        }
    }
}
