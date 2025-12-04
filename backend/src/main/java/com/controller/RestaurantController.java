package com.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.dto.RestaurantDto;
import com.model.Restaurant;
import com.model.User;
import com.service.RestaurantService;
import com.service.UserService;

@RestController
@RequestMapping("/api/restaurants")
public class RestaurantController {

    @Autowired
    private RestaurantService restaurantService;

    @Autowired
    private UserService userService;

    @GetMapping("/search")
    public ResponseEntity<List<Restaurant>> searchRestaurants(
            @RequestParam String keyword) throws Exception {
        // No necesitamos el usuario para buscar, pero si lo necesitáramos:
        // String email =
        // SecurityContextHolder.getContext().getAuthentication().getName();
        List<Restaurant> restaurant = restaurantService.searchRestaurant(keyword);
        return new ResponseEntity<>(restaurant, HttpStatus.OK);
    }

    @GetMapping()
    public ResponseEntity<List<Restaurant>> getAllRestaurant() throws Exception {
        // Endpoint público o protegido por filtro, no necesita usuario explícito para
        // listar
        List<Restaurant> restaurant = restaurantService.getAllRestaurant();
        return new ResponseEntity<>(restaurant, HttpStatus.OK);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Restaurant> findRestaurantById(
            @PathVariable Long id) throws Exception {
        Restaurant restaurant = restaurantService.findRestaurantByID(id);
        return new ResponseEntity<>(restaurant, HttpStatus.OK);
    }

    @PutMapping("/{id}/add-favorites")
    public ResponseEntity<RestaurantDto> addToFavorites(
            @PathVariable Long id) throws Exception {
        // Obtener usuario del contexto de seguridad (seteado por JwtTokenValidator)
        String email = org.springframework.security.core.context.SecurityContextHolder.getContext().getAuthentication()
                .getName();
        User user = userService.findUserByEmail(email);

        RestaurantDto restaurant = restaurantService.addToFavorite(id, user);
        return new ResponseEntity<>(restaurant, HttpStatus.OK);
    }

}
