package com.service;

import com.model.User;

public interface UserService {

    public User findUserByJwtToken(String jwtToken) throws Exception;

    public User findUserByEmail(String email) throws Exception;
    
    public User updateUser(User user) throws Exception;

}
