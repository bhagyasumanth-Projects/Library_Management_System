package com.library.libraryboot.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.library.libraryboot.model.Book;
import com.library.libraryboot.model.Member;
import com.library.libraryboot.repository.BookRepository;
import com.library.libraryboot.repository.MemberRepository;

@Service
public class LibraryService {

    @Autowired
    private BookRepository bookRepository;

    @Autowired
    private MemberRepository memberRepository;

    // --- BOOK METHODS ---
    public List<Book> getAllBooks() { return bookRepository.findAll(); }
    public Book addBook(Book book) { return bookRepository.save(book); }
    public void deleteBook(Long id) { bookRepository.deleteById(id); }

    // --- MEMBER METHODS ---
    public List<Member> getAllMembers() { return memberRepository.findAll(); }
    public Member addMember(Member member) { return memberRepository.save(member); }

    /**
     * Professional Delete Logic: 
     * Blocks deletion if the member has outstanding books.
     */
    public void deleteMember(Long id) {
        Member member = memberRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Member not found"));

        // Check if any book is linked to this member's ID in the database
        List<Book> booksHeld = bookRepository.findByIssuedTo(member);

        if (!booksHeld.isEmpty()) {
            throw new RuntimeException("Cannot delete member: They must return " + booksHeld.size() + " book(s) first.");
        }

        memberRepository.deleteById(id);
    }

    // --- ISSUE & RETURN LOGIC ---
    public Book issueBook(Long bookId, Long memberId) {
        Book book = bookRepository.findById(bookId).orElseThrow();
        Member member = memberRepository.findById(memberId).orElseThrow();
        
        book.setIssued(true);
        book.setIssuedTo(member); // Assigns the Member object to the Book
        return bookRepository.save(book);
    }

    public Book returnBook(Long bookId) {
        Book book = bookRepository.findById(bookId)
        .orElseThrow(() -> new RuntimeException("Book not found"));
    
        book.setIssued(false);
        book.setIssuedTo(null); // This clears the Foreign Key link in the database
        return bookRepository.save(book);
    }
}