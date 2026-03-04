package com.company.employee.event;

import com.company.employee.entity.EmployeeStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class EmployeeEvent {
    
    private Long employeeId;
    private String employeeNumber;
    private String eventType; // CREATED, UPDATED, STATUS_CHANGED
    private String nom;
    private String prenom;
    private String email;
    private String poste;
    private String service;
    private EmployeeStatus statut;
    private LocalDateTime eventTime;
}
