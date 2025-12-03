package com.config;

public class JwtConstant {

    public static final String SECRET_KEY = System.getenv("JWT_SECRET") != null ? System.getenv("JWT_SECRET")
            : "ZentroRestaurantSecureSecretKeyForJWT2025MinimumLengthRequired"; // Clave secreta (usa env var o fallback
                                                                                // seguro para dev)
    public static final String JWT_HEADER = "Authorization"; // Nombre del encabezado HTTP donde se envía el token
    public static final long EXPIRATION_TIME = 86400000; // Tiempo de expiración del token (1 día)

}
