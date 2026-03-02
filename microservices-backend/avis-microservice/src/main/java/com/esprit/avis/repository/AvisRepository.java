package com.esprit.avis.repository;

import com.esprit.avis.entities.Avis;
import org.springframework.data.jpa.repository.JpaRepository;

public interface AvisRepository extends JpaRepository<Avis, Long> {
}
