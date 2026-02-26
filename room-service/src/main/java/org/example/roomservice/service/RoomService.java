package org.example.roomservice.service;

import org.example.roomservice.dto.RoomDTO;
import org.example.roomservice.entity.Room;
import org.example.roomservice.repository.RoomRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class RoomService {

    private static final Logger log = LoggerFactory.getLogger(RoomService.class);

    private final RoomRepository roomRepository;

    public RoomService(RoomRepository roomRepository) {
        this.roomRepository = roomRepository;
    }

    public List<RoomDTO> getAllRooms() {
        log.info("Fetching all rooms");
        return roomRepository.findAll()
                .stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    public RoomDTO getRoomById(Long id) {
        log.info("Fetching room with id: {}", id);
        Room room = roomRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Room not found with id: " + id));
        return toDTO(room);
    }

    public RoomDTO getRoomByNumber(String roomNumber) {
        log.info("Fetching room with number: {}", roomNumber);
        Room room = roomRepository.findByRoomNumber(roomNumber)
                .orElseThrow(() -> new RuntimeException("Room not found with number: " + roomNumber));
        return toDTO(room);
    }

    public List<RoomDTO> getRoomsByStatus(Room.RoomStatus status) {
        log.info("Fetching rooms with status: {}", status);
        return roomRepository.findByStatus(status)
                .stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    public List<RoomDTO> getRoomsByType(Room.RoomType type) {
        log.info("Fetching rooms with type: {}", type);
        return roomRepository.findByType(type)
                .stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    public List<RoomDTO> getAvailableRoomsByType(Room.RoomType type) {
        log.info("Fetching available rooms with type: {}", type);
        return roomRepository.findByTypeAndStatus(type, Room.RoomStatus.AVAILABLE)
                .stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    public List<RoomDTO> getRoomsByMaxPrice(Double price) {
        log.info("Fetching rooms with price <= {}", price);
        return roomRepository.findByPricePerNightLessThanEqual(price)
                .stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    public List<RoomDTO> getRoomsByMinCapacity(Integer capacity) {
        log.info("Fetching rooms with capacity >= {}", capacity);
        return roomRepository.findByCapacityGreaterThanEqual(capacity)
                .stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    public RoomDTO createRoom(RoomDTO roomDTO) {
        log.info("Creating new room: {}", roomDTO.getRoomNumber());
        if (roomRepository.existsByRoomNumber(roomDTO.getRoomNumber())) {
            throw new RuntimeException("Room already exists with number: " + roomDTO.getRoomNumber());
        }
        Room room = toEntity(roomDTO);
        room.setStatus(Room.RoomStatus.AVAILABLE);
        return toDTO(roomRepository.save(room));
    }

    public RoomDTO updateRoom(Long id, RoomDTO roomDTO) {
        log.info("Updating room with id: {}", id);
        Room existing = roomRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Room not found with id: " + id));

        existing.setRoomNumber(roomDTO.getRoomNumber());
        existing.setType(roomDTO.getType());
        existing.setPricePerNight(roomDTO.getPricePerNight());
        existing.setStatus(roomDTO.getStatus());
        existing.setCapacity(roomDTO.getCapacity());
        existing.setDescription(roomDTO.getDescription());
        existing.setFloor(roomDTO.getFloor());

        return toDTO(roomRepository.save(existing));
    }

    public RoomDTO updateRoomStatus(Long id, Room.RoomStatus status) {
        log.info("Updating status of room {} to {}", id, status);
        Room room = roomRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Room not found with id: " + id));
        room.setStatus(status);
        return toDTO(roomRepository.save(room));
    }

    public void deleteRoom(Long id) {
        log.info("Deleting room with id: {}", id);
        if (!roomRepository.existsById(id)) {
            throw new RuntimeException("Room not found with id: " + id);
        }
        roomRepository.deleteById(id);
    }

    // ── Mappers ──────────────────────────────────────────────
    private RoomDTO toDTO(Room room) {
        return new RoomDTO(
                room.getId(),
                room.getRoomNumber(),
                room.getType(),
                room.getPricePerNight(),
                room.getStatus(),
                room.getCapacity(),
                room.getDescription(),
                room.getFloor()
        );
    }

    private Room toEntity(RoomDTO dto) {
        return new Room(
                dto.getId(),
                dto.getRoomNumber(),
                dto.getType(),
                dto.getPricePerNight(),
                dto.getStatus(),
                dto.getCapacity(),
                dto.getDescription(),
                dto.getFloor()
        );
    }
}


