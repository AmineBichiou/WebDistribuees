package com.company.employee.dto;

import com.company.employee.entity.EmployeeStatus;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class EmployeeResponse {

    private Long id;
    private String employeeNumber;
    private String nom;
    private String prenom;
    private LocalDate dateNaissance;
    private String telephone;
    private String email;
    private String adresse;
    private String poste;
    private String service;
    private LocalDate dateEmbauche;
    private String typeContrat;
    private EmployeeStatus statut;
    private BigDecimal salaire;
    private BigDecimal prime;
    private Integer heuresTravailParSemaine;
    private String typeShift;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
