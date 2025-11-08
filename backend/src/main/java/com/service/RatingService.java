package com.service;

import java.util.List;

import com.model.Rating;
import com.model.User;
import com.request.RatingRequest;

public interface RatingService {

    public Rating addRating(RatingRequest req, User user) throws Exception;

    public Rating updateRating(Long ratingId, RatingRequest req, User user) throws Exception;

    public void deleteRating(Long ratingId, User user) throws Exception;

    public List<Rating> getRestaurantRatings(Long restaurantId) throws Exception;

    public Double getAverageRating(Long restaurantId) throws Exception;
}
