package com.company.employee.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "employees")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Employee {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String employeeNumber;

    @Column(nullable = false, length = 50)
    private String nom;

    @Column(nullable = false, length = 50)
    private String prenom;

    @Column(nullable = false)
    private LocalDate dateNaissance;

    @Column(nullable = false, length = 20)
    private String telephone;

    @Column(nullable = false, unique = true, length = 100)
    private String email;

    @Column(length = 150)
    private String adresse;

    @Column(nullable = false, length = 50)
    private String poste;

    @Column(nullable = false, length = 50)
    private String service;

    @Column(nullable = false)
    private LocalDate dateEmbauche;

    @Column(nullable = false, length = 20)
    private String typeContrat;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private EmployeeStatus statut;

    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal salaire;

    @Column(precision = 10, scale = 2)
    private BigDecimal prime;

    @Column(nullable = false)
    private Integer heuresTravailParSemaine;

    @Column(nullable = false, length = 20)
    private String typeShift;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
        if (statut == null) {
            statut = EmployeeStatus.ACTIF;
        }
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
}
