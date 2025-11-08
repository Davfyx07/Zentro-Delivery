package com.service;

import java.util.List;

import com.model.Category;

public interface  CategoryService {

    public Category createCategory(String name, Long userId) throws Exception;

    public List<Category> findCategryByRestaurantId(Long id) throws Exception;

    public Category findCategoryById(Long id) throws Exception;
}
