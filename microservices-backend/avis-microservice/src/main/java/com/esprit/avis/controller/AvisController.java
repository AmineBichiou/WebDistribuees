package com.esprit.avis.controller;

import com.esprit.avis.entities.Avis;
import com.esprit.avis.service.AvisService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;


@RestController
@RequestMapping("/avis")
public class AvisController {
    
@Autowired
=======

    @Autowired
    private AvisService avisService;

    @GetMapping
    public List<Avis> getAllAvis() {
        return avisService.getAllAvis();
    }

    @PostMapping
    public Avis createAvis(@RequestBody Avis avis) {
        return avisService.saveAvis(avis);
    }

    @PutMapping("/{id}")
    public Avis updateAvis(@PathVariable Long id, @RequestBody Avis avis) {
        return avisService.updateAvis(id, avis);
    }

    @DeleteMapping("/{id}")
    public void deleteAvis(@PathVariable Long id) {
        avisService.deleteAvis(id);
    }
}