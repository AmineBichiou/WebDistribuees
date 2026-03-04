package com.esprit.kafka;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;

@Service
public class HotelEventProducer {

    @Value("${kafka.topic.hotel-events}")
    private String topic;

    private final KafkaTemplate<String, Object> kafkaTemplate;

    public HotelEventProducer(KafkaTemplate<String, Object> kafkaTemplate) {
        this.kafkaTemplate = kafkaTemplate;
    }

    public void sendHotelDeletedEvent(Long hotelId) {
        kafkaTemplate.send(topic, "Hotel deleted with id: " + hotelId);
    }
}