package com.service;

import com.model.User;

public interface UserService {

    public User findUserByJwtToken(String jwtToken) throws Exception;//d

    public User findUserByEmail(String email) throws Exception; //

}
