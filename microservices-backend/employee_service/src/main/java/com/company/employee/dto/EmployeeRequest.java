package com.company.employee.dto;

import jakarta.validation.constraints.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class EmployeeRequest {

    @NotBlank(message = "Le nom est obligatoire")
    @Size(max = 50, message = "Le nom ne peut pas dépasser 50 caractères")
    private String nom;

    @NotBlank(message = "Le prénom est obligatoire")
    @Size(max = 50, message = "Le prénom ne peut pas dépasser 50 caractères")
    private String prenom;

    @NotNull(message = "La date de naissance est obligatoire")
    @Past(message = "La date de naissance doit être dans le passé")
    private LocalDate dateNaissance;

    @NotBlank(message = "Le téléphone est obligatoire")
    @Size(max = 20, message = "Le téléphone ne peut pas dépasser 20 caractères")
    private String telephone;

    @NotBlank(message = "L'email est obligatoire")
    @Email(message = "Format d'email invalide")
    @Size(max = 100, message = "L'email ne peut pas dépasser 100 caractères")
    private String email;

    @Size(max = 150, message = "L'adresse ne peut pas dépasser 150 caractères")
    private String adresse;

    @NotBlank(message = "Le poste est obligatoire")
    @Size(max = 50, message = "Le poste ne peut pas dépasser 50 caractères")
    private String poste;

    @NotBlank(message = "Le service est obligatoire")
    @Size(max = 50, message = "Le service ne peut pas dépasser 50 caractères")
    private String service;

    @NotNull(message = "La date d'embauche est obligatoire")
    private LocalDate dateEmbauche;

    @NotBlank(message = "Le type de contrat est obligatoire")
    @Size(max = 20, message = "Le type de contrat ne peut pas dépasser 20 caractères")
    private String typeContrat;

    @NotNull(message = "Le salaire est obligatoire")
    @DecimalMin(value = "0.0", inclusive = false, message = "Le salaire doit être supérieur à 0")
    private BigDecimal salaire;

    @DecimalMin(value = "0.0", message = "La prime doit être positive ou nulle")
    private BigDecimal prime;

    @NotNull(message = "Les heures de travail par semaine sont obligatoires")
    @Min(value = 1, message = "Au moins 1 heure par semaine est requise")
    @Max(value = 70, message = "Maximum 70 heures par semaine")
    private Integer heuresTravailParSemaine;

    @NotBlank(message = "Le type de shift est obligatoire")
    @Size(max = 20, message = "Le type de shift ne peut pas dépasser 20 caractères")
    private String typeShift;
}
