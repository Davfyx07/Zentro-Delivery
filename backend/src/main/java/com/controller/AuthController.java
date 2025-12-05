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

        try {
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

    @PostMapping("/google")
    public ResponseEntity<AuthResponse> googleAuth(@RequestBody GoogleAuthRequest req, HttpServletResponse response) {
        try {
            User existingUser = userRepository.findByEmail(req.getEmail());

            if (existingUser != null) {
                if (!"GOOGLE".equals(existingUser.getProvider())) {
                    // Retornar error específico en lugar de lanzar excepción que causa 403
                    AuthResponse authResponse = new AuthResponse();
                    authResponse.setMessage("Email already registered with email/password. Please use regular login.");
                    return new ResponseEntity<>(authResponse, HttpStatus.CONFLICT);
                }

                if (req.getProfileImage() != null && !req.getProfileImage().equals(existingUser.getProfileImage())) {
                    existingUser.setProfileImage(req.getProfileImage());
                    userRepository.save(existingUser);
                }

                Authentication authentication = new UsernamePasswordAuthenticationToken(
                        existingUser.getEmail(),
                        null,
                        existingUser.getRole() == USER_ROLE.ROLE_CUSTOMER
                                ? java.util.Collections.singletonList(
                                        new org.springframework.security.core.authority.SimpleGrantedAuthority(
                                                "ROLE_CUSTOMER"))
                                : java.util.Collections.singletonList(
                                        new org.springframework.security.core.authority.SimpleGrantedAuthority(
                                                "ROLE_RESTAURANT_OWNER")));

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
                        java.util.Collections
                                .singletonList(new org.springframework.security.core.authority.SimpleGrantedAuthority(
                                        "ROLE_CUSTOMER")));

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
                .maxAge(86400) // 1 día
                .sameSite("None") // Necesario para Cross-Site (Vercel -> Render)
                .build();

        response.addHeader(org.springframework.http.HttpHeaders.SET_COOKIE, cookie.toString());
    }
}