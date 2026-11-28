package com.mentorgrid.teacher_service;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestClient;
import org.springframework.web.server.ResponseStatusException;

import java.security.SecureRandom;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/teachers")
public class TeacherController {

    private final TeacherRepository teacherRepository;
    private final RestClient restClient;
    private final SecureRandom secureRandom = new SecureRandom();

    public TeacherController(TeacherRepository teacherRepository, RestClient.Builder restClientBuilder) {
        this.teacherRepository = teacherRepository;
        this.restClient = restClientBuilder.build();
    }

    public record TeacherProfileRequest(
            @NotBlank String fullName,
            @NotBlank String department,
            String designation,
            String specialization,
            String phone
    ) {
    }

    @PostMapping("/profile")
    public ResponseEntity<TeacherProfile> saveProfile(
            @RequestHeader("X-User-Id") String userIdHeader,
            @RequestHeader("X-User-Role") String role,
            @RequestHeader("X-User-Email") String email,
            @Valid @RequestBody TeacherProfileRequest req
    ) {
        if (!"TEACHER".equalsIgnoreCase(role)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Only TEACHER accounts can manage teacher profiles.");
        }

        UUID userId = UUID.fromString(userIdHeader);
        boolean isNew = !teacherRepository.existsById(userId);

        TeacherProfile profile = teacherRepository.findById(userId).orElseGet(() -> {
            TeacherProfile created = new TeacherProfile();
            created.setUserId(userId);
            created.setEmail(email);
            created.setTeacherCode(generateUniqueTeacherCode());
            return created;
        });

        profile.setFullName(req.fullName().trim());
        profile.setDepartment(req.department().trim());
        profile.setDesignation(req.designation());
        profile.setSpecialization(req.specialization());
        profile.setPhone(req.phone());

        TeacherProfile saved = teacherRepository.save(profile);

        if (isNew) {
            syncAuthProfileStatus(userId, saved.getTeacherCode());
        }

        return ResponseEntity.status(isNew ? HttpStatus.CREATED : HttpStatus.OK).body(saved);
    }

    @GetMapping("/me")
    public ResponseEntity<TeacherProfile> getMyProfile(@RequestHeader("X-User-Id") String userIdHeader) {
        UUID userId = UUID.fromString(userIdHeader);
        TeacherProfile profile = teacherRepository.findById(userId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Teacher profile not completed yet."));
        return ResponseEntity.ok(profile);
    }

    @GetMapping
    public List<TeacherProfile> listAllTeachers() {
        return teacherRepository.findAll();
    }

    @GetMapping("/code/{teacherCode}")
    public ResponseEntity<TeacherProfile> getByTeacherCode(@PathVariable String teacherCode) {
        TeacherProfile profile = teacherRepository.findByTeacherCodeIgnoreCase(teacherCode.trim())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "No mentor found with ID: " + teacherCode));
        return ResponseEntity.ok(profile);
    }

    private String generateUniqueTeacherCode() {
        String code;
        do {
            int num = 100000 + secureRandom.nextInt(900000);
            code = "T_" + num;
        } while (teacherRepository.existsByTeacherCode(code));
        return code;
    }

    private void syncAuthProfileStatus(UUID userId, String teacherCode) {
        try {
            restClient.patch()
                    .uri("http://auth-service/api/auth/internal/users/{userId}/profile-status", userId)
                    .body(Map.of("displayId", teacherCode, "profileCompleted", true))
                    .retrieve()
                    .toBodilessEntity();
        } catch (Exception ignored) {
            // Prevents profile creation rollback if auth-service is temporarily unreachable
        }
    }
}