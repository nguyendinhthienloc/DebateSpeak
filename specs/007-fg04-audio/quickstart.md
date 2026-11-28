# Quickstart & Verification Guide: FG-04 Real-Time Audio Communication
*Performed: Nguyễn Anh Khoa (24125058) | Reviewed: Trần Lê Anh Tuấn (24125107) | Edited: Nguyễn Anh Khoa (24125058)*

Target Feature: `007-fg04-audio`

---

## 1. Prerequisites & Environment Setup

### Local or Cloud LiveKit Configuration
Ensure your `.env` contains valid LiveKit credentials:

```env
# LiveKit Cloud or Local Docker container
LIVEKIT_URL=wss://your-project.livekit.cloud
LIVEKIT_API_KEY=devkey
LIVEKIT_API_SECRET=secret
```

If running LiveKit locally with Docker:
```powershell
docker run --rm -p 7880:7880 -p 7881:7881 -p 7882:7882/udp livekit/livekit-server --dev
```

---

## 2. Token Generation Check (CLI)

Verify backend token generation endpoint:

```powershell
# 1. Sign in to obtain Bearer token
$loginResp = Invoke-RestMethod -Uri "http://localhost:8080/api/v1/auth/login" -Method Post -ContentType "application/json" -Body '{"email":"user1@example.com","password":"Password123!"}'
$jwt = $loginResp.access_token

# 2. Request LiveKit room token
$headers = @{ "Authorization" = "Bearer $jwt" }
$tokenResp = Invoke-RestMethod -Uri "http://localhost:8080/api/v1/rooms/<room-id>/token" -Method Post -Headers $headers
Write-Host "LiveKit Token received: " $tokenResp.token
```

---

## 3. End-to-End Audio Walkthrough (Two Browsers)

1. Open two browser windows (Chrome and Firefox) logged in as Debater 1 and Debater 2 in the same room.
2. In both browsers, navigate to the active debate stage.
3. Observe that microphone access is **not** immediately requested.
4. Click "Enable Microphone & Join Audio" in Browser 1 $\rightarrow$ allow microphone.
5. Click "Enable Microphone & Join Audio" in Browser 2 $\rightarrow$ allow microphone.
6. Speak into microphone in Browser 1:
   - Confirm Debater 2 hears audio cleanly through speakers/headphones.
   - Confirm Debater 1's avatar displays the glowing "Active Speaker" indicator in both browsers.
7. Click "Mute" in Browser 1:
   - Confirm audio ceases in Browser 2 and UI updates to "Muted".
