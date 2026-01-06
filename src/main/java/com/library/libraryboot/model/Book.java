package com.library.libraryboot.model;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;

@Entity
public class Book {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String title;
    private String author;
    private int year;
    private boolean issued = false;

    // This creates the Foreign Key relationship in MySQL
    @ManyToOne
    @JoinColumn(name = "member_id")
    private Member issuedTo; 

    public Book() {}

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }
    public String getAuthor() { return author; }
    public void setAuthor(String author) { this.author = author; }
    public int getYear() { return year; }
    public void setYear(int year) { this.year = year; }
    public boolean isIssued() { return issued; }
    public void setIssued(boolean issued) { this.issued = issued; }
    public Member getIssuedTo() { return issuedTo; }
    public void setIssuedTo(Member issuedTo) { this.issuedTo = issuedTo; }
}