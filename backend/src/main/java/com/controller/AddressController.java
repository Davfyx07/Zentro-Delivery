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
import com.model.User;
import com.service.AddressService;

import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;

@RestController
@RequestMapping("/api/addresses")
public class AddressController {

    @Autowired
    private AddressService addressService;

    // Helper simplificado usando SecurityContext
    private User getAuthenticatedUser() throws Exception {
        String email = org.springframework.security.core.context.SecurityContextHolder.getContext().getAuthentication()
                .getName();
        if (email == null) {
            throw new Exception("User not authenticated");
        }
        // Asumiendo que tienes un método findUserByEmail en userService.
        // Si no, inyéctalo: @Autowired private UserService userService;
        // Pero AddressService ya tiene métodos que aceptan email? No, aceptan User o
        // Email?
        // Revisando el código original:
        // addressService.getAddressesForUserByEmail(email)
        return null; // No se usa, devolvemos email directo
    }

    private String getAuthenticatedEmail() {
        return org.springframework.security.core.context.SecurityContextHolder.getContext().getAuthentication()
                .getName();
    }

    @GetMapping
    public ResponseEntity<?> listAddresses() {
        try {
            String email = getAuthenticatedEmail();
            List<Address> list = addressService.getAddressesForUserByEmail(email);
            return ResponseEntity.ok(list);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(e.getMessage());
        }
    }

    @PostMapping
    public ResponseEntity<?> createAddress(@RequestBody Address address) {
        try {
            String email = getAuthenticatedEmail();
            Address created = addressService.addAddressForUserByEmail(email, address);
            return ResponseEntity.status(HttpStatus.CREATED).body(created);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateAddress(@PathVariable Long id, @RequestBody Address address) {
        try {
            String email = getAuthenticatedEmail();
            Address updated = addressService.updateAddressForUserByEmail(email, id, address);
            return ResponseEntity.ok(updated);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteAddress(@PathVariable Long id) {
        try {
            String email = getAuthenticatedEmail();
            addressService.deleteAddressForUserByEmail(email, id);
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }

    @PostMapping("/{id}/default")
    public ResponseEntity<?> setDefault(@PathVariable Long id) {
        try {
            String email = getAuthenticatedEmail();
            Address a = addressService.setDefaultAddressForUserByEmail(email, id);
            return ResponseEntity.ok(a);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }
}