package org.debatespeak.authify.controller;

import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.debatespeak.authify.dto.*;
import org.debatespeak.authify.entity.UserEntity;
import org.debatespeak.authify.service.AuthService;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseCookie;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.time.Duration;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1")
public class AuthController {

    private static final String REFRESH_COOKIE_NAME = "debatespeak_refresh";
    private final AuthService authService;

    @Value("${FRONTEND_URL:http://localhost:5173}")
    private String frontendUrl;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @GetMapping("/health")
    public Map<String, String> health() {
        return Map.of("status", "ok");
    }

    // --- AUTH (1–8) ---
    @PostMapping("/auth/register")
    @ResponseStatus(HttpStatus.CREATED)
    public UserResponse register(@RequestBody RegisterRequest request) {
        return authService.register(request);
    }

    @PostMapping("/auth/login")
    public TokenResponse login(@RequestBody LoginRequest request, HttpServletRequest httpReq, HttpServletResponse httpRes) {
        AuthService.LoginResult result = authService.login(request, httpReq.getHeader("User-Agent"));
        setRefreshCookie(httpRes, result.refreshCookieValue(), Duration.ofDays(7));
        return result.body();
    }

    @PostMapping("/auth/forgot-password")
    @ResponseStatus(HttpStatus.ACCEPTED)
    public StatusResponse forgotPassword(@RequestBody EmailRequest request) {
        return authService.forgotPassword(request);
    }

    @PostMapping("/auth/resend-verification")
    @ResponseStatus(HttpStatus.ACCEPTED)
    public StatusResponse resendVerification(@RequestBody EmailRequest request) {
        return authService.resendVerification(request);
    }

    @PostMapping("/auth/verify-email")
    public StatusResponse verifyEmail(@RequestBody VerifyEmailRequest request) {
        return authService.verifyEmail(request);
    }

    @PostMapping("/auth/reset-password")
    public StatusResponse resetPassword(@RequestBody ResetPasswordRequest request) {
        return authService.resetPassword(request);
    }

    @PostMapping("/auth/refresh")
    public TokenResponse refresh(HttpServletRequest httpReq, HttpServletResponse httpRes) {
        enforceCsrfProtection(httpReq);
        String cookieVal = extractRefreshCookie(httpReq);
        AuthService.LoginResult result = authService.refresh(cookieVal);
        setRefreshCookie(httpRes, result.refreshCookieValue(), Duration.ofDays(7));
        return result.body();
    }

    @PostMapping("/auth/logout")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void logout(HttpServletRequest httpReq, HttpServletResponse httpRes) {
        enforceCsrfProtection(httpReq);
        authService.logout(extractRefreshCookie(httpReq));
        setRefreshCookie(httpRes, "", Duration.ZERO);
    }

    // --- USERS (9–11) ---
    @GetMapping("/users/me")
    public ProfileResponse getProfile(@RequestHeader(value = "Authorization", required = false) String auth) {
        UserEntity user = authService.requireCurrentUser(auth);
        return authService.getProfile(user);
    }

    @PatchMapping("/users/me")
    public ProfileResponse updateProfile(
            @RequestHeader(value = "Authorization", required = false) String auth,
            @RequestBody UpdateProfileRequest request) {
        UserEntity user = authService.requireCurrentUser(auth);
        return authService.updateProfile(user, request);
    }

    @DeleteMapping("/users/me")
    @ResponseStatus(HttpStatus.ACCEPTED)
    public StatusResponse deleteAccount(
            @RequestHeader(value = "Authorization", required = false) String auth,
            @RequestBody DeleteAccountRequest request,
            HttpServletResponse httpRes) {
        UserEntity user = authService.requireCurrentUser(auth);
        StatusResponse res = authService.deleteAccount(user, request);
        setRefreshCookie(httpRes, "", Duration.ZERO);
        return res;
    }

    // --- SESSIONS (12–13) ---
    @GetMapping("/auth/sessions")
    public SessionListResponse listSessions(
            @RequestHeader(value = "Authorization", required = false) String auth,
            HttpServletRequest httpReq) {
        UserEntity user = authService.requireCurrentUser(auth);
        return authService.listSessions(user, extractRefreshCookie(httpReq));
    }

    @DeleteMapping("/auth/sessions/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void revokeSession(
            @RequestHeader(value = "Authorization", required = false) String auth,
            @PathVariable UUID id) {
        UserEntity user = authService.requireCurrentUser(auth);
        authService.revokeSession(user, id);
    }

    // --- ADMIN (14–16) ---
    @GetMapping("/admin/users")
    public AdminUserResponse findUser(
            @RequestHeader(value = "Authorization", required = false) String auth,
            @RequestParam String email) {
        authService.requireAdmin(auth);
        return authService.findUserByEmail(email);
    }

    @PostMapping("/admin/users/{id}/suspend")
    public AdminUserResponse suspendUser(
            @RequestHeader(value = "Authorization", required = false) String auth,
            @PathVariable UUID id,
            @RequestBody SuspendRequest request) {
        UserEntity admin = authService.requireAdmin(auth);
        return authService.suspendUser(admin, id, request);
    }

    @PostMapping("/admin/users/{id}/reactivate")
    public AdminUserResponse reactivateUser(
            @RequestHeader(value = "Authorization", required = false) String auth,
            @PathVariable UUID id) {
        authService.requireAdmin(auth);
        return authService.reactivateUser(id);
    }

    // --- COOKIE & CSRF HELPERS ---
    private void setRefreshCookie(HttpServletResponse response, String value, Duration maxAge) {
        ResponseCookie cookie = ResponseCookie.from(REFRESH_COOKIE_NAME, value)
                .httpOnly(true)
                .secure(false) // Bật true khi deploy HTTPS; trình duyệt cho phép HttpOnly cookie trên localhost HTTP
                .sameSite("Lax")
                .path("/api/v1/auth")
                .maxAge(maxAge)
                .build();
        response.addHeader(HttpHeaders.SET_COOKIE, cookie.toString());
    }

    private String extractRefreshCookie(HttpServletRequest request) {
        if (request.getCookies() == null) return null;
        for (Cookie c : request.getCookies()) {
            if (REFRESH_COOKIE_NAME.equals(c.getName())) {
                return c.getValue();
            }
        }
        return null;
    }

    private void enforceCsrfProtection(HttpServletRequest request) {
        String clientHeader = request.getHeader("X-DebateSpeak-Client");
        String origin = request.getHeader("Origin");
        if (!"web".equals(clientHeader)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Missing X-DebateSpeak-Client header");
        }
        if (origin != null && !origin.equals(frontendUrl)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Invalid Origin");
        }
    }
}