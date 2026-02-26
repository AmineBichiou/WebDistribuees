package com.esprit.avis.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

// Simple DTO for demonstration
class Avis {
    public Long id;
    public String message;
}

// Service interface
interface AvisService {
    List<Avis> getAllAvis();
    Avis saveAvis(Avis avis);
    Avis updateAvis(Long id, Avis avis);
    void deleteAvis(Long id);
}

@RestController
public class AvisController {

    private AvisService avisService;

    @GetMapping("/avis")
    public List<Avis> getAllAvis() {
        return avisService.getAllAvis();
    }

    @PostMapping("/avis")
    public Avis createAvis(@RequestBody Avis avis) {
        return avisService.saveAvis(avis);
    }

    @PutMapping("/avis/{id}")
    public Avis updateAvis(@PathVariable Long id, @RequestBody Avis avis) {
        return avisService.updateAvis(id, avis);
    }

    @DeleteMapping("/avis/{id}")
    public void deleteAvis(@PathVariable Long id) {
        avisService.deleteAvis(id);
    }
}
