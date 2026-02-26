package org.example.roomservice.controller;

import org.example.roomservice.dto.RoomDTO;
import org.example.roomservice.entity.Room;
import org.example.roomservice.service.RoomService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/rooms")
public class RoomController {

    private final RoomService roomService;

    public RoomController(RoomService roomService) {
        this.roomService = roomService;
    }

    @GetMapping
    public ResponseEntity<List<RoomDTO>> getAllRooms() {
        return ResponseEntity.ok(roomService.getAllRooms());
    }

    @GetMapping("/{id}")
    public ResponseEntity<RoomDTO> getRoomById(@PathVariable Long id) {
        return ResponseEntity.ok(roomService.getRoomById(id));
    }

    @GetMapping("/number/{roomNumber}")
    public ResponseEntity<RoomDTO> getRoomByNumber(@PathVariable String roomNumber) {
        return ResponseEntity.ok(roomService.getRoomByNumber(roomNumber));
    }

    @GetMapping("/status/{status}")
    public ResponseEntity<List<RoomDTO>> getRoomsByStatus(@PathVariable Room.RoomStatus status) {
        return ResponseEntity.ok(roomService.getRoomsByStatus(status));
    }

    @GetMapping("/type/{type}")
    public ResponseEntity<List<RoomDTO>> getRoomsByType(@PathVariable Room.RoomType type) {
        return ResponseEntity.ok(roomService.getRoomsByType(type));
    }

    @GetMapping("/available/{type}")
    public ResponseEntity<List<RoomDTO>> getAvailableRoomsByType(@PathVariable Room.RoomType type) {
        return ResponseEntity.ok(roomService.getAvailableRoomsByType(type));
    }

    @GetMapping("/price")
    public ResponseEntity<List<RoomDTO>> getRoomsByMaxPrice(@RequestParam Double maxPrice) {
        return ResponseEntity.ok(roomService.getRoomsByMaxPrice(maxPrice));
    }

    @GetMapping("/capacity")
    public ResponseEntity<List<RoomDTO>> getRoomsByMinCapacity(@RequestParam Integer minCapacity) {
        return ResponseEntity.ok(roomService.getRoomsByMinCapacity(minCapacity));
    }

    @PostMapping
    public ResponseEntity<RoomDTO> createRoom(@RequestBody RoomDTO roomDTO) {
        return ResponseEntity.status(HttpStatus.CREATED).body(roomService.createRoom(roomDTO));
    }

    @PutMapping("/{id}")
    public ResponseEntity<RoomDTO> updateRoom(@PathVariable Long id, @RequestBody RoomDTO roomDTO) {
        return ResponseEntity.ok(roomService.updateRoom(id, roomDTO));
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<RoomDTO> updateRoomStatus(
            @PathVariable Long id,
            @RequestParam Room.RoomStatus status) {
        return ResponseEntity.ok(roomService.updateRoomStatus(id, status));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteRoom(@PathVariable Long id) {
        roomService.deleteRoom(id);
        return ResponseEntity.noContent().build();
    }
}


