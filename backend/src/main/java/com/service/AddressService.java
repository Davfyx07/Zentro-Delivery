package com.service;

import java.util.List;

import com.model.Address;

public interface AddressService {

    List<Address> getAddressesForUserByEmail(String userEmail) throws Exception;

    Address addAddressForUserByEmail(String userEmail, Address address) throws Exception;

    Address updateAddressForUserByEmail(String userEmail, Long addressId, Address address) throws Exception;

    void deleteAddressForUserByEmail(String userEmail, Long addressId) throws Exception;

    Address setDefaultAddressForUserByEmail(String userEmail, Long addressId) throws Exception;

}
