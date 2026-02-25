package com.esprit.avis.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class AvisController {
    @GetMapping("/avis")
    public String getAvis() {
        return "Avis service is running!";
    }
}
