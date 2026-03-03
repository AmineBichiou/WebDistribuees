package com.company.employee.controller;

import com.company.employee.dto.EmployeeRequest;
import com.company.employee.dto.EmployeeResponse;
import com.company.employee.dto.EmployeeUpdateRequest;
import com.company.employee.entity.EmployeeStatus;
import com.company.employee.service.EmployeeService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/employees")
@RequiredArgsConstructor
@Slf4j
public class EmployeeController {

    private final EmployeeService employeeService;

    /**
     * Créer un nouvel employé
     * POST /api/employees
     */
    @PostMapping
    public ResponseEntity<EmployeeResponse> createEmployee(@Valid @RequestBody EmployeeRequest request) {
        log.info("POST /api/employees - Creating employee: {} {}", request.getNom(), request.getPrenom());
        EmployeeResponse response = employeeService.createEmployee(request);
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    /**
     * Récupérer tous les employés
     * GET /api/employees
     * GET /api/employees?statut=ACTIF
     * GET /api/employees?service=IT
     */
    @GetMapping
    public ResponseEntity<List<EmployeeResponse>> getAllEmployees(
            @RequestParam(required = false) EmployeeStatus statut,
            @RequestParam(required = false) String service,
            @RequestParam(required = false) String poste,
            @RequestParam(required = false) String typeContrat,
            @RequestParam(required = false) String search) {
        log.info("GET /api/employees - Filters: statut={}, service={}, poste={}, typeContrat={}, search={}", 
                statut, service, poste, typeContrat, search);
        
        List<EmployeeResponse> employees;
        
        if (statut != null) {
            employees = employeeService.getEmployeesByStatut(statut);
        } else if (service != null) {
            employees = employeeService.getEmployeesByService(service);
        } else if (poste != null) {
            employees = employeeService.getEmployeesByPoste(poste);
        } else if (typeContrat != null) {
            employees = employeeService.getEmployeesByTypeContrat(typeContrat);
        } else if (search != null) {
            employees = employeeService.searchEmployees(search);
        } else {
            employees = employeeService.getAllEmployees();
        }
        
        return ResponseEntity.ok(employees);
    }

    /**
     * Récupérer un employé par ID
     * GET /api/employees/{id}
     */
    @GetMapping("/{id}")
    public ResponseEntity<EmployeeResponse> getEmployeeById(@PathVariable Long id) {
        log.info("GET /api/employees/{} - Fetching employee by ID", id);
        EmployeeResponse response = employeeService.getEmployeeById(id);
        return ResponseEntity.ok(response);
    }

    /**
     * Récupérer un employé par numéro d'employé
     * GET /api/employees/number/{employeeNumber}
     */
    @GetMapping("/number/{employeeNumber}")
    public ResponseEntity<EmployeeResponse> getEmployeeByNumber(@PathVariable String employeeNumber) {
        log.info("GET /api/employees/number/{} - Fetching employee by number", employeeNumber);
        EmployeeResponse response = employeeService.getEmployeeByEmployeeNumber(employeeNumber);
        return ResponseEntity.ok(response);
    }

    /**
     * Récupérer un employé par email
     * GET /api/employees/email/{email}
     */
    @GetMapping("/email/{email}")
    public ResponseEntity<EmployeeResponse> getEmployeeByEmail(@PathVariable String email) {
        log.info("GET /api/employees/email/{} - Fetching employee by email", email);
        EmployeeResponse response = employeeService.getEmployeeByEmail(email);
        return ResponseEntity.ok(response);
    }

    /**
     * Récupérer tous les employés d'un service
     * GET /api/employees/service/{service}
     */
    @GetMapping("/service/{service}")
    public ResponseEntity<List<EmployeeResponse>> getEmployeesByService(@PathVariable String service) {
        log.info("GET /api/employees/service/{} - Fetching employees by service", service);
        List<EmployeeResponse> employees = employeeService.getEmployeesByService(service);
        return ResponseEntity.ok(employees);
    }

    /**
     * Récupérer tous les employés d'un poste
     * GET /api/employees/poste/{poste}
     */
    @GetMapping("/poste/{poste}")
    public ResponseEntity<List<EmployeeResponse>> getEmployeesByPoste(@PathVariable String poste) {
        log.info("GET /api/employees/poste/{} - Fetching employees by position", poste);
        List<EmployeeResponse> employees = employeeService.getEmployeesByPoste(poste);
        return ResponseEntity.ok(employees);
    }

    /**
     * Mettre à jour un employé
     * PUT /api/employees/{id}
     */
    @PutMapping("/{id}")
    public ResponseEntity<EmployeeResponse> updateEmployee(
            @PathVariable Long id,
            @Valid @RequestBody EmployeeUpdateRequest request) {
        log.info("PUT /api/employees/{} - Updating employee", id);
        EmployeeResponse response = employeeService.updateEmployee(id, request);
        return ResponseEntity.ok(response);
    }

    /**
     * Changer le statut d'un employé
     * PATCH /api/employees/{id}/status
     */
    @PatchMapping("/{id}/status")
    public ResponseEntity<EmployeeResponse> updateEmployeeStatus(
            @PathVariable Long id,
            @RequestParam EmployeeStatus statut) {
        log.info("PATCH /api/employees/{}/status - Changing status to {}", id, statut);
        EmployeeResponse response = employeeService.updateEmployeeStatus(id, statut);
        return ResponseEntity.ok(response);
    }

    /**
     * Supprimer un employé (désactivation)
     * DELETE /api/employees/{id}
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteEmployee(@PathVariable Long id) {
        log.info("DELETE /api/employees/{} - Deleting employee", id);
        employeeService.deleteEmployee(id);
        return ResponseEntity.noContent().build();
    }

    /**
     * Health check
     * GET /api/employees/health
     */
    @GetMapping("/health")
    public ResponseEntity<String> health() {
        return ResponseEntity.ok("Employee Service is running!");
    }
}
