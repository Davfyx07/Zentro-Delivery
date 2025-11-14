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
import com.model.Cart;
import com.model.USER_ROLE;
import com.model.User;
import com.repository.CartRepository;
import com.repository.UserRepository;
import com.request.ForgotPasswordRequest;
import com.request.GoogleAuthRequest;
import com.request.LoginRequest;
import com.response.AuthResponse;
import com.response.MessageResponse;
import com.service.CustomerUserDetailsService;

import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletResponse;

@RestController
@RequestMapping("/auth")
public class AuthController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtProvider jwtProvider;

    @Autowired
    private CustomerUserDetailsService customerUserDetailsService;

    @Autowired
    private CartRepository cartRepository;
    
    @PostMapping("/signup")
    public ResponseEntity<AuthResponse> createUserHandler(@RequestBody User user, HttpServletResponse response) {
        User isEmailExist = userRepository.findByEmail(user.getEmail());
        if (isEmailExist != null) {
            throw new RuntimeException("Email is already used with another account");
        }

        User createdUser = new User();
        createdUser.setEmail(user.getEmail());
        createdUser.setFullName(user.getFullName());
        createdUser.setRole(user.getRole());
        createdUser.setPassword(passwordEncoder.encode(user.getPassword()));
        createdUser.setProvider("LOCAL");

        User savedUser = userRepository.save(createdUser);

        Cart cart = new Cart();
        cart.setCustomer(savedUser);
        cartRepository.save(cart);

        Authentication authentication = new UsernamePasswordAuthenticationToken(user.getEmail(), user.getPassword());
        SecurityContextHolder.getContext().setAuthentication(authentication);

        String jwt = jwtProvider.generateToken(authentication);
        
        // Establecer cookie HttpOnly
        setJwtCookie(response, jwt);
        
        AuthResponse authResponse = new AuthResponse();
        authResponse.setMessage("User created successfully");
        authResponse.setRole(savedUser.getRole());
        authResponse.setFullName(savedUser.getFullName());
        authResponse.setEmail(savedUser.getEmail());

        return new ResponseEntity<>(authResponse, HttpStatus.CREATED);
    }

    @PostMapping("/signin")
    public ResponseEntity<AuthResponse> signin(@RequestBody LoginRequest req, HttpServletResponse response) {
        String username = req.getEmail();
        String password = req.getPassword();

        Authentication authentication = authenticate(username, password);

        Collection<? extends GrantedAuthority> authorities = authentication.getAuthorities();
        String role = authorities.isEmpty() ? null : authorities.iterator().next().getAuthority();

        User user = userRepository.findByEmail(username);

        String jwt = jwtProvider.generateToken(authentication);
        
        // Establecer cookie HttpOnly
        setJwtCookie(response, jwt);

        AuthResponse authResponse = new AuthResponse();
        authResponse.setMessage("User signed in successfully");
        authResponse.setRole(USER_ROLE.valueOf(role));
        authResponse.setFullName(user.getFullName());
        authResponse.setEmail(user.getEmail());

        return new ResponseEntity<>(authResponse, HttpStatus.OK);
    }

    @PostMapping("/google")
    public ResponseEntity<AuthResponse> googleAuth(@RequestBody GoogleAuthRequest req, HttpServletResponse response) {
        try {
            User existingUser = userRepository.findByEmail(req.getEmail());
            
            if (existingUser != null) {
                if (!"GOOGLE".equals(existingUser.getProvider())) {
                    throw new RuntimeException("Email already registered with email/password. Please use regular login.");
                }
                
                if (req.getProfileImage() != null && !req.getProfileImage().equals(existingUser.getProfileImage())) {
                    existingUser.setProfileImage(req.getProfileImage());
                    userRepository.save(existingUser);
                }
                
                Authentication authentication = new UsernamePasswordAuthenticationToken(
                    existingUser.getEmail(), 
                    null, 
                    existingUser.getRole() == USER_ROLE.ROLE_CUSTOMER 
                        ? java.util.Collections.singletonList(new org.springframework.security.core.authority.SimpleGrantedAuthority("ROLE_CUSTOMER"))
                        : java.util.Collections.singletonList(new org.springframework.security.core.authority.SimpleGrantedAuthority("ROLE_RESTAURANT_OWNER"))
                );
                
                String jwt = jwtProvider.generateToken(authentication);
                
                // Establecer cookie HttpOnly
                    setJwtCookie(response, jwt);
                
                AuthResponse authResponse = new AuthResponse();
                authResponse.setMessage("Google sign in successful");
                authResponse.setRole(existingUser.getRole());
                authResponse.setFullName(existingUser.getFullName());
                authResponse.setEmail(existingUser.getEmail());
                
                return new ResponseEntity<>(authResponse, HttpStatus.OK);
                
            } else {
                User newUser = new User();
                newUser.setEmail(req.getEmail());
                newUser.setFullName(req.getName());
                newUser.setProvider("GOOGLE");
                newUser.setProviderId(req.getProviderId());
                newUser.setProfileImage(req.getProfileImage());
                newUser.setRole(USER_ROLE.ROLE_CUSTOMER);
                newUser.setPassword(null);
                
                User savedUser = userRepository.save(newUser);
                
                Cart cart = new Cart();
                cart.setCustomer(savedUser);
                cartRepository.save(cart);
                
                Authentication authentication = new UsernamePasswordAuthenticationToken(
                    savedUser.getEmail(), 
                    null,
                    java.util.Collections.singletonList(new org.springframework.security.core.authority.SimpleGrantedAuthority("ROLE_CUSTOMER"))
                );
                
                String jwt = jwtProvider.generateToken(authentication);
                
                // Establecer cookie HttpOnly
                setJwtCookie(response, jwt);
                
                AuthResponse authResponse = new AuthResponse();
                authResponse.setMessage("Google account created successfully");
                authResponse.setRole(savedUser.getRole());
                authResponse.setFullName(savedUser.getFullName());
                authResponse.setEmail(savedUser.getEmail());
                
                return new ResponseEntity<>(authResponse, HttpStatus.CREATED);
            }
            
        } catch (Exception e) {
            throw new RuntimeException("Google authentication failed: " + e.getMessage());
        }
    }

    @PostMapping("/logout")
    public ResponseEntity<MessageResponse> logout(HttpServletResponse response) {
        // Eliminar la cookie
        Cookie jwtCookie = new Cookie("zentro_jwt", null);
        jwtCookie.setHttpOnly(true);
        // For local development we keep Secure=false so cookie is removed over HTTP
        jwtCookie.setSecure(false);
        jwtCookie.setPath("/");
        jwtCookie.setMaxAge(0); // Expira inmediatamente
        jwtCookie.setAttribute("SameSite", "None");
        response.addCookie(jwtCookie);
        
        // Limpiar el contexto de seguridad
        SecurityContextHolder.clearContext();
        
        MessageResponse res = new MessageResponse();
        res.setMessage("Logged out successfully");
        return ResponseEntity.ok(res);
    }

    private Authentication authenticate(String username, String password) {
        UserDetails userDetails = customerUserDetailsService.loadUserByUsername(username);

        if(userDetails == null) {
            throw new BadCredentialsException("Invalid username");
        }
        
        User user = userRepository.findByEmail(username);
        if(user != null && "GOOGLE".equals(user.getProvider())) {
            throw new BadCredentialsException("This account uses Google Sign In. Please sign in with Google.");
        }
        
        if(!passwordEncoder.matches(password, userDetails.getPassword())) {
            throw new BadCredentialsException("Invalid password");
        }
        return new UsernamePasswordAuthenticationToken(
                userDetails,
                null,
                userDetails.getAuthorities()
        );
    }

    // Método helper para establecer la cookie JWT (valor URL-encoded, sin prefijo 'Bearer ')
    private void setJwtCookie(HttpServletResponse response, String jwt) {
        String encoded = java.net.URLEncoder.encode(jwt, java.nio.charset.StandardCharsets.UTF_8);
        Cookie jwtCookie = new Cookie("zentro_jwt", encoded);
        jwtCookie.setHttpOnly(true);  // NO accesible desde JavaScript
        // For local development (http://localhost) we must NOT set Secure=true otherwise the browser won't send the cookie.
        // In production (HTTPS) you should set Secure=true. Adjust by env if needed.
        jwtCookie.setSecure(false);
        jwtCookie.setPath("/");
        jwtCookie.setMaxAge(86400);    // 1 día en segundos
        // For cross-site XHR (frontend on different port) set SameSite=None.
        // In production set Secure=true and SameSite=None when using HTTPS.
        jwtCookie.setAttribute("SameSite", "None");

        response.addCookie(jwtCookie);
    }

    @PostMapping("/forgot-password")
    public ResponseEntity<String> forgotPassword(@RequestBody ForgotPasswordRequest request) {
        return ResponseEntity.status(HttpStatus.NOT_IMPLEMENTED)
            .body("Funcionalidad de restablecer contraseña temporalmente deshabilitada");
    }

    @PostMapping("/reset-password")
    public ResponseEntity<String> resetPassword() {
        return ResponseEntity.status(HttpStatus.NOT_IMPLEMENTED)
            .body("Funcionalidad de restablecer contraseña temporalmente deshabilitada");
    }
}