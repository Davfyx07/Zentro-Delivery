package com.service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.model.Category;
import com.model.Food;
import com.model.Restaurant;
import com.repository.FoodRepository;
import com.request.CreateFoodRequest;

@Service
public class FoodServiceImp implements FoodService {

    @Autowired
    private FoodRepository foodRepository;

    @Override
    public Food createFood(CreateFoodRequest req, Category category, Restaurant restaurant) {
        Food food = new Food();
        food.setFoodCategory(category);
        food.setRestaurant(restaurant);
        food.setDescription(req.getDescription());
        food.setImages(req.getImages());
        food.setName(req.getName());
        food.setPrice(req.getPrice());
        food.setIngredients(req.getIngredients());
        food.setSeasonal(req.isSeasional());
        food.setVegetarian(req.isVegetarian());

        Food saveFood = foodRepository.save(food);
        restaurant.getFoods().add(saveFood);
        return saveFood;
    }

    @Override
    public void deleteFood(Long id) throws Exception {
        Food food = findFoodById(id);
        food.setRestaurant(null);
        foodRepository.save(food);
    }

    @Override
    public List<Food> getRestaurantFood(Long restaurantId, 
                                        boolean isVegetarian, 
                                        boolean isNoVegan, 
                                        boolean isSeasonal, 
                                        String foodCategory) {
        
        List<Food> foods = foodRepository.findByRestaurantId(restaurantId);

        if (isVegetarian) {
            foods = filterByVegetarian(foods, isVegetarian);
        }
        if (isNoVegan) {
            foods = filterByNoVegan(foods, isNoVegan);
        }
        if (isSeasonal) {
            foods = filterBySeasonal(foods, isSeasonal);
        }
        if(foodCategory != null && !foodCategory.isEmpty()) { //.equals("")
            foods = filterByCategory(foods, foodCategory);
        }

        return foods;
        // Implementation here
    }
    private List<Food> filterByCategory(List<Food> foods, String foodCategory) {
            return foods.stream().filter(food -> {
                if (food.getFoodCategory() != null) {
                    return food.getFoodCategory().getName().equals(foodCategory);
                }
                return false;
            }).collect(Collectors.toList());
        }

    private List<Food> filterByVegetarian(List<Food> foods, boolean isVegetarian) {
        // TODO Auto-generated method stub
        return foods.stream().filter(food -> food.isVegetarian() == isVegetarian).collect(Collectors.toList());
    }

    private List<Food> filterByNoVegan(List<Food> foods, boolean noVegan) {
        return foods.stream().filter(food -> food.isVegetarian() == false).collect(Collectors.toList());
    }

    private List<Food> filterBySeasonal(List<Food> foods, boolean seasonal) {
        return foods.stream().filter(food -> food.isSeasonal() == seasonal).collect(Collectors.toList());
    }

    @Override
    public List<Food> searchFood(String keyword) {
        return foodRepository.searchFood(keyword);
        // Implementation here
    }

    @Override
    public Food findFoodById(Long foodId) throws Exception {
        Optional<Food> optionalFood = foodRepository.findById(foodId);


        if (optionalFood.isEmpty()) {
            throw new Exception("Food not exist");
        }
        return optionalFood.get();
        // Implementation here
    }

    @Override
    public Food updateAvailabilityStatus(Long foodId) throws Exception {
        Food food = findFoodById(foodId);

        food.setAvailable(!food.isAvailable());
        return foodRepository.save(food);
        // Implementation here
    }
    

    
}
