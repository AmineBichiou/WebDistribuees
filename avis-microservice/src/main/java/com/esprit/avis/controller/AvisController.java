package com.esprit.avis.controller;

import com.esprit.avis.entities.Avis;
import com.esprit.avis.service.AvisService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;


@RestController
public class AvisController {
    
@Autowired
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
