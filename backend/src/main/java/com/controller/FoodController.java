package com.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.model.Food;
import com.model.User;
import com.service.FoodService;
import com.service.RestaurantService;
import com.service.UserService;

@RestController
@RequestMapping("/api/food")
public class FoodController {
    @Autowired
    private FoodService foodService;
    
    @Autowired
    private UserService userService;

    @Autowired
    private RestaurantService restaurantService;

    @GetMapping("/search")
    public ResponseEntity<List<Food>> searchFood(@RequestParam String name,
                                            @RequestHeader("Authorization") String jwt) throws Exception {

        User user = userService.findUserByJwtToken(jwt);

        List <Food> foods = foodService.searchFood(name);
        return new ResponseEntity<>(foods, HttpStatus.OK); // 200 OK
    }



    @GetMapping("/restaurant/{restaurantId}")
    public ResponseEntity<List<Food>> getRestaurantFood(
        @RequestParam boolean vegetarian,
        @RequestParam boolean seasonal,
        @RequestParam boolean noVegan,
        @RequestParam(required = false) String food_category,
        @PathVariable Long restaurantId,
        @RequestHeader("Authorization") String jwt) throws Exception {

        User user = userService.findUserByJwtToken(jwt);

        List <Food> foods = foodService.getRestaurantFood(restaurantId, vegetarian, noVegan, seasonal, food_category);
        return new ResponseEntity<>(foods, HttpStatus.OK); // 200 OK
    }
}
