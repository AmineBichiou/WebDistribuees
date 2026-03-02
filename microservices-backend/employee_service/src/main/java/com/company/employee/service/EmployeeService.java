package com.company.employee.service;

import com.company.employee.dto.EmployeeRequest;
import com.company.employee.dto.EmployeeResponse;
import com.company.employee.dto.EmployeeUpdateRequest;
import com.company.employee.entity.Employee;
import com.company.employee.entity.EmployeeStatus;
import com.company.employee.event.EmployeeEvent;
import com.company.employee.exception.EmployeeNotFoundException;
import com.company.employee.exception.InvalidEmployeeException;
import com.company.employee.kafka.KafkaProducerService;
import com.company.employee.repository.EmployeeRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.Period;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@Slf4j
public class EmployeeService {

    private final EmployeeRepository employeeRepository;
    
    @Autowired(required = false)
    private KafkaProducerService kafkaProducerService;
    
    public EmployeeService(EmployeeRepository employeeRepository) {
        this.employeeRepository = employeeRepository;
    }

    /**
     * Créer un nouvel employé
     */
    @Transactional
    public EmployeeResponse createEmployee(EmployeeRequest request) {
        log.info("Creating new employee: {} {}", request.getNom(), request.getPrenom());

        // Validation
        validateEmployee(request);

        // Vérifier si l'email existe déjà
        if (employeeRepository.existsByEmail(request.getEmail())) {
            throw new InvalidEmployeeException("Un employé avec cet email existe déjà");
        }

        // Créer l'entité Employee
        Employee employee = new Employee();
        employee.setEmployeeNumber(generateEmployeeNumber());
        employee.setNom(request.getNom());
        employee.setPrenom(request.getPrenom());
        employee.setDateNaissance(request.getDateNaissance());
        employee.setTelephone(request.getTelephone());
        employee.setEmail(request.getEmail());
        employee.setAdresse(request.getAdresse());
        employee.setPoste(request.getPoste());
        employee.setService(request.getService());
        employee.setDateEmbauche(request.getDateEmbauche());
        employee.setTypeContrat(request.getTypeContrat());
        employee.setSalaire(request.getSalaire());
        employee.setPrime(request.getPrime());
        employee.setHeuresTravailParSemaine(request.getHeuresTravailParSemaine());
        employee.setTypeShift(request.getTypeShift());
        employee.setStatut(EmployeeStatus.ACTIF);

        // Sauvegarder
        Employee savedEmployee = employeeRepository.save(employee);
        log.info("Employee created successfully with number: {}", savedEmployee.getEmployeeNumber());

        // Publier l'événement Kafka
        publishEmployeeEvent(savedEmployee, "CREATED");

        return mapToResponse(savedEmployee);
    }

    /**
     * Récupérer tous les employés
     */
    public List<EmployeeResponse> getAllEmployees() {
        log.info("Fetching all employees");
        return employeeRepository.findAll().stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    /**
     * Récupérer un employé par ID
     */
    public EmployeeResponse getEmployeeById(Long id) {
        log.info("Fetching employee with ID: {}", id);
        Employee employee = employeeRepository.findById(id)
                .orElseThrow(() -> new EmployeeNotFoundException("Employé non trouvé avec l'ID: " + id));
        return mapToResponse(employee);
    }

    /**
     * Récupérer un employé par numéro d'employé
     */
    public EmployeeResponse getEmployeeByEmployeeNumber(String employeeNumber) {
        log.info("Fetching employee with number: {}", employeeNumber);
        Employee employee = employeeRepository.findByEmployeeNumber(employeeNumber)
                .orElseThrow(() -> new EmployeeNotFoundException("Employé non trouvé avec le numéro: " + employeeNumber));
        return mapToResponse(employee);
    }

    /**
     * Récupérer un employé par email
     */
    public EmployeeResponse getEmployeeByEmail(String email) {
        log.info("Fetching employee with email: {}", email);
        Employee employee = employeeRepository.findByEmail(email)
                .orElseThrow(() -> new EmployeeNotFoundException("Employé non trouvé avec l'email: " + email));
        return mapToResponse(employee);
    }

    /**
     * Récupérer tous les employés d'un service
     */
    public List<EmployeeResponse> getEmployeesByService(String service) {
        log.info("Fetching employees for service: {}", service);
        return employeeRepository.findByService(service).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    /**
     * Récupérer tous les employés d'un poste
     */
    public List<EmployeeResponse> getEmployeesByPoste(String poste) {
        log.info("Fetching employees for position: {}", poste);
        return employeeRepository.findByPoste(poste).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    /**
     * Récupérer les employés par statut
     */
    public List<EmployeeResponse> getEmployeesByStatut(EmployeeStatus statut) {
        log.info("Fetching employees with status: {}", statut);
        return employeeRepository.findByStatut(statut).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    /**
     * Récupérer les employés par type de contrat
     */
    public List<EmployeeResponse> getEmployeesByTypeContrat(String typeContrat) {
        log.info("Fetching employees with contract type: {}", typeContrat);
        return employeeRepository.findByTypeContrat(typeContrat).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    /**
     * Rechercher des employés par nom ou prénom
     */
    public List<EmployeeResponse> searchEmployees(String searchTerm) {
        log.info("Searching employees with term: {}", searchTerm);
        return employeeRepository.findByNomContainingIgnoreCaseOrPrenomContainingIgnoreCase(searchTerm, searchTerm).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    /**
     * Mettre à jour un employé
     */
    @Transactional
    public EmployeeResponse updateEmployee(Long id, EmployeeUpdateRequest request) {
        log.info("Updating employee with ID: {}", id);

        Employee employee = employeeRepository.findById(id)
                .orElseThrow(() -> new EmployeeNotFoundException("Employé non trouvé avec l'ID: " + id));

        // Vérifier que l'employé peut être modifié
        if (employee.getStatut() == EmployeeStatus.DEMISSIONAIRE) {
            throw new InvalidEmployeeException("Impossible de modifier un employé démissionnaire");
        }

        // Mettre à jour les champs si fournis
        if (request.getTelephone() != null) {
            employee.setTelephone(request.getTelephone());
        }

        if (request.getEmail() != null) {
            // Vérifier si le nouvel email n'existe pas déjà
            if (!employee.getEmail().equals(request.getEmail()) && 
                employeeRepository.existsByEmail(request.getEmail())) {
                throw new InvalidEmployeeException("Un employé avec cet email existe déjà");
            }
            employee.setEmail(request.getEmail());
        }

        if (request.getAdresse() != null) {
            employee.setAdresse(request.getAdresse());
        }

        if (request.getPoste() != null) {
            employee.setPoste(request.getPoste());
        }

        if (request.getService() != null) {
            employee.setService(request.getService());
        }

        if (request.getTypeContrat() != null) {
            employee.setTypeContrat(request.getTypeContrat());
        }

        if (request.getSalaire() != null) {
            employee.setSalaire(request.getSalaire());
        }

        if (request.getPrime() != null) {
            employee.setPrime(request.getPrime());
        }

        if (request.getHeuresTravailParSemaine() != null) {
            employee.setHeuresTravailParSemaine(request.getHeuresTravailParSemaine());
        }

        if (request.getTypeShift() != null) {
            employee.setTypeShift(request.getTypeShift());
        }

        Employee updatedEmployee = employeeRepository.save(employee);
        log.info("Employee updated successfully: {}", id);

        // Publier l'événement Kafka
        publishEmployeeEvent(updatedEmployee, "UPDATED");

        return mapToResponse(updatedEmployee);
    }

    /**
     * Changer le statut d'un employé
     */
    @Transactional
    public EmployeeResponse updateEmployeeStatus(Long id, EmployeeStatus newStatus) {
        log.info("Updating employee status with ID: {} to: {}", id, newStatus);

        Employee employee = employeeRepository.findById(id)
                .orElseThrow(() -> new EmployeeNotFoundException("Employé non trouvé avec l'ID: " + id));

        EmployeeStatus oldStatus = employee.getStatut();
        employee.setStatut(newStatus);
        Employee updatedEmployee = employeeRepository.save(employee);
        
        log.info("Employee status updated from {} to {}", oldStatus, newStatus);

        // Publier l'événement Kafka
        publishEmployeeEvent(updatedEmployee, "STATUS_CHANGED");

        return mapToResponse(updatedEmployee);
    }

    /**
     * Supprimer un employé (soft delete via statut INACTIF)
     */
    @Transactional
    public void deleteEmployee(Long id) {
        log.info("Deleting employee with ID: {}", id);
        
        Employee employee = employeeRepository.findById(id)
                .orElseThrow(() -> new EmployeeNotFoundException("Employé non trouvé avec l'ID: " + id));

        // On désactive plutôt que de supprimer physiquement
        employee.setStatut(EmployeeStatus.INACTIF);
        employeeRepository.save(employee);
        log.info("Employee deleted (deactivated) successfully: {}", id);
    }

    // ==================== Helper Methods ====================

    /**
     * Valider les données de l'employé
     */
    private void validateEmployee(EmployeeRequest request) {
        // Vérifier l'âge minimum (18 ans)
        LocalDate today = LocalDate.now();
        Period age = Period.between(request.getDateNaissance(), today);
        if (age.getYears() < 18) {
            throw new InvalidEmployeeException("L'employé doit avoir au moins 18 ans");
        }

        // Vérifier que la date d'embauche n'est pas dans le futur lointain
        if (request.getDateEmbauche().isAfter(today.plusYears(1))) {
            throw new InvalidEmployeeException("La date d'embauche ne peut pas être dans plus d'un an");
        }
    }

    /**
     * Générer un numéro d'employé unique
     */
    private String generateEmployeeNumber() {
        String employeeNumber;
        do {
            employeeNumber = "EMP-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase();
        } while (employeeRepository.existsByEmployeeNumber(employeeNumber));
        return employeeNumber;
    }

    /**
     * Publier un événement Kafka pour un employé
     */
    private void publishEmployeeEvent(Employee employee, String eventType) {
        if (kafkaProducerService == null) {
            log.debug("Kafka is disabled. Skipping event publishing for employee: {}", employee.getEmployeeNumber());
            return;
        }
        
        EmployeeEvent event = EmployeeEvent.builder()
                .employeeId(employee.getId())
                .employeeNumber(employee.getEmployeeNumber())
                .eventType(eventType)
                .nom(employee.getNom())
                .prenom(employee.getPrenom())
                .email(employee.getEmail())
                .poste(employee.getPoste())
                .service(employee.getService())
                .statut(employee.getStatut())
                .eventTime(LocalDateTime.now())
                .build();
        
        kafkaProducerService.sendEmployeeEvent(event);
    }

    /**
     * Mapper Employee vers EmployeeResponse
     */
    private EmployeeResponse mapToResponse(Employee employee) {
        EmployeeResponse response = new EmployeeResponse();
        response.setId(employee.getId());
        response.setEmployeeNumber(employee.getEmployeeNumber());
        response.setNom(employee.getNom());
        response.setPrenom(employee.getPrenom());
        response.setDateNaissance(employee.getDateNaissance());
        response.setTelephone(employee.getTelephone());
        response.setEmail(employee.getEmail());
        response.setAdresse(employee.getAdresse());
        response.setPoste(employee.getPoste());
        response.setService(employee.getService());
        response.setDateEmbauche(employee.getDateEmbauche());
        response.setTypeContrat(employee.getTypeContrat());
        response.setStatut(employee.getStatut());
        response.setSalaire(employee.getSalaire());
        response.setPrime(employee.getPrime());
        response.setHeuresTravailParSemaine(employee.getHeuresTravailParSemaine());
        response.setTypeShift(employee.getTypeShift());
        response.setCreatedAt(employee.getCreatedAt());
        response.setUpdatedAt(employee.getUpdatedAt());
        return response;
    }
}
