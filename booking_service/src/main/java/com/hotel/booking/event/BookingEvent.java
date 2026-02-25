package com.hotel.booking.event;

import com.hotel.booking.entity.BookingStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class BookingEvent {
    
    private Long bookingId;
    private String confirmationNumber;
    private String eventType; // CREATED, UPDATED, CANCELLED
    private Long roomId;
    private Long hotelId;
    private String userId;
    private LocalDate checkInDate;
    private LocalDate checkOutDate;
    private Integer numberOfGuests;
    private Integer numberOfNights;
    private BigDecimal pricePerNight;
    private BigDecimal totalPrice;
    private BookingStatus status;
    private LocalDateTime eventTime;
}
