# FG-01 Accounts — runnable source (PA3 Part E)
*Performed: Nguyễn Bảo Minh Triết (24125047), Nguyễn Hồng Tấn Tài (24125078); Review: Nguyễn Hồng Tấn Tài (24125078), 2026-11-14; Edited: Nguyễn Bảo Minh Triết (24125047), 2026-11-14*

This folder holds everything needed to run functional group FG-01 (accounts and
profiles, UC-01-01 to UC-01-08) end to end: the React frontend, the Spring Boot
API and a PostgreSQL database. It is a copy of `web/` and `api/authify/` from the
repository on 2026-11-14. The earlier clickable UI prototype for every use case
(Part D) is shown as screenshots in [`../screenshots/`](../screenshots/).

Demo video: <https://youtu.be/6K9P5xVkhNo>

## Contents
*Performed: Nguyễn Bảo Minh Triết (24125047); Review: Nguyễn Hồng Tấn Tài (24125078), 2026-11-14; Edited: Nguyễn Bảo Minh Triết (24125047), 2026-11-14*

| Path | What it is |
|---|---|
| `web/` | Vite + React + TypeScript frontend, with Playwright tests |
| `api/authify/` | Java Spring Boot API (Maven wrapper included) |
| `docker-compose.yml` | PostgreSQL 16 only |
| `.env.example` | Every setting the three parts need |

## Requirements
*Performed: Nguyễn Bảo Minh Triết (24125047); Review: Nguyễn Hồng Tấn Tài (24125078), 2026-11-14; Edited: Nguyễn Bảo Minh Triết (24125047), 2026-11-14*

Docker, JDK 17 or newer, Node.js 20 or newer. Run every command from this folder
unless a step says otherwise.

## Run
*Performed: Nguyễn Bảo Minh Triết (24125047); Review: Nguyễn Hồng Tấn Tài (24125078), 2026-11-14; Edited: Nguyễn Bảo Minh Triết (24125047), 2026-11-14*

1. Settings: copy `.env.example` to `.env`. Vite reads `VITE_API_BASE_URL` from it.
2. Database:
   ```powershell
   docker compose up -d db
   ```
3. API, in a second terminal (PowerShell):
   ```powershell
   cd api/authify
   $env:DATABASE_URL="jdbc:postgresql://localhost:5432/debatespeak"
   $env:DATABASE_USERNAME="debatespeak"
   $env:DATABASE_PASSWORD="debatespeak_dev_password"
   $env:APP_JWT_SECRET="<any random string of 32 or more characters>"
   .\mvnw spring-boot:run
   ```
   On macOS or Linux use `export NAME=value` and `./mvnw spring-boot:run`.
   If `java -version` is below 17, point `JAVA_HOME` at a JDK 17+ first. The API
   listens on port 8000; `http://localhost:8000/api/v1/health` returns `{"status":"ok"}`.
4. Frontend, in a third terminal:
   ```powershell
   cd web
   npm ci
   npm run dev
   ```
   Open `http://localhost:5173`. Use `localhost`, which the API allows. If Vite
   picks another port, restart the API with `FRONTEND_URL` set to that origin.

The API creates its tables on first start and seeds two accounts: a learner,
`learner@example.com`, and an admin, `admin@debatespeak.org`. Their passwords are
in `api/authify/src/main/java/org/debatespeak/authify/service/AuthService.java`.

## What to try
*Performed: Nguyễn Bảo Minh Triết (24125047); Review: Nguyễn Hồng Tấn Tài (24125078), 2026-11-14; Edited: Nguyễn Bảo Minh Triết (24125047), 2026-11-14*

| Use case | Steps |
|---|---|
| UC-01-01, 02 | Create account, then sign in |
| UC-01-02 | Reload the page: you stay signed in |
| UC-01-03 | Account → edit profile → Save; reload to see it kept |
| UC-01-06 | Account → Active sessions; sign in from a second browser and sign it out |
| UC-01-04 | Sign out |
| UC-01-07 | Account → Delete account (password and confirmation) |
| UC-01-08 | Sign in as the admin → Account → Manage accounts → suspend, then reactivate |

UC-01-05 (password recovery and email verification) is implemented in the API but
switched off in the UI until real email delivery is set up with
`SPRING_MAIL_USERNAME` and `SPRING_MAIL_PASSWORD`.

## Checks
*Performed: Nguyễn Bảo Minh Triết (24125047); Review: Nguyễn Hồng Tấn Tài (24125078), 2026-11-14; Edited: Nguyễn Bảo Minh Triết (24125047), 2026-11-14*

From `web/`: `npm run build`, `npm run lint`, `npx playwright install chromium`,
`npm run test:e2e` (96 tests; they mock the API). The end-to-end run against the
real API on 2026-11-14 is recorded in the repository's
`specs/002-fg01-accounts/tasks.md`.
