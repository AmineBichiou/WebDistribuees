package com.company.employee.kafka;

import com.company.employee.event.EmployeeEvent;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Slf4j
@ConditionalOnProperty(name = "spring.kafka.enabled", havingValue = "true", matchIfMissing = false)
public class KafkaProducerService {

    private final KafkaTemplate<String, Object> kafkaTemplate;

    @Value("${kafka.topic.employee-events:employee-events}")
    private String employeeEventsTopic;

    @Async
    public void sendEmployeeEvent(EmployeeEvent event) {
        try {
            log.info("Sending employee event: {} for employee ID: {}", 
                    event.getEventType(), event.getEmployeeId());
            
            kafkaTemplate.send(employeeEventsTopic, 
                             event.getEmployeeNumber(), 
                             event);
            
            log.info("Employee event sent successfully to topic: {}", employeeEventsTopic);
        } catch (Exception e) {
            log.error("Error sending employee event to Kafka: {}", e.getMessage(), e);
        }
    }
}
