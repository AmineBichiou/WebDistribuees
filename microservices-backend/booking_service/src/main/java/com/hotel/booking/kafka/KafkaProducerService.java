package com.hotel.booking.kafka;

import com.hotel.booking.event.BookingEvent;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Slf4j
public class KafkaProducerService {

    private final KafkaTemplate<String, Object> kafkaTemplate;

    @Value("${kafka.topic.booking-events:booking-events}")
    private String bookingEventsTopic;

    public void sendBookingEvent(BookingEvent event) {
        try {
            log.info("Sending booking event: {} for booking ID: {}", 
                    event.getEventType(), event.getBookingId());
            
            kafkaTemplate.send(bookingEventsTopic, 
                             event.getConfirmationNumber(), 
                             event);
            
            log.info("Booking event sent successfully to topic: {}", bookingEventsTopic);
        } catch (Exception e) {
            log.error("Error sending booking event to Kafka: {}", e.getMessage(), e);
        }
    }
}
