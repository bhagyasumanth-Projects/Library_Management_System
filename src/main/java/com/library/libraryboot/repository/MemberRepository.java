package com.library.libraryboot.repository;
import org.springframework.data.jpa.repository.JpaRepository;

import com.library.libraryboot.model.Member;

public interface MemberRepository extends JpaRepository<Member, Long> {
}