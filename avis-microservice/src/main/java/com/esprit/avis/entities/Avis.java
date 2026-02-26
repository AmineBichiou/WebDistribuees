package com.esprit.avis.entities;

import javax.persistence.Entity;
import javax.persistence.Id;

@Entity
public class Avis {
    @Id
    private Long id;
    private String commentaire;
    private int note;

    // Getters and setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getCommentaire() { return commentaire; }
    public void setCommentaire(String commentaire) { this.commentaire = commentaire; }
    public int getNote() { return note; }
    public void setNote(int note) { this.note = note; }
}
