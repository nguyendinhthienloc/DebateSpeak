# Quickstart: run FG-01 end to end

Requires Docker, JDK 21 and Node.js 20+.

1. Database, from the repository root:
   ```powershell
   docker compose up -d db
   ```
2. API, from `api/authify` (values match `docker-compose.yml`; use your own secrets):
   ```powershell
   $env:DATABASE_URL="jdbc:postgresql://localhost:5432/debatespeak"
   $env:DATABASE_USERNAME="debatespeak"
   $env:DATABASE_PASSWORD="debatespeak_dev_password"
   .\mvnw spring-boot:run
   ```
   The API listens on port 8000. Check `http://localhost:8000/api/v1/health`.
3. Frontend: set `VITE_API_BASE_URL=http://localhost:8000/api/v1` in the root
   `.env`, then from `web/` run `npm run dev` and open `http://localhost:5173`
   (use `localhost`, which the API allows for CORS).
4. Walk the checks in [spec.md](spec.md) US1–US6 and tick [tasks.md](tasks.md).
