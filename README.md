# MentorGrid

**Student-Mentor Management Platform**  
*Built with Spring Boot Microservices, Spring Cloud API Gateway & Eureka, PostgreSQL, and React (Vite)*

---

## 1. Project Overview & Objectives

**MentorGrid** is a distributed web application designed to manage academic mentorship between students and faculty mentors. Built on a production-style Spring Boot microservices architecture backed by PostgreSQL and a React frontend, the system enforces strict service isolation, role-based access control (RBAC), and live API integration without client-side mock data.

### Key Architectural Pillars
* **Two Primary User Roles:** `STUDENT` and `TEACHER`, each with dedicated onboarding flows and isolated workspaces.
* **Single Gateway Entry Point:** The React client communicates exclusively with the API Gateway (`http://localhost:8080/api`), never directly with downstream microservice ports.
* **Database-per-Service Isolation:** Each domain microservice owns its own dedicated PostgreSQL database to prevent tight coupling.

---

## 2. System Architecture & Service Topology

All backend services register dynamically with the Netflix Eureka Discovery Server. Incoming requests pass through the Spring Cloud API Gateway, which validates JSON Web Tokens (JWTs) and forwards trusted identity headers (`X-User-Id`, `X-User-Role`) to downstream services.

```text
[ React Frontend (:5173) ] ──(REST + Bearer JWT)──▶ [ API Gateway (:8080) ]
                                                           │
                       ┌───────────────────────────────────┴───────────────────────────────────┐
                       ▼                                   ▼                                   ▼
            [ Auth Service (:8081) ]            [ Teacher Service (:8083) ]         [ Student Service (:8082) ]
                       │                                   │                                   │
                       ▼                                   ▼                                   ▼
             PostgreSQL: auth_db                 PostgreSQL: teacher_db              PostgreSQL: student_db

* All services register and resolve dynamically via [ Eureka Discovery Server (:8761) ]
```

### Microservices Breakdown

| Service Module | Port | Database | Core Responsibilities |
| :--- | :--- | :--- | :--- |
| **`discovery-server`** | `8761` | None | Netflix Eureka registry enabling dynamic service discovery and load-balanced routing (`lb://SERVICE-NAME`). |
| **`api-gateway`** | `8080` | None | Centralized routing, unified CORS configuration, JWT signature validation, and header injection. |
| **`auth-service`** | `8081` | `auth_db` | User registration (`STUDENT` or `TEACHER`), BCrypt password hashing, login authentication, and JWT generation. |
| **`student-service`** | `8082` | `student_db` | Student profile creation, `S_XXXXXXXX` ID generation, mentor assignment, and teacher-authorized student CRUD and search. |
| **`teacher-service`** | `8083` | `teacher_db` | Teacher profile creation, `T_XXXXXXXX` ID generation, mentor directory listing, and cohort announcement publishing. |

---

## 3. Dual-ID Identification Strategy

To balance internal database security with human usability, every student and teacher record maintains two distinct identifiers:

1. **System Primary Key (`UUID`):** Used internally for database primary keys, JWT subject claims, and cross-service linking. Prevents sequential ID enumeration attacks.
2. **Public Display ID (`VARCHAR(10) UNIQUE`):** Generated automatically upon profile creation using a cryptographically secure 8-character alphanumeric generator prefixed by role:
   * **Student Prefix:** `S_XXXXXXXX` (e.g., `S_12Ac7709`) — displayed on student badges and used in teacher search bars.
   * **Teacher Prefix:** `T_XXXXXXXX` (e.g., `T_34h7Dgah`) — displayed in mentor selection dropdowns and faculty dashboards.

---

## 4. End-to-End User Workflows

### 4.1 Student Workflow
1. **Account Creation & Login:** Student registers with role `STUDENT` in `auth-service`, receives a system UUID, and authenticates to obtain a JWT.
2. **Profile Onboarding:** On first login, the student completes their personal and academic profile form and selects their faculty mentor from a live dropdown populated by `teacher-service` (formatted as `Name - Department (T_XXXXXXXX)`).
3. **ID Generation & Dashboard:** Saving the profile generates their unique `S_XXXXXXXX` ID and routes them to the Student Dashboard, which displays their profile card, assigned mentor details, and a live feed of announcements published by that mentor.

### 4.2 Teacher / Faculty Mentor Workflow
1. **Account Creation & Onboarding:** Faculty member registers with role `TEACHER`, logs in, and completes their faculty profile, generating their unique `T_XXXXXXXX` ID so students can select them.
2. **Mentee Control Board:** The Teacher Dashboard queries `student-service` to display all students assigned to that teacher's `T_XXXXXXXX` ID in an interactive table.
3. **Student CRUD & Search:** From the control board, the teacher can search mentees by Full Name or `S_XXXXXXXX` ID, add new student entries, edit existing student details, or remove student records directly in `student_db`.
4. **Announcement Broadcasting:** The teacher can compose and publish text announcements stored in `teacher_db`, which immediately appear on the dashboards of all students linked to that mentor.

---

## 5. Frontend Architecture & Page Blueprint

The **React (Vite + Tailwind CSS)** frontend connects directly to the Spring Boot API Gateway via a configured Axios client with JWT interceptors. No hardcoded mock datasets are used; all forms, dropdowns, tables, and feeds reflect live PostgreSQL persistence.

| Page Name | Route | Access | Functional Scope |
| :--- | :--- | :--- | :--- |
| **Landing Page** | `/` | Public | System overview with architecture navigation header, dual-ID node highlights, portal comparison, and operational footer. |
| **Register Page** | `/register` | Public | Role selector cards (`STUDENT` / `TEACHER`) and credential registration via `POST /api/auth/register`. |
| **Login Page** | `/login` | Public | Authenticates via `POST /api/auth/login`, stores JWT, and routes to onboarding or role dashboard. |
| **Student Profile Page** | `/student/profile` | `STUDENT` | Personal details form + live mentor selector dropdown; generates `S_XXXXXXXX` on initial save. |
| **Student Dashboard** | `/student/dashboard` | `STUDENT` | Displays copyable `S_XXXXXXXX` badge, student profile summary, mentor info card, and live mentor announcements. |
| **Teacher Profile Page** | `/teacher/profile` | `TEACHER` | Faculty metadata form (name, department, designation, cabin, contact); generates `T_XXXXXXXX` on save. |
| **Teacher Dashboard** | `/teacher/dashboard` | `TEACHER` | Announcement publisher box + managed students table with search (Name / `S_ID`), Add modal, Edit modal, and Delete. |
| **Access Restricted Page** | `/unauthorized` | Public | `403`/`404` guard screen preventing cross-role URL access and providing safe navigation back to the user's dashboard. |

---

## 6. Phased Implementation Roadmap

**Build Order Principle:** Backend infrastructure and core domain APIs are constructed and verified first so the React frontend integrates against live PostgreSQL endpoints from day one.

| Phase | Deliverable | Key Technical Tasks |
| :--- | :--- | :--- |
| **Phase 1** | PostgreSQL & Discovery Infrastructure | Create `auth_db`, `student_db`, and `teacher_db`; initialize `discovery-server` (`:8761`) and `api-gateway` (`:8080`). |
| **Phase 2** | Auth Service & Gateway JWT Security | Build `auth-service` (`:8081`) with BCrypt + JWT issuing; add Gateway JWT validation filter and CORS policy. |
| **Phase 3** | Teacher Service & Announcements | Build `teacher-service` (`:8083`) with `T_XXXXXXXX` ID generator, mentor list endpoint, and announcement CRUD. |
| **Phase 4** | Student Service & Mentor Control APIs | Build `student-service` (`:8082`) with `S_XXXXXXXX` ID generator, mentor binding, and teacher CRUD + search queries. |
| **Phase 5** | React Frontend Live Integration | Scaffold the 8-page React (Vite) frontend wired directly to `http://localhost:8080/api` via Axios and test end-to-end flows. |

---

## 7. Getting Started (Local Development)

### Prerequisites
* **Java 17+** & **Maven**
* **Node.js 18+** & **npm**
* **PostgreSQL 14+**

### Startup Sequence
1. **Database Setup:** Ensure PostgreSQL is running locally and create the three isolated databases:
   ```sql
   CREATE DATABASE auth_db;
   CREATE DATABASE student_db;
   CREATE DATABASE teacher_db;
   ```
2. **Infrastructure Services:** Start `discovery-server` (`:8761`) first, followed by `api-gateway` (`:8080`).
3. **Domain Microservices:** Start `auth-service` (`:8081`), `student-service` (`:8082`), and `teacher-service` (`:8083`). Verify all instances appear as `UP` in the Eureka dashboard (`http://localhost:8761`).
4. **Frontend Client:** Navigate to the frontend directory, install dependencies, and start the Vite dev server:
   ```bash
   npm install
   npm run dev
   ```
   Access the application at `http://localhost:5173`.