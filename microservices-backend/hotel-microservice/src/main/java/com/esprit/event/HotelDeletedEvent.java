package com.example.hotel.event;

public class HotelDeletedEvent {

    private Long hotelId;

    public HotelDeletedEvent() {}

    public HotelDeletedEvent(Long hotelId) {
        this.hotelId = hotelId;
    }

    public Long getHotelId() {
        return hotelId;
    }

    public void setHotelId(Long hotelId) {
        this.hotelId = hotelId;
    }
}