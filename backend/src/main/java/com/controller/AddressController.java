package com.controller;

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
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.config.JwtProvider;
import com.model.Address;
import com.service.AddressService;

@RestController
@RequestMapping("/api/addresses")
public class AddressController {

    @Autowired
    private AddressService addressService;

    @Autowired
    private JwtProvider jwtProvider;

    private String getEmailFromAuthHeader(String authHeader) throws Exception {
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            throw new Exception("Missing or invalid Authorization header");
        }
        return jwtProvider.getEmailFromJwtToken(authHeader);
    }

    @GetMapping
    public ResponseEntity<?> listAddresses(@RequestHeader(name = "Authorization", required = false) String authHeader) {
        try {
            String email = getEmailFromAuthHeader(authHeader);
            List<Address> list = addressService.getAddressesForUserByEmail(email);
            return ResponseEntity.ok(list);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(e.getMessage());
        }
    }

    @PostMapping
    public ResponseEntity<?> createAddress(@RequestHeader(name = "Authorization", required = false) String authHeader,
            @RequestBody Address address) {
        try {
            String email = getEmailFromAuthHeader(authHeader);
            Address created = addressService.addAddressForUserByEmail(email, address);
            return ResponseEntity.status(HttpStatus.CREATED).body(created);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateAddress(@RequestHeader(name = "Authorization", required = false) String authHeader,
            @PathVariable Long id, @RequestBody Address address) {
        try {
            String email = getEmailFromAuthHeader(authHeader);
            Address updated = addressService.updateAddressForUserByEmail(email, id, address);
            return ResponseEntity.ok(updated);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteAddress(@RequestHeader(name = "Authorization", required = false) String authHeader,
            @PathVariable Long id) {
        try {
            String email = getEmailFromAuthHeader(authHeader);
            addressService.deleteAddressForUserByEmail(email, id);
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }

    @PostMapping("/{id}/default")
    public ResponseEntity<?> setDefault(@RequestHeader(name = "Authorization", required = false) String authHeader,
            @PathVariable Long id) {
        try {
            String email = getEmailFromAuthHeader(authHeader);
            Address a = addressService.setDefaultAddressForUserByEmail(email, id);
            return ResponseEntity.ok(a);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }

}
