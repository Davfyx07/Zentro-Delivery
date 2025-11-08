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

import com.model.Rating;
import com.model.User;
import com.request.RatingRequest;
import com.response.MessageResponse;
import com.service.RatingService;
import com.service.UserService;

@RestController
@RequestMapping("/api/rating")
public class RatingController {

    @Autowired
    private RatingService ratingService;

    @Autowired
    private UserService userService;

    // Agregar calificación
    @PostMapping
    public ResponseEntity<Rating> addRating(@RequestBody RatingRequest req,
                                            @RequestHeader("Authorization") String jwt) throws Exception {
        User user = userService.findUserByJwtToken(jwt);
        Rating rating = ratingService.addRating(req, user);
        return new ResponseEntity<>(rating, HttpStatus.CREATED);
    }

    // Actualizar calificación
    @PutMapping("/{id}")
    public ResponseEntity<Rating> updateRating(@PathVariable Long id,
                                               @RequestBody RatingRequest req,
                                               @RequestHeader("Authorization") String jwt) throws Exception {
        User user = userService.findUserByJwtToken(jwt);
        Rating rating = ratingService.updateRating(id, req, user);
        return new ResponseEntity<>(rating, HttpStatus.OK);
    }

    // Eliminar calificación
    @DeleteMapping("/{id}")
    public ResponseEntity<MessageResponse> deleteRating(@PathVariable Long id,
                                                        @RequestHeader("Authorization") String jwt) throws Exception {
        User user = userService.findUserByJwtToken(jwt);
        ratingService.deleteRating(id, user);

        MessageResponse res = new MessageResponse();
        res.setMessage("Rating deleted successfully");
        return new ResponseEntity<>(res, HttpStatus.OK);
    }

    // Obtener todas las calificaciones de un restaurante
    @GetMapping("/restaurant/{restaurantId}")
    public ResponseEntity<List<Rating>> getRestaurantRatings(@PathVariable Long restaurantId) throws Exception {
        List<Rating> ratings = ratingService.getRestaurantRatings(restaurantId);
        return new ResponseEntity<>(ratings, HttpStatus.OK);
    }

    // Obtener promedio de calificaciones
    @GetMapping("/restaurant/{restaurantId}/average")
    public ResponseEntity<Double> getAverageRating(@PathVariable Long restaurantId) throws Exception {
        Double average = ratingService.getAverageRating(restaurantId);
        return new ResponseEntity<>(average, HttpStatus.OK);
    }
}
