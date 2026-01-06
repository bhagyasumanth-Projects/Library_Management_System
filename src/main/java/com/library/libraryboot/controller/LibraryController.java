package com.library.libraryboot.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.library.libraryboot.model.Book;
import com.library.libraryboot.model.Member;
import com.library.libraryboot.service.LibraryService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "*") // Allows your HTML file to talk to the Spring Boot server
public class LibraryController {

    @Autowired
    private LibraryService libraryService;

    // ===============================
    // Book Endpoints
    // ===============================

    @GetMapping("/books")
    public List<Book> getAllBooks() {
        return libraryService.getAllBooks();
    }

    @PostMapping("/books")
    public Book addBook(@RequestBody Book book) {
        return libraryService.addBook(book);
    }

    @DeleteMapping("/books/{id}")
    public void deleteBook(@PathVariable Long id) {
        libraryService.deleteBook(id);
    }

    // ===============================
    // Member Endpoints
    // ===============================

    @GetMapping("/members")
    public List<Member> getAllMembers() {
        return libraryService.getAllMembers();
    }

    @PostMapping("/members")
    public Member addMember(@Valid @RequestBody Member member) {
        return libraryService.addMember(member);
    }

    @DeleteMapping("/members/{id}")
    public void deleteMember(@PathVariable Long id) {
        // This triggers the service logic that checks for unreturned books
        libraryService.deleteMember(id);
    }

    // ===============================
    // Issue & Return Endpoints (The Bridge)
    // ===============================

    // Updated to accept memberId for the Foreign Key relationship
    @PostMapping("/books/issue/{bookId}/{memberId}")
    public Book issueBook(@PathVariable Long bookId, @PathVariable Long memberId) {
        return libraryService.issueBook(bookId, memberId);
    }

    @PostMapping("/books/return/{bookId}")
    public Book returnBook(@PathVariable Long bookId) {
        return libraryService.returnBook(bookId);
    }
}