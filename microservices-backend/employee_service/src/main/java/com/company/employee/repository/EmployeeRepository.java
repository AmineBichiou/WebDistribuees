package com.company.employee.repository;

import com.company.employee.entity.Employee;
import com.company.employee.entity.EmployeeStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface EmployeeRepository extends JpaRepository<Employee, Long> {

    // Trouver un employé par numéro d'employé
    Optional<Employee> findByEmployeeNumber(String employeeNumber);

    // Trouver un employé par email
    Optional<Employee> findByEmail(String email);

    // Trouver tous les employés d'un service
    List<Employee> findByService(String service);

    // Trouver tous les employés d'un poste
    List<Employee> findByPoste(String poste);

    // Trouver les employés par statut
    List<Employee> findByStatut(EmployeeStatus statut);

    // Trouver les employés d'un service avec un statut spécifique
    List<Employee> findByServiceAndStatut(String service, EmployeeStatus statut);

    // Trouver les employés par type de contrat
    List<Employee> findByTypeContrat(String typeContrat);

    // Trouver les employés par type de shift
    List<Employee> findByTypeShift(String typeShift);

    // Compter les employés d'un service
    long countByService(String service);

    // Vérifier si un email existe déjà
    boolean existsByEmail(String email);

    // Vérifier si un numéro d'employé existe déjà
    boolean existsByEmployeeNumber(String employeeNumber);

    // Trouver les employés dont le nom contient une chaîne
    List<Employee> findByNomContainingIgnoreCaseOrPrenomContainingIgnoreCase(String nom, String prenom);
}
