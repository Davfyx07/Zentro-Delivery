package com.service;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.model.Rating;
import com.model.Restaurant;
import com.model.User;
import com.repository.RatingRepository;
import com.repository.RestaurantRepository;
import com.request.RatingRequest;

@Service
public class RatingServiceImp implements RatingService {

    @Autowired
    private RatingRepository ratingRepository;

    @Autowired
    private RestaurantRepository restaurantRepository;

    @Autowired
    private RestaurantService restaurantService;

    @Override
    public Rating addRating(RatingRequest req, User user) throws Exception {
        Restaurant restaurant = restaurantService.findRestaurantByID(req.getRestaurantId());

        // Verificar si el usuario ya calificó este restaurante
        if (ratingRepository.existsByRestaurantIdAndCustomerId(req.getRestaurantId(), user.getId())) {
            throw new Exception("You have already rated this restaurant. Use update instead.");
        }

        // Validar rating (1-5)
        if (req.getRating() < 1 || req.getRating() > 5) {
            throw new Exception("Rating must be between 1 and 5");
        }

        Rating rating = new Rating();
        rating.setRestaurant(restaurant);
        rating.setCustomer(user);
        rating.setRating(req.getRating());
        rating.setComment(req.getComment());

        Rating savedRating = ratingRepository.save(rating);

        // Actualizar promedio del restaurante
        updateRestaurantAverageRating(restaurant.getId());

        return savedRating;
    }

    @Override
    public Rating updateRating(Long ratingId, RatingRequest req, User user) throws Exception {
        Optional<Rating> optionalRating = ratingRepository.findById(ratingId);

        if (optionalRating.isEmpty()) {
            throw new Exception("Rating not found");
        }

        Rating rating = optionalRating.get();

        // Verificar que sea el dueño del rating
        if (!rating.getCustomer().getId().equals(user.getId())) {
            throw new Exception("You can only update your own ratings");
        }

        // Validar rating (1-5)
        if (req.getRating() < 1 || req.getRating() > 5) {
            throw new Exception("Rating must be between 1 and 5");
        }

        rating.setRating(req.getRating());
        rating.setComment(req.getComment());

        Rating updatedRating = ratingRepository.save(rating);

        // Actualizar promedio del restaurante
        updateRestaurantAverageRating(rating.getRestaurant().getId());

        return updatedRating;
    }

    @Override
    public void deleteRating(Long ratingId, User user) throws Exception {
        Optional<Rating> optionalRating = ratingRepository.findById(ratingId);

        if (optionalRating.isEmpty()) {
            throw new Exception("Rating not found");
        }

        Rating rating = optionalRating.get();

        // Verificar que sea el dueño del rating
        if (!rating.getCustomer().getId().equals(user.getId())) {
            throw new Exception("You can only delete your own ratings");
        }

        Long restaurantId = rating.getRestaurant().getId();
        ratingRepository.delete(rating);

        // Actualizar promedio del restaurante
        updateRestaurantAverageRating(restaurantId);
    }

    @Override
    public List<Rating> getRestaurantRatings(Long restaurantId) throws Exception {
        return ratingRepository.findByRestaurantId(restaurantId);
    }

    @Override
    public Double getAverageRating(Long restaurantId) throws Exception {
        List<Rating> ratings = ratingRepository.findByRestaurantId(restaurantId);

        if (ratings.isEmpty()) {
            return 0.0;
        }

        double sum = ratings.stream()
                .mapToDouble(Rating::getRating)
                .sum();

        return sum / ratings.size();
    }

    // Método helper para actualizar el promedio en Restaurant
    private void updateRestaurantAverageRating(Long restaurantId) throws Exception {
        Restaurant restaurant = restaurantService.findRestaurantByID(restaurantId);
        List<Rating> ratings = ratingRepository.findByRestaurantId(restaurantId);

        if (ratings.isEmpty()) {
            restaurant.setAverageRating(0.0);
            restaurant.setTotalRatings(0);
        } else {
            double sum = ratings.stream()
                    .mapToDouble(Rating::getRating)
                    .sum();

            restaurant.setAverageRating(sum / ratings.size());
            restaurant.setTotalRatings(ratings.size());
        }

        restaurantRepository.save(restaurant);
    }
}
