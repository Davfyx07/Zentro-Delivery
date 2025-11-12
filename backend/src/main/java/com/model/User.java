package com.model;
import java.util.ArrayList;
import java.util.List;

import com.dto.RestaurantDto;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonProperty;

import jakarta.persistence.CascadeType;
import jakarta.persistence.ElementCollection;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
@Table(name = "users")  //  Renombrar a "users" para evitar conflicto
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;

    // Use camelCase field name to serialize as `fullName` in JSON
    private String fullName;

    private String email;

    @JsonProperty(access = JsonProperty.Access.WRITE_ONLY) // no enviar respuesta con el password
    private String password;

    private USER_ROLE role= USER_ROLE.ROLE_CUSTOMER;

    // OAuth fields
    private String provider = "LOCAL";        // "LOCAL" o "GOOGLE"
    private String providerId;                // ID de Google si viene de OAuth
    
    // Profile fields
    private String profileImage;              // URL de la foto de perfil
    private String phoneNumber;               // Teléfono del usuario
    private String address;                   // Dirección principal (texto simple)

    @JsonIgnore
    @OneToMany(cascade = CascadeType.ALL, mappedBy = "customer", orphanRemoval = true)
    private List<Order> orders = new ArrayList<>();

    @ElementCollection
    private List<RestaurantDto> favorites = new ArrayList<>();

    @OneToMany(cascade = CascadeType.ALL, orphanRemoval= true)
    private List<Address> addresses = new ArrayList<>();
    

}
