package com.config;

public class JwtConstant {

    public static final String SECRET_KEY = "ZentroRestaurantSecureSecretKeyForJWT2025MinimumLengthRequired"; // Clave secreta para firmar el token JWT (mínimo 32 caracteres)
    public static final String JWT_HEADER = "Authorization"; // Nombre del encabezado HTTP donde se envía el token
   public static final long EXPIRATION_TIME = 86400000; // Tiempo de expiración del token (1 día)

}
