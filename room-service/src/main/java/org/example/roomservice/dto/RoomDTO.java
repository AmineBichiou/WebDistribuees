package org.example.roomservice.dto;

import org.example.roomservice.entity.Room;

public class RoomDTO {

    private Long id;
    private String roomNumber;
    private Room.RoomType type;
    private Double pricePerNight;
    private Room.RoomStatus status;
    private Integer capacity;
    private String description;
    private Integer floor;

    public RoomDTO() {}

    public RoomDTO(Long id, String roomNumber, Room.RoomType type, Double pricePerNight,
                   Room.RoomStatus status, Integer capacity, String description, Integer floor) {
        this.id = id;
        this.roomNumber = roomNumber;
        this.type = type;
        this.pricePerNight = pricePerNight;
        this.status = status;
        this.capacity = capacity;
        this.description = description;
        this.floor = floor;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getRoomNumber() { return roomNumber; }
    public void setRoomNumber(String roomNumber) { this.roomNumber = roomNumber; }

    public Room.RoomType getType() { return type; }
    public void setType(Room.RoomType type) { this.type = type; }

    public Double getPricePerNight() { return pricePerNight; }
    public void setPricePerNight(Double pricePerNight) { this.pricePerNight = pricePerNight; }

    public Room.RoomStatus getStatus() { return status; }
    public void setStatus(Room.RoomStatus status) { this.status = status; }

    public Integer getCapacity() { return capacity; }
    public void setCapacity(Integer capacity) { this.capacity = capacity; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public Integer getFloor() { return floor; }
    public void setFloor(Integer floor) { this.floor = floor; }
}


