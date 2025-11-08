package com.service;

import java.util.List;

import com.dto.RestaurantDto;
import com.model.Restaurant;
import com.model.User;
import com.request.CreateRestaurantRequest;

public interface RestaurantService {

    public Restaurant createRestaurant(CreateRestaurantRequest req, User user);

    public Restaurant updateRestaurant(Long restaurantId, CreateRestaurantRequest upCreateRestaurantRequest) throws Exception;

    public void deleteRestaurant(Long restaurantId) throws Exception;

    public Restaurant findRestaurantByID(Long id) throws Exception; //

    public Restaurant getRestaurantByUserId(Long userId) throws Exception;

    public List<Restaurant> getAllRestaurant();

    public List<Restaurant> searchRestaurant(String keyword);

    public RestaurantDto addToFavorite(Long restaurantId, User user) throws Exception; 

    public Restaurant updateRestaurantStatus(Long id) throws Exception;

}
