package com.controller;

import java.net.URLDecoder;
import java.nio.charset.StandardCharsets;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.config.JwtProvider;
import com.model.Address;
import com.service.AddressService;

import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;

@RestController
@RequestMapping("/api/addresses")
public class AddressController {

    @Autowired
    private AddressService addressService;

    @Autowired
    private JwtProvider jwtProvider;

    // ✅ Método helper para obtener email desde cookies
    private String getEmailFromRequest(HttpServletRequest request) throws Exception {
        String jwt = null;
        
        // Buscar cookie zentro_jwt
        if (request.getCookies() != null) {
            for (Cookie cookie : request.getCookies()) {
                if ("zentro_jwt".equals(cookie.getName())) {
                    jwt = URLDecoder.decode(cookie.getValue(), StandardCharsets.UTF_8);
                    break;
                }
            }
        }
        
        if (jwt == null || jwt.isEmpty()) {
            throw new Exception("Missing or invalid Authorization");
        }
        
        // Agregar "Bearer " si no está presente
        if (!jwt.startsWith("Bearer ")) {
            jwt = "Bearer " + jwt;
        }
        
        String email = jwtProvider.getEmailFromJwtToken(jwt);
        if (email == null) {
            throw new Exception("Invalid JWT token");
        }
        
        return email;
    }

    @GetMapping
    public ResponseEntity<?> listAddresses(HttpServletRequest request) {
        try {
            String email = getEmailFromRequest(request);
            List<Address> list = addressService.getAddressesForUserByEmail(email);
            return ResponseEntity.ok(list);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(e.getMessage());
        }
    }

    @PostMapping
    public ResponseEntity<?> createAddress(HttpServletRequest request,
            @RequestBody Address address) {
        try {
            String email = getEmailFromRequest(request);
            Address created = addressService.addAddressForUserByEmail(email, address);
            return ResponseEntity.status(HttpStatus.CREATED).body(created);
        } catch (Exception e) {
            e.printStackTrace(); // Para debugging
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateAddress(HttpServletRequest request,
            @PathVariable Long id, @RequestBody Address address) {
        try {
            String email = getEmailFromRequest(request);
            Address updated = addressService.updateAddressForUserByEmail(email, id, address);
            return ResponseEntity.ok(updated);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteAddress(HttpServletRequest request,
            @PathVariable Long id) {
        try {
            String email = getEmailFromRequest(request);
            addressService.deleteAddressForUserByEmail(email, id);
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }

    @PostMapping("/{id}/default")
    public ResponseEntity<?> setDefault(HttpServletRequest request,
            @PathVariable Long id) {
        try {
            String email = getEmailFromRequest(request);
            Address a = addressService.setDefaultAddressForUserByEmail(email, id);
            return ResponseEntity.ok(a);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }
}