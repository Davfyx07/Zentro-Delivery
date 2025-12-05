package com.controller;

import java.util.Collection;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.config.JwtProvider;
import com.model.USER_ROLE;
import com.model.User;
import com.repository.UserRepository;
import com.request.LoginRequest;
import com.response.AuthResponse;
import com.service.CustomerUserDetailsService;

import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletResponse;

@RestController
@RequestMapping("/auth/admin")
public class AdminAuthController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtProvider jwtProvider;

    @Autowired
    private CustomerUserDetailsService customerUserDetailsService;

    @PostMapping("/signin")
    public ResponseEntity<AuthResponse> signin(@RequestBody LoginRequest req, HttpServletResponse response) {
        String username = req.getEmail();
        String password = req.getPassword();

        try {
            Authentication authentication = authenticate(username, password);

            Collection<? extends GrantedAuthority> authorities = authentication.getAuthorities();
            String role = authorities.isEmpty() ? null : authorities.iterator().next().getAuthority();

            // Verificación extra: Solo permitir acceso si el usuario es ADMIN o OWNER
            if (!USER_ROLE.ROLE_RESTAURANT_OWNER.toString().equals(role) &&
                    !USER_ROLE.ROLE_ADMIN.toString().equals(role)) {

                AuthResponse authResponse = new AuthResponse();
                authResponse.setMessage("Access denied. Not an admin or restaurant owner.");
                return new ResponseEntity<>(authResponse, HttpStatus.FORBIDDEN);
            }

            User user = userRepository.findByEmail(username);

            String jwt = jwtProvider.generateToken(authentication);

            // Establecer cookie HttpOnly
            setJwtCookie(response, jwt);

            AuthResponse authResponse = new AuthResponse();
            authResponse.setMessage("Admin/Owner signed in successfully");
            authResponse.setRole(USER_ROLE.valueOf(role));
            authResponse.setFullName(user.getFullName());
            authResponse.setEmail(user.getEmail());

            return new ResponseEntity<>(authResponse, HttpStatus.OK);

        } catch (BadCredentialsException e) {
            AuthResponse authResponse = new AuthResponse();
            authResponse.setMessage("Invalid username or password");
            return new ResponseEntity<>(authResponse, HttpStatus.UNAUTHORIZED);
        } catch (Exception e) {
            AuthResponse authResponse = new AuthResponse();
            authResponse.setMessage("Error during login: " + e.getMessage());
            return new ResponseEntity<>(authResponse, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    private Authentication authenticate(String username, String password) {
        UserDetails userDetails = customerUserDetailsService.loadUserByUsername(username);

        if (userDetails == null) {
            throw new BadCredentialsException("Invalid username");
        }

        if (!passwordEncoder.matches(password, userDetails.getPassword())) {
            throw new BadCredentialsException("Invalid password");
        }
        return new UsernamePasswordAuthenticationToken(
                userDetails,
                null,
                userDetails.getAuthorities());
    }

    private void setJwtCookie(HttpServletResponse response, String jwt) {
        Cookie jwtCookie = new Cookie("zentro_jwt", jwt);
        jwtCookie.setHttpOnly(true);
        jwtCookie.setSecure(false); // false para desarrollo local
        jwtCookie.setPath("/");
        jwtCookie.setMaxAge(86400); // 1 día
        jwtCookie.setAttribute("SameSite", "Lax");
        response.addCookie(jwtCookie);
    }
}
