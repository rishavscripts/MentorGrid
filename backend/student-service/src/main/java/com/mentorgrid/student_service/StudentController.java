package com.mentorgrid.student_service;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.client.RestClient;
import org.springframework.web.server.ResponseStatusException;

import java.security.SecureRandom;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/students")
public class StudentController {

    private final StudentRepository studentRepository;
    private final RestClient restClient;
    private final SecureRandom secureRandom = new SecureRandom();

    public StudentController(StudentRepository studentRepository, RestClient.Builder restClientBuilder) {
        this.studentRepository = studentRepository;
        this.restClient = restClientBuilder.build();
    }

    public record StudentProfileRequest(
            @NotBlank String fullName,
            @NotBlank String department,
            String semester,
            String rollNumber,
            String phone,
            String mentorCode
    ) {}

    public record AssignMentorRequest(
            @NotBlank String mentorCode
    ) {}

    public record TeacherSummary(
            UUID userId,
            String teacherCode,
            String fullName,
            String department
    ) {}

    @PostMapping("/profile")
    public ResponseEntity<StudentProfile> saveProfile(
            @RequestHeader("X-User-Id") String userIdHeader,
            @RequestHeader("X-User-Role") String role,
            @RequestHeader("X-User-Email") String email,
            @Valid @RequestBody StudentProfileRequest req
    ) {
        if (!"STUDENT".equalsIgnoreCase(role)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Only STUDENT accounts can manage student profiles.");
        }

        UUID userId = UUID.fromString(userIdHeader);
        boolean isNew = !studentRepository.existsById(userId);

        StudentProfile profile = studentRepository.findById(userId).orElseGet(() -> {
            StudentProfile created = new StudentProfile();
            created.setUserId(userId);
            created.setEmail(email);
            created.setStudentCode(generateUniqueStudentCode());
            return created;
        });

        profile.setFullName(req.fullName().trim());
        profile.setDepartment(req.department().trim());
        profile.setSemester(req.semester());
        profile.setRollNumber(req.rollNumber());
        profile.setPhone(req.phone());

        if (req.mentorCode() != null && !req.mentorCode().isBlank()) {
            TeacherSummary teacher = fetchTeacherByCode(req.mentorCode().trim());
            profile.setMentorCode(teacher.teacherCode());
            profile.setMentorName(teacher.fullName());
        }

        StudentProfile saved = studentRepository.save(profile);

        if (isNew) {
            syncAuthProfileStatus(userId, saved.getStudentCode());
        }

        return ResponseEntity.status(isNew ? HttpStatus.CREATED : HttpStatus.OK).body(saved);
    }

    @GetMapping("/me")
    public ResponseEntity<StudentProfile> getMyProfile(@RequestHeader("X-User-Id") String userIdHeader) {
        UUID userId = UUID.fromString(userIdHeader);
        StudentProfile profile = studentRepository.findById(userId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Student profile not completed yet."));
        return ResponseEntity.ok(profile);
    }

    @PatchMapping("/assign-mentor")
    public ResponseEntity<StudentProfile> assignMentor(
            @RequestHeader("X-User-Id") String userIdHeader,
            @RequestHeader("X-User-Role") String role,
            @Valid @RequestBody AssignMentorRequest req
    ) {
        if (!"STUDENT".equalsIgnoreCase(role)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Only STUDENT accounts can select a mentor.");
        }

        UUID userId = UUID.fromString(userIdHeader);
        StudentProfile profile = studentRepository.findById(userId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Complete your student profile before selecting a mentor."));

        TeacherSummary teacher = fetchTeacherByCode(req.mentorCode().trim());
        profile.setMentorCode(teacher.teacherCode());
        profile.setMentorName(teacher.fullName());

        return ResponseEntity.ok(studentRepository.save(profile));
    }

    @GetMapping("/mentor/{mentorCode}")
    public List<StudentProfile> getMenteesByMentorCode(@PathVariable String mentorCode) {
        return studentRepository.findByMentorCodeIgnoreCase(mentorCode.trim());
    }

    @GetMapping
    public List<StudentProfile> listAllStudents() {
        return studentRepository.findAll();
    }

    private TeacherSummary fetchTeacherByCode(String mentorCode) {
        try {
            return restClient.get()
                    .uri("http://teacher-service/api/teachers/code/{code}", mentorCode)
                    .retrieve()
                    .body(TeacherSummary.class);
        } catch (HttpClientErrorException.NotFound e) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Invalid Mentor ID: " + mentorCode);
        } catch (Exception e) {
            throw new ResponseStatusException(HttpStatus.SERVICE_UNAVAILABLE, "Unable to verify Mentor ID right now.");
        }
    }

    private String generateUniqueStudentCode() {
        String code;
        do {
            int num = 100000 + secureRandom.nextInt(900000);
            code = "S_" + num;
        } while (studentRepository.existsByStudentCode(code));
        return code;
    }

    private void syncAuthProfileStatus(UUID userId, String studentCode) {
        try {
            restClient.patch()
                    .uri("http://auth-service/api/auth/internal/users/{userId}/profile-status", userId)
                    .body(Map.of("displayId", studentCode, "profileCompleted", true))
                    .retrieve()
                    .toBodilessEntity();
        } catch (Exception ignored) {
            // Prevents profile creation rollback if auth-service is temporarily unreachable
        }
    }
}
