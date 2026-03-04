package com.esprit.repository;

import com.esprit.entities.Hotel;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface HotelRepository extends JpaRepository<Hotel, Long> {
    List<Hotel> findByAvailableTrue();
    List<Hotel> findByCityIgnoreCase(String city);
}