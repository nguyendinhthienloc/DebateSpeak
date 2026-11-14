# Quickstart: run FG-01 end to end

Requires Docker, JDK 17 or newer and Node.js 20+.

1. Database, from the repository root:
   ```powershell
   docker compose up -d db
   ```
2. API, from `api/authify` (values match `docker-compose.yml`; use your own secrets):
   ```powershell
   $env:DATABASE_URL="jdbc:postgresql://localhost:5432/debatespeak"
   $env:DATABASE_USERNAME="debatespeak"
   $env:DATABASE_PASSWORD="debatespeak_dev_password"
   $env:APP_JWT_SECRET="<any random string of 32+ characters>"
   # Only for recovery emails: $env:SPRING_MAIL_USERNAME and $env:SPRING_MAIL_PASSWORD
   .\mvnw spring-boot:run
   ```
   The API listens on port 8000. Check `http://localhost:8000/api/v1/health`.
   If `java -version` is not 17+, set `$env:JAVA_HOME` to a JDK 17+ folder first.
   Seeded accounts: `learner@example.com` (learner) and `admin@debatespeak.org` (admin);
   their passwords are in `AuthService.java`.
3. Frontend: set `VITE_API_BASE_URL=http://localhost:8000/api/v1` in the root
   `.env`, then from `web/` run `npm run dev` and open `http://localhost:5173`
   (use `localhost`, which the API allows for CORS). If Vite runs on another port, start the
   API with `$env:FRONTEND_URL` set to that exact origin, or every account call returns 403.
4. Walk the checks in [spec.md](spec.md) US1–US6 and tick [tasks.md](tasks.md).
