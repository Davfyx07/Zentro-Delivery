package com.controller;

import java.io.IOException;
import java.net.URLDecoder;
import java.nio.charset.StandardCharsets;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.model.User;
import com.request.UpdateProfileRequest;
import com.service.CloudinaryService;
import com.service.UserService;

import jakarta.servlet.http.HttpServletRequest;

@RestController
@RequestMapping("/api/users")
public class UserController {

    @Autowired
    private UserService userService;

    @Autowired
    private CloudinaryService cloudinaryService;

    @GetMapping("/profile")
    public ResponseEntity<User> findUserByJwtToken(@RequestHeader(name = "Authorization", required = false) String jwt,
                                                   HttpServletRequest request) throws Exception {
        if (jwt == null || jwt.isEmpty()) {
            if (request.getCookies() != null) {
                for (jakarta.servlet.http.Cookie c : request.getCookies()) {
                    if ("zentro_jwt".equals(c.getName())) {
                        jwt = URLDecoder.decode(c.getValue(), StandardCharsets.UTF_8);
                        break;
                    }
                }
            }
        }

        User user = userService.findUserByJwtToken(jwt);
        return new ResponseEntity<>(user, HttpStatus.OK);
    }

    @PutMapping("/profile")
    public ResponseEntity<User> updateUserProfile(
            @RequestHeader(name = "Authorization", required = false) String jwt,
            @RequestBody UpdateProfileRequest request,
            HttpServletRequest httpRequest) throws Exception {

        if (jwt == null || jwt.isEmpty()) {
            if (httpRequest.getCookies() != null) {
                for (jakarta.servlet.http.Cookie c : httpRequest.getCookies()) {
                    if ("zentro_jwt".equals(c.getName())) {
                        jwt = URLDecoder.decode(c.getValue(), StandardCharsets.UTF_8);
                        break;
                    }
                }
            }
        }

        User user = userService.findUserByJwtToken(jwt);
        
        // Actualizar solo los campos permitidos
        if (request.getFullName() != null && !request.getFullName().isEmpty()) {
            user.setFullName(request.getFullName());
        }
        if (request.getPhoneNumber() != null) {
            user.setPhoneNumber(request.getPhoneNumber());
        }
        if (request.getAddress() != null) {
            user.setAddress(request.getAddress());
        }
        if (request.getProfileImage() != null) {
            user.setProfileImage(request.getProfileImage());
        }
        
        User updatedUser = userService.updateUser(user);
        return new ResponseEntity<>(updatedUser, HttpStatus.OK);
    }

    @PostMapping("/profile/avatar")
    public ResponseEntity<?> uploadAvatar(
            @RequestHeader(name = "Authorization", required = false) String jwt,
            @RequestParam("file") MultipartFile file,
            HttpServletRequest httpRequest) {
        try {
            if (jwt == null || jwt.isEmpty()) {
                if (httpRequest.getCookies() != null) {
                    for (jakarta.servlet.http.Cookie c : httpRequest.getCookies()) {
                        if ("zentro_jwt".equals(c.getName())) {
                            jwt = URLDecoder.decode(c.getValue(), StandardCharsets.UTF_8);
                            break;
                        }
                    }
                }
            }

            User user = userService.findUserByJwtToken(jwt);
            
            // Validar archivo
            if (file.isEmpty()) {
                return ResponseEntity.badRequest().body("Please select an image file");
            }
            
            // Validar tipo de archivo
            String contentType = file.getContentType();
            if (contentType == null || !contentType.startsWith("image/")) {
                return ResponseEntity.badRequest().body("Only image files are allowed");
            }
            
            // Subir a Cloudinary
            String imageUrl = cloudinaryService.uploadImage(file, "users/avatars");
            
            // Actualizar usuario
            user.setProfileImage(imageUrl);
            User updatedUser = userService.updateUser(user);
            
            return ResponseEntity.ok(updatedUser);
            
        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body("Failed to upload avatar: " + e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body("Error: " + e.getMessage());
        }
    }
}
