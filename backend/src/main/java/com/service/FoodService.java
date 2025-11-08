package com.service;

import java.util.List;

import com.model.Category;
import com.model.Food;
import com.model.Restaurant;
import com.request.CreateFoodRequest;
public interface FoodService {

    public Food createFood(CreateFoodRequest req, Category category, Restaurant restaurant);

    void deleteFood(Long id) throws Exception;
    
    public List<Food> getRestaurantFood(Long restaurantId, 
                                        boolean isVegetarian, 
                                        boolean isNoVegan,
                                        boolean isSeasonal, 
                                        String foodCategory
    );

    public List<Food> searchFood(String keyword);

    public Food findFoodById(Long foodId) throws Exception;

    public Food updateAvailabilityStatus(Long foodId) throws Exception;


}
