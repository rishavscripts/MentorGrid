package com.mentorgrid.auth_service;

import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;
import java.util.UUID;

public interface UserRepository extends JpaRepository<UserCredential, UUID> {
    Optional<UserCredential> findByEmailIgnoreCase(String email);
    boolean existsByEmailIgnoreCase(String email);
}
