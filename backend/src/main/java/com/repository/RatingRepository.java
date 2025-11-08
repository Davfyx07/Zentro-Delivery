package com.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.model.Rating;

public interface RatingRepository extends JpaRepository<Rating, Long> {

    List<Rating> findByRestaurantId(Long restaurantId);

    // Verificar si un usuario ya calificó un restaurante
    boolean existsByRestaurantIdAndCustomerId(Long restaurantId, Long customerId);

    // Obtener la calificación de un usuario para un restaurante
    Rating findByRestaurantIdAndCustomerId(Long restaurantId, Long customerId);
}
