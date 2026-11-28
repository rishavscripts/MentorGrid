package com.mentorgrid.teacher_service;

import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;
import java.util.UUID;

public interface TeacherRepository extends JpaRepository<TeacherProfile, UUID> {
    Optional<TeacherProfile> findByTeacherCodeIgnoreCase(String teacherCode);
    boolean existsByTeacherCode(String teacherCode);
}