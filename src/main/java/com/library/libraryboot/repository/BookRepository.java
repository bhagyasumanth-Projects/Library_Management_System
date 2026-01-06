package com.library.libraryboot.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.library.libraryboot.model.Book;
import com.library.libraryboot.model.Member;

public interface BookRepository extends JpaRepository<Book, Long> {
    // Finds all books currently held by a specific member object
    List<Book> findByIssuedTo(Member member);
}