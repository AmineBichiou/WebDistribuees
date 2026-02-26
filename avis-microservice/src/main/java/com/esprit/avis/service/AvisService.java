package com.esprit.avis.service;

import com.esprit.avis.entities.Avis;
import com.esprit.avis.repository.AvisRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class AvisService {
    @Autowired
    private AvisRepository avisRepository;

    public List<Avis> getAllAvis() {
        return avisRepository.findAll();
    }

    public Avis saveAvis(Avis avis) {
        return avisRepository.save(avis);
    }

    public Avis updateAvis(Long id, Avis avis) {
        Avis existing = avisRepository.findById(id).orElse(null);
        if (existing != null) {
            existing.setCommentaire(avis.getCommentaire());
            existing.setNote(avis.getNote());
            return avisRepository.save(existing);
        }
        return null;
    }

    public void deleteAvis(Long id) {
        avisRepository.deleteById(id);
    }
}
