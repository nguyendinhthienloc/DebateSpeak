# Quickstart & Verification Guide: FG-03 Room Management
*Performed: Nguyễn Anh Khoa (24125058) | Reviewed: Trần Lê Anh Tuấn (24125107) | Edited: Nguyễn Anh Khoa (24125058)*

Target Feature: `006-fg03-rooms`

---

## 1. Prerequisites & Environment Setup

Start local dependencies (PostgreSQL 16 & Redis 7):

```powershell
docker compose up -d db redis
```

Ensure environment variables in `.env` match:
```env
DATABASE_URL=postgresql://debatespeak:debatespeak_dev_password@localhost:5432/debatespeak
VITE_API_BASE_URL=http://localhost:8080
```

---

## 2. Running Backend & Frontend

### Terminal 1: Backend API (Spring Boot)
```powershell
cd api/authify
./mvnw spring-boot:run
```
*Backend runs at `http://localhost:8080`.*

### Terminal 2: Frontend Web App (React)
```powershell
cd web
npm run dev
```
*Frontend runs at `http://localhost:5173`.*

---

## 3. Verification Walkthrough (Two Browsers)

1. **Host Setup (Browser 1 - Chrome)**:
   - Sign in as `user1@example.com`.
   - Click "Create Debate Room" $\rightarrow$ select motion "Should universities offer a 4-day week?" $\rightarrow$ select Affirmative.
   - Note the 8-character invite code displayed (e.g., `DEB-8A3F`).
2. **Guest Join (Browser 2 - Firefox / Incognito)**:
   - Sign in as `user2@example.com`.
   - Click "Join Room" $\rightarrow$ enter `DEB-8A3F`.
   - Confirm Guest is assigned Negative stance and both users appear in the Lobby.
3. **Mutual Ready Test**:
   - In Browser 1: Click "I'm Ready". Notice room shows "1 of 2 debaters ready".
   - In Browser 2: Click "I'm Ready".
   - Confirm both browsers show room state transition to `READY` and countdown timer triggers.
4. **Third-Party Intruder Test (Browser 3)**:
   - Attempt to join `DEB-8A3F` as a 3rd user.
   - Confirm application shows "Room is full (HTTP 409 Conflict)".
