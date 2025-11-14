package com.config;

import java.util.Collection;
import java.util.Date;
import java.util.HashSet;
import java.util.Set;
  
import javax.crypto.SecretKey;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.stereotype.Service;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;

@Service
public class JwtProvider {

    private SecretKey key = Keys.hmacShaKeyFor(JwtConstant.SECRET_KEY.getBytes());

    public String generateToken(Authentication auth) {
        // Lógica para generar el token JWT
        Collection<? extends GrantedAuthority> authorities = auth.getAuthorities();
        String roles = populateAuthorities(authorities);

        String jwt = Jwts.builder().setIssuedAt(new Date())
            .setExpiration((new Date(new Date().getTime() + JwtConstant.EXPIRATION_TIME))) // 1 día)))
            .claim("email", auth.getName())
            .claim("authorities", roles)
            .signWith(key)
            .compact();


        return jwt;
    }

    public String getEmailFromJwtToken(String jwt) {
        if (jwt == null) return null;
        try {
            // Strip "Bearer " if present
            if (jwt.startsWith("Bearer ")) {
                jwt = jwt.substring(7);
            }
            // URL-decode in case token was stored in a cookie encoded form
            jwt = java.net.URLDecoder.decode(jwt, java.nio.charset.StandardCharsets.UTF_8);

            Claims claims = Jwts.parserBuilder().setSigningKey(key).build().parseClaimsJws(jwt).getBody();
            return String.valueOf(claims.get("email"));
        } catch (Exception e) {
            return null;
        }
    }

    private String populateAuthorities(Collection<? extends GrantedAuthority> authorities) {
        Set<String> auths = new HashSet<>();

        for (GrantedAuthority authority : authorities) {
            auths.add(authority.getAuthority());
        }
        return String.join(",", auths);
    }

}
