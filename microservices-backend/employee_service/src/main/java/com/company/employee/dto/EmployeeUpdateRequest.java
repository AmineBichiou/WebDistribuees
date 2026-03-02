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
public class EmployeeUpdateRequest {

    @Size(max = 20, message = "Le téléphone ne peut pas dépasser 20 caractères")
    @Pattern(regexp = "^[0-9+\\-\\s()]+$", message = "Format de téléphone invalide")
    private String telephone;

    @Email(message = "Format d'email invalide")
    @Size(max = 100, message = "L'email ne peut pas dépasser 100 caractères")
    private String email;

    @Size(max = 150, message = "L'adresse ne peut pas dépasser 150 caractères")
    private String adresse;

    @Size(max = 50, message = "Le poste ne peut pas dépasser 50 caractères")
    private String poste;

    @Size(max = 50, message = "Le service ne peut pas dépasser 50 caractères")
    private String service;

    @Size(max = 20, message = "Le type de contrat ne peut pas dépasser 20 caractères")
    private String typeContrat;

    @DecimalMin(value = "0.0", inclusive = false, message = "Le salaire doit être supérieur à 0")
    private BigDecimal salaire;

    @DecimalMin(value = "0.0", message = "La prime doit être positive ou nulle")
    private BigDecimal prime;

    @Min(value = 1, message = "Au moins 1 heure par semaine est requise")
    @Max(value = 70, message = "Maximum 70 heures par semaine")
    private Integer heuresTravailParSemaine;

    @Size(max = 20, message = "Le type de shift ne peut pas dépasser 20 caractères")
    private String typeShift;
}
