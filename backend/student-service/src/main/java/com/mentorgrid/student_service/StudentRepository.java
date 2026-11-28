package com.mentorgrid.student_service;

import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface StudentRepository extends JpaRepository<StudentProfile, UUID> {
    Optional<StudentProfile> findByStudentCodeIgnoreCase(String studentCode);
    boolean existsByStudentCode(String studentCode);
    List<StudentProfile> findByMentorCodeIgnoreCase(String mentorCode);
}
