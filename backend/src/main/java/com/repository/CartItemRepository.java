package com.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.model.CartItem;

public interface CartItemRepository extends JpaRepository<CartItem, Long> {

}
