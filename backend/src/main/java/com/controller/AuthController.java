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
// Reset password request DTO removed as reset functionality is disabled
import com.response.AuthResponse;
import com.service.CustomerUserDetailsService;

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
    


    @PostMapping("/signup")
    public ResponseEntity<AuthResponse> createUserHandler(@RequestBody User user) {
        // Implement user creation logic
        User  isEmailExist = userRepository.findByEmail(user.getEmail());
        if (isEmailExist != null) {
            throw new RuntimeException("Email is already used with another account");
        }

        User createdUser = new User();
        createdUser.setEmail(user.getEmail());
        createdUser.setFullName(user.getFullName());
        createdUser.setRole(user.getRole());
        createdUser.setPassword(passwordEncoder.encode(user.getPassword()));
        createdUser.setProvider("LOCAL"); // Establecer provider como LOCAL

        User savedUser = userRepository.save(createdUser);

        Cart cart = new Cart();
        cart.setCustomer(savedUser);
        cartRepository.save(cart);

        Authentication authentication = new UsernamePasswordAuthenticationToken(user.getEmail(), user.getPassword());
        SecurityContextHolder.getContext().setAuthentication(authentication);

        String jwt = jwtProvider.generateToken(authentication);
        AuthResponse authResponse = new AuthResponse();
        authResponse.setJwt(jwt);
        authResponse.setMessage("User created successfully");
        authResponse.setRole(savedUser.getRole());
        authResponse.setFullName(savedUser.getFullName());
        authResponse.setEmail(savedUser.getEmail());

        return new ResponseEntity<>(authResponse, HttpStatus.CREATED);
    }

    @PostMapping("/signin")
    public ResponseEntity<AuthResponse> singnin(@RequestBody LoginRequest req) {
        String username = req.getEmail();
        String password = req.getPassword();

        Authentication authentication = aunthenticate(username, password);

        Collection<? extends GrantedAuthority> authorities = authentication.getAuthorities();
        String role = authorities.isEmpty()?null:authorities.iterator().next().getAuthority(); // Obtener el primer rol

        // Obtener el usuario desde la base de datos para obtener su información
        User user = userRepository.findByEmail(username);

        String jwt = jwtProvider.generateToken(authentication);
        
        AuthResponse authResponse = new AuthResponse();
        authResponse.setJwt(jwt);
        authResponse.setMessage("User signed in successfully"); // Mensaje de inicio de sesión exitoso
        authResponse.setRole(USER_ROLE.valueOf(role));
        authResponse.setFullName(user.getFullName());
        authResponse.setEmail(user.getEmail());

        return new ResponseEntity<>(authResponse, HttpStatus.OK);

    }

    @PostMapping("/google")
    public ResponseEntity<AuthResponse> googleAuth(@RequestBody GoogleAuthRequest req) {
        try {
            // Buscar usuario por email
            User existingUser = userRepository.findByEmail(req.getEmail());
            
            if (existingUser != null) {
                // Usuario existe - verificar que sea cuenta de Google
                if (!"GOOGLE".equals(existingUser.getProvider())) {
                    throw new RuntimeException("Email already registered with email/password. Please use regular login.");
                }
                
                // Actualizar foto de perfil si cambió
                if (req.getProfileImage() != null && !req.getProfileImage().equals(existingUser.getProfileImage())) {
                    existingUser.setProfileImage(req.getProfileImage());
                    userRepository.save(existingUser);
                }
                
                // Generar JWT
                Authentication authentication = new UsernamePasswordAuthenticationToken(
                    existingUser.getEmail(), 
                    null, 
                    existingUser.getRole() == USER_ROLE.ROLE_CUSTOMER 
                        ? java.util.Collections.singletonList(new org.springframework.security.core.authority.SimpleGrantedAuthority("ROLE_CUSTOMER"))
                        : java.util.Collections.singletonList(new org.springframework.security.core.authority.SimpleGrantedAuthority("ROLE_RESTAURANT_OWNER"))
                );
                
                String jwt = jwtProvider.generateToken(authentication);
                
                AuthResponse authResponse = new AuthResponse();
                authResponse.setJwt(jwt);
                authResponse.setMessage("Google sign in successful");
                authResponse.setRole(existingUser.getRole());
                
                return new ResponseEntity<>(authResponse, HttpStatus.OK);
                
            } else {
                // Usuario nuevo - crear cuenta con Google
                User newUser = new User();
                newUser.setEmail(req.getEmail());
                newUser.setFullName(req.getName());
                newUser.setProvider("GOOGLE");
                newUser.setProviderId(req.getProviderId());
                newUser.setProfileImage(req.getProfileImage());
                newUser.setRole(USER_ROLE.ROLE_CUSTOMER);
                newUser.setPassword(null); // Sin password para usuarios de Google
                
                User savedUser = userRepository.save(newUser);
                
                // Crear carrito para el nuevo usuario
                Cart cart = new Cart();
                cart.setCustomer(savedUser);
                cartRepository.save(cart);
                
                // Generar JWT
                Authentication authentication = new UsernamePasswordAuthenticationToken(
                    savedUser.getEmail(), 
                    null,
                    java.util.Collections.singletonList(new org.springframework.security.core.authority.SimpleGrantedAuthority("ROLE_CUSTOMER"))
                );
                
                String jwt = jwtProvider.generateToken(authentication);
                
                AuthResponse authResponse = new AuthResponse();
                authResponse.setJwt(jwt);
                authResponse.setMessage("Google account created successfully");
                authResponse.setRole(savedUser.getRole());
                
                return new ResponseEntity<>(authResponse, HttpStatus.CREATED);
            }
            
        } catch (Exception e) {
            throw new RuntimeException("Google authentication failed: " + e.getMessage());
        }
    }

    private Authentication aunthenticate(String username, String password) {

        UserDetails userDetails = customerUserDetailsService.loadUserByUsername(username);

        if(userDetails == null) {
            throw new BadCredentialsException("Invalid username"); // Verifica el nombre de usuario
        }
        
        // Verificar si el usuario usa Google OAuth
        User user = userRepository.findByEmail(username);
        if(user != null && "GOOGLE".equals(user.getProvider())) {
            throw new BadCredentialsException("This account uses Google Sign In. Please sign in with Google.");
        }
        
        if(!passwordEncoder.matches(password, userDetails.getPassword())) { // Verifica la contraseña
            throw new BadCredentialsException("Invalid password");
        }
        return new UsernamePasswordAuthenticationToken(
                userDetails, //  Principal (quién es el usuario)
                null, //  Credentials (la contraseña - ya no la necesitamos)
                userDetails.getAuthorities()  //  Authorities (roles/permisos del usuario
        );
    }

    @PostMapping("/forgot-password")
    public ResponseEntity<String> forgotPassword(@RequestBody ForgotPasswordRequest request) {
        // Funcionalidad temporalmente deshabilitada
        return ResponseEntity.status(HttpStatus.NOT_IMPLEMENTED).body("Funcionalidad de restablecer contraseña temporalmente deshabilitada");
    }

    @PostMapping("/reset-password")
    public ResponseEntity<String> resetPassword() {
        // Funcionalidad temporalmente deshabilitada
        return ResponseEntity.status(HttpStatus.NOT_IMPLEMENTED).body("Funcionalidad de restablecer contraseña temporalmente deshabilitada");
    }


    
}
