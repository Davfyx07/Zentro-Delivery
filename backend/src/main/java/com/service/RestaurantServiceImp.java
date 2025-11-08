package com.service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.dto.RestaurantDto;
import com.model.Address;
import com.model.Restaurant;
import com.model.User;
import com.repository.AddressRepository;
import com.repository.RestaurantRepository;
import com.repository.UserRepository;
import com.request.CreateRestaurantRequest;

@Service
public class RestaurantServiceImp implements RestaurantService {

    @Autowired
    private RestaurantRepository restaurantRepository;

    @Autowired
    private AddressRepository addressRepository;
   
    @Autowired
    private UserRepository userRepository;

	@Override
	public Restaurant createRestaurant(CreateRestaurantRequest req, User user) {
		// TODO Auto-generated method stub

        Address address = addressRepository.save(req.getAddress());

        Restaurant restaurant = new Restaurant();
        restaurant.setAddress(address);
        restaurant.setContactInformation(req.getContactInformation());
        restaurant.setCuisineType(req.getCuisineType());
        restaurant.setDescription(req.getDescription());
		restaurant.setImages(req.getImages());
        restaurant.setName(req.getName());
        restaurant.setOpeningHours(req.getOpeningHours());
        restaurant.setRegistrationDate(LocalDateTime.now());
        restaurant.setOwner(user);

		return restaurantRepository.save(restaurant);
	}

	@Override
	public Restaurant updateRestaurant(Long restaurantId, CreateRestaurantRequest upCreateRestaurantRequest) throws Exception {
		// TODO Auto-generated method stub
		Restaurant restaurant = findRestaurantByID(restaurantId);

        if(restaurant.getCuisineType() != null) { 
            restaurant.setCuisineType(upCreateRestaurantRequest.getCuisineType());
        }
        if(upCreateRestaurantRequest.getDescription() != null) {
            restaurant.setDescription(upCreateRestaurantRequest.getDescription());
        }
        if(upCreateRestaurantRequest.getName() != null) {
            restaurant.setName(upCreateRestaurantRequest.getName());
        }

		return restaurantRepository.save(restaurant);
	}

	@Override
	public void deleteRestaurant(Long restaurantId) throws Exception {
		// TODO Auto-generated method stub
		Restaurant restaurant = findRestaurantByID(restaurantId); 
        restaurantRepository.delete(restaurant);
	}

	@Override
	public Restaurant findRestaurantByID(Long id) throws Exception { //findRestaurantByID
		// TODO Auto-generated method stub
        Optional<Restaurant> opt = restaurantRepository.findById(id);

        if(opt.isEmpty()) { 
            throw new Exception("Restaurant not found whit id"+id); 
        }
		return opt.get();
	}

	

	@Override
	public Restaurant getRestaurantByUserId(Long userId) throws Exception {
		// TODO Auto-generated method stub
		Restaurant restaurant = restaurantRepository.findByOwnerId(userId);
        if(restaurant == null) {
            throw new Exception("Restaurant not found with owner " + userId);
        }
        return restaurant;
	}

	@Override
	public List<Restaurant> getAllRestaurant() {
		// TODO Auto-generated method stub
		return restaurantRepository.findAll();
	}

	@Override
	public List<Restaurant> searchRestaurant(String keyword) {
		// TODO Auto-generated method stub
		return restaurantRepository.findBySearchQuery(keyword);
	}

	@Override
	public RestaurantDto addToFavorite(Long restaurantId, User user) throws Exception {
		// TODO Auto-generated method stub
		Restaurant restaurant = findRestaurantByID(restaurantId);

        RestaurantDto dto = new RestaurantDto();
		dto.setDescription(restaurant.getDescription());
        dto.setImages(restaurant.getImages());
        dto.setTitle(restaurant.getName());
        dto.setId(restaurantId);

		boolean isFavorited = false;
		List<RestaurantDto> favorites = user.getFavorites();
		for(RestaurantDto favorite : favorites) {
			if(favorite.getId().equals(restaurantId)) {
				isFavorited = true;
				break;
			}
		}
		if (isFavorited) {
			favorites.removeIf(favorite -> favorite.getId().equals(restaurantId));
		} else {
			favorites.add(dto);
		}
		userRepository.save(user);
		return dto;
	}
	@Override
	public Restaurant updateRestaurantStatus(Long id) throws Exception {
		// TODO Auto-generated method stub
		Restaurant restaurant = findRestaurantByID(id);
        restaurant.setOpen(!restaurant.isOpen());
        return  restaurantRepository.save(restaurant); 
	}

}
