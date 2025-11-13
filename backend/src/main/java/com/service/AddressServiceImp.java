package com.service;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.model.Address;
import com.model.User;
import com.repository.AddressRepository;
import com.repository.UserRepository;

@Service
public class AddressServiceImp implements AddressService {

    @Autowired
    private AddressRepository addressRepository;

    @Autowired
    private UserRepository userRepository;

    @Override
    public List<Address> getAddressesForUserByEmail(String userEmail) throws Exception {
        User user = userRepository.findByEmail(userEmail);
        if (user == null) {
            throw new Exception("User not found");
        }
        return addressRepository.findByCustomerId(user.getId());
    }

    @Override
    @Transactional
    public Address addAddressForUserByEmail(String userEmail, Address address) throws Exception {
        User user = userRepository.findByEmail(userEmail);
        if (user == null) {
            throw new Exception("User not found");
        }

        address.setCustomer(user);

        // If the incoming address requests to be default, clear previous defaults
        if (Boolean.TRUE.equals(address.getIsDefault())) {
            Optional<Address> prev = addressRepository.findByCustomerIdAndIsDefaultTrue(user.getId());
            if (prev.isPresent()) {
                Address p = prev.get();
                p.setIsDefault(false);
                addressRepository.save(p);
            }
        }

        return addressRepository.save(address);
    }

    @Override
    @Transactional
    public Address updateAddressForUserByEmail(String userEmail, Long addressId, Address payload) throws Exception {
        User user = userRepository.findByEmail(userEmail);
        if (user == null) {
            throw new Exception("User not found");
        }

        Address existing = addressRepository.findByIdAndCustomerId(addressId, user.getId())
                .orElseThrow(() -> new Exception("Address not found"));

        existing.setTitle(payload.getTitle());
        existing.setAddress(payload.getAddress());

        // Handle default flag
        if (Boolean.TRUE.equals(payload.getIsDefault())) {
            Optional<Address> prev = addressRepository.findByCustomerIdAndIsDefaultTrue(user.getId());
            if (prev.isPresent()) {
                Address p = prev.get();
                if (!p.getId().equals(existing.getId())) {
                    p.setIsDefault(false);
                    addressRepository.save(p);
                }
            }
            existing.setIsDefault(true);
        } else if (payload.getIsDefault() != null && !payload.getIsDefault()) {
            existing.setIsDefault(false);
        }

        return addressRepository.save(existing);
    }

    @Override
    public void deleteAddressForUserByEmail(String userEmail, Long addressId) throws Exception {
        User user = userRepository.findByEmail(userEmail);
        if (user == null) {
            throw new Exception("User not found");
        }

        Address existing = addressRepository.findByIdAndCustomerId(addressId, user.getId())
                .orElseThrow(() -> new Exception("Address not found"));

        addressRepository.delete(existing);
    }

    @Override
    @Transactional
    public Address setDefaultAddressForUserByEmail(String userEmail, Long addressId) throws Exception {
        User user = userRepository.findByEmail(userEmail);
        if (user == null) {
            throw new Exception("User not found");
        }

        Address existing = addressRepository.findByIdAndCustomerId(addressId, user.getId())
                .orElseThrow(() -> new Exception("Address not found"));

        // Clear previous default
        Optional<Address> prev = addressRepository.findByCustomerIdAndIsDefaultTrue(user.getId());
        if (prev.isPresent()) {
            Address p = prev.get();
            if (!p.getId().equals(existing.getId())) {
                p.setIsDefault(false);
                addressRepository.save(p);
            }
        }

        existing.setIsDefault(true);
        return addressRepository.save(existing);
    }

}
