package com.request;

import lombok.Data;

@Data
public class GoogleAuthRequest {

    private String idToken;         // Token de Google OAuth
    private String email;           // Email del usuario
    private String name;            // Nombre completo
    private String profileImage;    // URL de la foto de perfil
    private String providerId;      // Google ID único

}
