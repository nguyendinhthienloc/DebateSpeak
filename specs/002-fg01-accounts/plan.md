# Implementation Plan: FG-01 accounts end to end

Date: 2026-11-14. [Specification](spec.md). Backend owner: Tài. Frontend owner: Triết.

## Summary

Spring Boot service `api/authify` implements the 16 FG-01 endpoints the
frontend already calls (001 US1, US4), with PostgreSQL persistence. The
frontend is unchanged: point `VITE_API_BASE_URL` at the service.

## Technical Context

| Layer | Choice |
|---|---|
| Frontend | Vite + React 18 + TypeScript SPA (`web/`), see 001 |
| API | Java 17 (21 also works), Spring Boot 4.1 (Web, Security, Data JPA, Validation, Mail), Maven wrapper |
| Database | PostgreSQL 16 (`docker-compose.yml` service `db`) |
| Schema | Created by Hibernate (`ddl-auto=update`); versioned migrations are PA4 work |
| Passwords and codes | BCrypt (`BCryptPasswordEncoder`). The architecture spec names Argon2id; this deviation is recorded and open |
| Tokens | HMAC-signed access JWT; rotating refresh token in an HttpOnly cookie |
| Email | SMTP through Spring Mail; credentials from environment variables |
| Tests | Playwright in `web/tests/` (HTTP boundary mocked); manual end-to-end run in [quickstart](quickstart.md) |

## Structure

```text
api/authify/
├── pom.xml, mvnw, mvnw.cmd, .mvn/
└── src/main/java/org/debatespeak/authify/
    ├── controller/AuthController.java     # all /api/v1 routes
    ├── service/AuthService, JwtService, EmailService
    ├── entity/  UserEntity, AuthSessionEntity, VerificationCodeEntity, AccountSuspensionEntity
    ├── repository/  one Spring Data repository per entity
    ├── dto/  request/response records matching the contract
    ├── exception/  ApiException, ValidationException, GlobalExceptionHandler
    └── config/SecurityConfig.java         # CORS, client header, BCrypt
```

## Data model

| Table | Columns |
|---|---|
| `users` | id, email, password_hash, display_name, cefr_level, role, email_verified, is_suspended, native_language, goals, created_at, deleted_at |
| `auth_sessions` | family_id, user_id, current_token, previous_token, rotated_at, device, created_at, last_used_at, expires_at, revoked |
| `auth_codes` | id, email, purpose, code_hash, expires_at, consumed_at |
| `account_suspensions` | id, user_id, admin_id, reason, created_at, lifted_at |

## Endpoints

All under `/api/v1`; full shapes in [web/API_INTEGRATION.md](../../web/API_INTEGRATION.md).
`GET /health`; `POST /auth/{register,login,refresh,logout,forgot-password,resend-verification,verify-email,reset-password}`;
`GET|PATCH|DELETE /users/me`; `GET /auth/sessions`; `DELETE /auth/sessions/{id}`;
`GET /admin/users?email=`; `POST /admin/users/{id}/{suspend,reactivate}`.

## Configuration

| Variable | Purpose |
|---|---|
| `DATABASE_URL`, `DATABASE_USERNAME`, `DATABASE_PASSWORD` | JDBC connection |
| `APP_JWT_SECRET`, `APP_JWT_EXPIRATION_SECONDS` | Access-token signing and lifetime |
| `SPRING_MAIL_USERNAME`, `SPRING_MAIL_PASSWORD` | SMTP sender |
| `FRONTEND_URL` | Exact web origin for CORS and the Origin check (default `http://localhost:5173`) |
| `VITE_API_BASE_URL` (frontend) | `http://localhost:8000/api/v1` |

## Known gaps

BCrypt instead of Argon2id; no migrations; no rate limiting; no scheduled
hard-delete job; no automated backend tests; the old Gmail app password and
JWT key remain in `backend-tai` history until revoked (task T003a).
