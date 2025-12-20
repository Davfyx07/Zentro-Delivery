package com.controller;

import java.util.Collection;
import java.util.UUID;
import java.time.LocalDateTime;

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
import com.model.PasswordResetToken;
import com.model.USER_ROLE;
import com.model.User;
import com.repository.CartRepository;
import com.repository.PasswordResetTokenRepository;
import com.repository.UserRepository;
import com.request.ForgotPasswordRequest;
import com.request.GoogleAuthRequest;
import com.request.LoginRequest;
import com.request.ResetPasswordRequest;
import com.response.AuthResponse;
import com.response.MessageResponse;
import com.service.CustomerUserDetailsService;
import com.service.EmailService;

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

    @Autowired
    private PasswordResetTokenRepository passwordResetTokenRepository;

    @Autowired
    private EmailService emailService;

    // 📝 Registro de nuevo usuario
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

    // 🔑 Inicio de sesión con email y contraseña
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

    // 🌐 Inicio de sesión con Google
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

        } catch (Exception e) {
            AuthResponse authResponse = new AuthResponse();
            authResponse.setMessage("Google authentication failed: " + e.getMessage());
            return new ResponseEntity<>(authResponse, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // 🚪 Cerrar sesión
    @PostMapping("/logout")
    public ResponseEntity<MessageResponse> logout(HttpServletResponse response) {
        // Eliminar la cookie con los mismos atributos que al crearla
        org.springframework.http.ResponseCookie cookie = org.springframework.http.ResponseCookie.from("zentro_jwt", "")
                .httpOnly(true)
                .secure(true)
                .path("/")
                .maxAge(0) // Expira inmediatamente
                .sameSite("None")
                .build();

        response.addHeader(org.springframework.http.HttpHeaders.SET_COOKIE, cookie.toString());

        // Limpiar el contexto de seguridad
        SecurityContextHolder.clearContext();

        MessageResponse res = new MessageResponse();
        res.setMessage("Logged out successfully");
        return ResponseEntity.ok(res);
    }

    // 📧 Endpoint para solicitar recuperación de contraseña
    @PostMapping("/forgot-password")
    public ResponseEntity<MessageResponse> forgotPassword(@RequestBody ForgotPasswordRequest request) {
        try {
            // 1. Buscar usuario por email
            User user = userRepository.findByEmail(request.getEmail());

            // 🔍 Si no existe, retornamos OK por seguridad (para no revelar emails
            // registrados)
            if (user == null) {
                return ResponseEntity.ok(new MessageResponse("Si el correo existe, se ha enviado un enlace."));
            }

            // 2. Generar token único
            String token = UUID.randomUUID().toString();

            // 3. Guardar token en base de datos
            // Primero borramos tokens anteriores del usuario si existen
            passwordResetTokenRepository.deleteByUserId(user.getId());

            PasswordResetToken resetToken = new PasswordResetToken();
            resetToken.setToken(token);
            resetToken.setUser(user);
            resetToken.setExpiryDate(LocalDateTime.now().plusMinutes(10)); // ⏳ Expira en 10 min
            passwordResetTokenRepository.save(resetToken);

            // 4. Enviar email
            emailService.sendPasswordResetEmail(user.getEmail(), token);

            return ResponseEntity.ok(new MessageResponse("Si el correo existe, se ha enviado un enlace."));

        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new MessageResponse(e.getMessage()));
        }
    }

    // 🔐 Endpoint para establecer la nueva contraseña
    @PostMapping("/reset-password")
    public ResponseEntity<MessageResponse> resetPassword(@RequestBody ResetPasswordRequest request) {
        try {
            // 1. Buscar el token en la BD
            PasswordResetToken resetToken = passwordResetTokenRepository.findByToken(request.getToken())
                    .orElse(null);

            // 🚫 Validar si el token existe
            if (resetToken == null) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                        .body(new MessageResponse("Token inválido o expirado"));
            }

            // ⏳ Validar si ha expirado
            if (resetToken.isExpired()) {
                passwordResetTokenRepository.delete(resetToken); // Limpiar token expirado
                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                        .body(new MessageResponse("El token ha expirado"));
            }

            // 2. Actualizar contraseña del usuario
            User user = resetToken.getUser();
            user.setPassword(passwordEncoder.encode(request.getPassword()));
            userRepository.save(user);

            // 3. Borrar el token usado
            passwordResetTokenRepository.delete(resetToken);

            return ResponseEntity.ok(new MessageResponse("Contraseña actualizada correctamente"));

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new MessageResponse("Error al actualizar la contraseña"));
        }
    }

    // 🕵️‍♂️ Método helper para autenticación
    private Authentication authenticate(String username, String password) {
        UserDetails userDetails = customerUserDetailsService.loadUserByUsername(username);

        if (userDetails == null) {
            throw new BadCredentialsException("Invalid username");
        }

        User user = userRepository.findByEmail(username);
        if (user != null && "GOOGLE".equals(user.getProvider())) {
            throw new BadCredentialsException("This account uses Google Sign In. Please sign in with Google.");
        }

        if (!passwordEncoder.matches(password, userDetails.getPassword())) {
            throw new BadCredentialsException("Invalid password");
        }
        return new UsernamePasswordAuthenticationToken(
                userDetails,
                null,
                userDetails.getAuthorities());
    }

    // 🍪 Método helper para establecer la cookie JWT
    private void setJwtCookie(HttpServletResponse response, String jwt) {
        org.springframework.http.ResponseCookie cookie = org.springframework.http.ResponseCookie.from("zentro_jwt", jwt)
                .httpOnly(true)
                .secure(true) // True es OBLIGATORIO para SameSite=None
                .path("/")
                .maxAge(86400) // 1 día
                .sameSite("None") // Necesario para Cross-Site (Vercel -> Render)
                .build();

        response.addHeader(org.springframework.http.HttpHeaders.SET_COOKIE, cookie.toString());
    }
}