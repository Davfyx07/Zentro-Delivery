package com.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.model.User;

public interface  UserRepository extends JpaRepository<User, Long>{

    public User findByEmail(String username); //buscar usuario por email
}
