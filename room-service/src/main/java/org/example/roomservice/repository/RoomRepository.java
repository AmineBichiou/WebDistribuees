package org.example.roomservice.repository;

import org.example.roomservice.entity.Room;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface RoomRepository extends JpaRepository<Room, Long> {

    Optional<Room> findByRoomNumber(String roomNumber);

    List<Room> findByStatus(Room.RoomStatus status);

    List<Room> findByType(Room.RoomType type);

    List<Room> findByTypeAndStatus(Room.RoomType type, Room.RoomStatus status);

    List<Room> findByPricePerNightLessThanEqual(Double price);

    List<Room> findByCapacityGreaterThanEqual(Integer capacity);

    boolean existsByRoomNumber(String roomNumber);
}

