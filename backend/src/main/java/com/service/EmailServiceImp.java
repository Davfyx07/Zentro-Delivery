package com.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import com.resend.Resend;
import com.resend.core.exception.ResendException;
import com.resend.services.emails.model.CreateEmailOptions;
import com.resend.services.emails.model.CreateEmailResponse;

@Service
public class EmailServiceImp implements EmailService {

    @Value("${resend.api.key}")
    private String resendApiKey;
    

    @Override
    public void sendPasswordResetEmail(String toEmail, String resetToken) {
        Resend resend = new Resend(resendApiKey);

    String resetLink = "https://zentro-delivery.vercel.app/reset-password?token=" + resetToken;
        
        String htmlContent = """
            <!DOCTYPE html>
            <html>
            <head>
                <style>
                    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                    .header { background-color: #4F46E5; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
                    .content { background-color: #f9fafb; padding: 30px; border-radius: 0 0 8px 8px; }
                    .button { display: inline-block; padding: 12px 24px; background-color: #4F46E5; color: white; text-decoration: none; border-radius: 6px; margin: 20px 0; }
                    .footer { text-align: center; margin-top: 20px; color: #6b7280; font-size: 12px; }
                </style>
            </head>
            <body>
                <div class="container">
                    <div class="header">
                        <h1>🍕 Zentro Delivery</h1>
                    </div>
                    <div class="content">
                        <h2>Recuperación de Contraseña</h2>
                        <p>Hola,</p>
                        <p>Recibimos una solicitud para restablecer la contraseña de tu cuenta en Zentro Delivery.</p>
                        <p>Haz clic en el siguiente botón para crear una nueva contraseña:</p>
                        <center>
                            <a href="%s" class="button">Restablecer Contraseña</a>
                        </center>
                        <p><small>O copia y pega este enlace en tu navegador:</small></p>
                        <p><small>%s</small></p>
                        <p><strong>Este enlace expirará en 1 hora.</strong></p>
                        <p>Si no solicitaste este cambio, puedes ignorar este correo de forma segura.</p>
                        <hr>
                        <p class="footer">
                            Este es un proyecto de demostración. No compartas información sensible.<br>
                            © 2025 Zentro Delivery - Proyecto de Portafolio
                        </p>
                    </div>
                </div>
            </body>
            </html>
            """.formatted(resetLink, resetLink);

        CreateEmailOptions params = CreateEmailOptions.builder()
                .from("Zentro Delivery <onboarding@resend.dev>")
                .to(toEmail)
                .subject("🔐 Recupera tu contraseña - Zentro Delivery")
                .html(htmlContent)
                .build();

        try {
            CreateEmailResponse data = resend.emails().send(params);
            System.out.println("Email enviado con ID: " + data.getId());
        } catch (ResendException e) {
            System.err.println("Error al enviar email: " + e.getMessage());
            throw new RuntimeException("No se pudo enviar el email de recuperación", e);
        }
    }
}
