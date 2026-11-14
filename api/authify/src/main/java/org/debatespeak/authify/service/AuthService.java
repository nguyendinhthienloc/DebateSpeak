package org.debatespeak.authify.service;

import jakarta.annotation.PostConstruct;
import org.debatespeak.authify.dto.*;
import org.debatespeak.authify.entity.*;
import org.debatespeak.authify.exception.ApiException;
import org.debatespeak.authify.exception.ValidationException;
import org.debatespeak.authify.repository.*;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.security.SecureRandom;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.*;
import java.util.regex.Pattern;

@Service
public class AuthService {

    private static final Pattern EMAIL_PATTERN = Pattern.compile("^[^@\\s]+@[^@\\s]+\\.[^@\\s]+$");
    private static final Set<String> VALID_CEFR = Set.of("A2", "B1", "B2", "C1");
    private static final SecureRandom RANDOM = new SecureRandom();
    private static final long REFRESH_DAYS = 7;
    private static final long CODE_EXPIRE_MINUTES = 15;

    private final UserRepository userRepository;
    private final AuthSessionRepository sessionRepository;
    private final VerificationCodeRepository codeRepository;
    private final AccountSuspensionRepository suspensionRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final EmailService emailService;

    public AuthService(
            UserRepository userRepository,
            AuthSessionRepository sessionRepository,
            VerificationCodeRepository codeRepository,
            AccountSuspensionRepository suspensionRepository,
            PasswordEncoder passwordEncoder,
            JwtService jwtService,
            EmailService emailService
    ) {
        this.userRepository = userRepository;
        this.sessionRepository = sessionRepository;
        this.codeRepository = codeRepository;
        this.suspensionRepository = suspensionRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
        this.emailService = emailService;
    }

    @PostConstruct
    public void initMockData() {
        if (!userRepository.existsByEmail("learner@example.com")) {
            UserEntity learner = new UserEntity();
            learner.setId(UUID.fromString("d817b684-08e9-49c0-806a-a045fb7f060c"));
            learner.setEmail("learner@example.com");
            learner.setPasswordHash(passwordEncoder.encode("Password123456"));
            learner.setDisplayName("Linh");
            learner.setCefrLevel("B1");
            learner.setRole("LEARNER");
            learner.setEmailVerified(true);
            learner.setSuspended(false);
            learner.setNativeLanguage("Vietnamese");
            learner.setGoals(new ArrayList<>(List.of("Reduce filler words", "Improve rebuttal structure")));
            learner.setCreatedAt(Instant.now());
            userRepository.save(learner);
        }

        if (!userRepository.existsByEmail("admin@debatespeak.org")) {
            UserEntity admin = new UserEntity();
            admin.setId(UUID.fromString("11111111-1111-1111-1111-111111111111"));
            admin.setEmail("admin@debatespeak.org");
            admin.setPasswordHash(passwordEncoder.encode("AdminPassword123"));
            admin.setDisplayName("System Admin");
            admin.setCefrLevel("C1");
            admin.setRole("ADMIN");
            admin.setEmailVerified(true);
            admin.setSuspended(false);
            admin.setNativeLanguage("Vietnamese");
            admin.setGoals(new ArrayList<>());
            admin.setCreatedAt(Instant.now());
            userRepository.save(admin);
        }
    }

    // --- 1. REGISTER ---
    @Transactional
    public UserResponse register(RegisterRequest req) {
        if (req == null) throw new ValidationException("email", "Request body is required");
        String email = validateAndNormalizeEmail(req.email());
        validatePassword(req.password());

        String displayName = "Learner";
        if (req.displayName() != null) {
            if (req.displayName().isBlank()) throw new ValidationException("display_name", "Display name cannot be blank");
            String trimmed = req.displayName().trim();
            if (trimmed.codePointCount(0, trimmed.length()) > 80) {
                throw new ValidationException("display_name", "Display name must be at most 80 characters");
            }
            displayName = trimmed;
        }

        if (req.cefrLevel() == null || req.cefrLevel().isBlank()) {
            throw new ValidationException("cefr_level", "CEFR level is required");
        }
        String cefr = req.cefrLevel().trim().toUpperCase();
        if (!VALID_CEFR.contains(cefr)) {
            throw new ValidationException("cefr_level", "CEFR level must be A2, B1, B2, or C1");
        }

        if (userRepository.existsByEmail(email)) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Email already registered");
        }

        UserEntity newUser = new UserEntity();
        newUser.setId(UUID.randomUUID());
        newUser.setEmail(email);
        newUser.setPasswordHash(passwordEncoder.encode(req.password()));
        newUser.setDisplayName(displayName);
        newUser.setCefrLevel(cefr);
        newUser.setRole("LEARNER");
        newUser.setEmailVerified(false);
        newUser.setSuspended(false);
        newUser.setGoals(new ArrayList<>());
        newUser.setCreatedAt(Instant.now());

        userRepository.save(newUser);
        issueCode(email, "VERIFY");
        return toUserResponse(newUser);
    }

    // --- 2. LOGIN ---
    public record LoginResult(TokenResponse body, String refreshCookieValue) {}

    @Transactional
    public LoginResult login(LoginRequest req, String userAgent) {
        if (req == null) throw new ValidationException("email", "Request body is required");
        String email = validateAndNormalizeEmail(req.email());
        if (req.password() == null || req.password().isEmpty()) {
            throw new ValidationException("password", "Password is required");
        }

        UserEntity user = userRepository.findByEmailAndDeletedAtIsNull(email).orElse(null);
        if (user == null || !passwordEncoder.matches(req.password(), user.getPasswordHash())) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Wrong sign-in details");
        }
        if (user.isSuspended()) {
            throw new ApiException(HttpStatus.FORBIDDEN, "account_suspended", "Account is suspended");
        }

        UUID familyId = UUID.randomUUID();
        String secret = generateTokenSecret();
        Instant now = Instant.now();

        AuthSessionEntity session = new AuthSessionEntity();
        session.setFamilyId(familyId);
        session.setUserId(user.getId());
        session.setCurrentToken(secret);
        session.setDevice(parseDevice(userAgent));
        session.setCreatedAt(now);
        session.setLastUsedAt(now);
        session.setExpiresAt(now.plus(REFRESH_DAYS, ChronoUnit.DAYS));
        session.setRevoked(false);
        sessionRepository.save(session);

        String accessToken = jwtService.generateToken(user);
        TokenResponse tokenResponse = new TokenResponse(accessToken, "bearer", jwtService.getExpirationSeconds(), toUserResponse(user));
        return new LoginResult(tokenResponse, familyId + "." + secret);
    }

    // --- 3 & 4. FORGOT PASSWORD & RESEND VERIFICATION ---
    @Transactional
    public StatusResponse forgotPassword(EmailRequest req) {
        String email = validateAndNormalizeEmail(req != null ? req.email() : null);
        if (userRepository.findByEmailAndDeletedAtIsNull(email).isPresent()) {
            issueCode(email, "RESET");
        }
        return new StatusResponse("accepted");
    }

    @Transactional
    public StatusResponse resendVerification(EmailRequest req) {
        String email = validateAndNormalizeEmail(req != null ? req.email() : null);
        userRepository.findByEmailAndDeletedAtIsNull(email).ifPresent(user -> {
            if (!user.isEmailVerified()) {
                issueCode(email, "VERIFY");
            }
        });
        return new StatusResponse("accepted");
    }

    // --- 5. VERIFY EMAIL ---
    @Transactional
    public StatusResponse verifyEmail(VerifyEmailRequest req) {
        if (req == null) throw new ValidationException("email", "Request body is required");
        String email = validateAndNormalizeEmail(req.email());
        String code = validateCodeFormat(req.code());

        UserEntity user = userRepository.findByEmailAndDeletedAtIsNull(email)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.BAD_REQUEST, "Invalid or expired verification code"));

        VerificationCodeEntity codeEntity = consumeValidCode(email, "VERIFY", code);
        codeRepository.save(codeEntity);

        user.setEmailVerified(true);
        userRepository.save(user);
        return new StatusResponse("verified");
    }

    // --- 6. RESET PASSWORD ---
    @Transactional
    public StatusResponse resetPassword(ResetPasswordRequest req) {
        if (req == null) throw new ValidationException("email", "Request body is required");
        String email = validateAndNormalizeEmail(req.email());
        String code = validateCodeFormat(req.code());
        validatePassword(req.password());

        UserEntity user = userRepository.findByEmailAndDeletedAtIsNull(email)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.BAD_REQUEST, "Invalid or expired reset code"));

        VerificationCodeEntity codeEntity = consumeValidCode(email, "RESET", code);
        codeRepository.save(codeEntity);

        user.setPasswordHash(passwordEncoder.encode(req.password()));
        userRepository.save(user);

        revokeAllSessionsForUser(user.getId());
        return new StatusResponse("reset");
    }

    // --- 7. REFRESH ---
    @Transactional
    public LoginResult refresh(String cookieValue) {
        ParsedCookie parsed = parseRefreshCookie(cookieValue);
        if (parsed == null) throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Missing refresh cookie");

        AuthSessionEntity session = sessionRepository.findById(parsed.familyId()).orElse(null);
        Instant now = Instant.now();
        if (session == null || session.isRevoked() || session.getExpiresAt().isBefore(now)) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Invalid refresh session");
        }

        UserEntity user = userRepository.findById(session.getUserId()).orElse(null);
        if (user == null || user.getDeletedAt() != null || user.isSuspended()) {
            revokeAllSessionsForUser(session.getUserId());
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Account unavailable");
        }

        // Reuse grace window (10s)
        if (session.getPreviousToken() != null && session.getPreviousToken().equals(parsed.secret())
                && session.getRotatedAt() != null && session.getRotatedAt().plusSeconds(10).isAfter(now)) {
            String accessToken = jwtService.generateToken(user);
            TokenResponse body = new TokenResponse(accessToken, "bearer", jwtService.getExpirationSeconds(), toUserResponse(user));
            return new LoginResult(body, session.getFamilyId() + "." + session.getCurrentToken());
        }

        if (!session.getCurrentToken().equals(parsed.secret())) {
            session.setRevoked(true);
            sessionRepository.save(session);
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Refresh token reuse detected");
        }

        String nextSecret = generateTokenSecret();
        session.setPreviousToken(session.getCurrentToken());
        session.setCurrentToken(nextSecret);
        session.setRotatedAt(now);
        session.setLastUsedAt(now);
        sessionRepository.save(session);

        String accessToken = jwtService.generateToken(user);
        TokenResponse body = new TokenResponse(accessToken, "bearer", jwtService.getExpirationSeconds(), toUserResponse(user));
        return new LoginResult(body, session.getFamilyId() + "." + nextSecret);
    }

    // --- 8. LOGOUT ---
    @Transactional
    public void logout(String cookieValue) {
        ParsedCookie parsed = parseRefreshCookie(cookieValue);
        if (parsed != null) {
            sessionRepository.findById(parsed.familyId()).ifPresent(session -> {
                if (!session.isRevoked()) {
                    session.setRevoked(true);
                    sessionRepository.save(session);
                }
            });
        }
    }

    // --- 9, 10, 11. USERS / ME ---
    public ProfileResponse getProfile(UserEntity user) {
        return toProfileResponse(user);
    }

    @Transactional
    public ProfileResponse updateProfile(UserEntity user, UpdateProfileRequest req) {
        if (req == null) throw new ValidationException("display_name", "Request body is required");
        if (req.email() != null || req.role() != null) {
            throw new ValidationException("email", "Email and role cannot be updated here");
        }

        if (req.displayName() != null) {
            if (req.displayName().isBlank()) throw new ValidationException("display_name", "Display name cannot be blank");
            String trimmed = req.displayName().trim();
            if (trimmed.codePointCount(0, trimmed.length()) > 80) {
                throw new ValidationException("display_name", "Display name must be at most 80 characters");
            }
            user.setDisplayName(trimmed);
        }

        if (req.cefrLevel() != null) {
            String normalized = req.cefrLevel().trim().toUpperCase();
            if (!VALID_CEFR.contains(normalized)) {
                throw new ValidationException("cefr_level", "CEFR level must be A2, B1, B2, or C1");
            }
            user.setCefrLevel(normalized);
        }

        if (req.nativeLanguage() != null) {
            String nativeLang = req.nativeLanguage().trim();
            if (nativeLang.isEmpty()) {
                user.setNativeLanguage(null);
            } else if (nativeLang.codePointCount(0, nativeLang.length()) > 64) {
                throw new ValidationException("native_language", "Native language must be 1-64 characters");
            } else {
                user.setNativeLanguage(nativeLang);
            }
        } else {
            user.setNativeLanguage(null);
        }

        if (req.goals() != null) {
            if (req.goals().size() > 5) {
                throw new ValidationException("goals", "Maximum 5 goals allowed");
            }
            List<String> cleaned = new ArrayList<>();
            for (String g : req.goals()) {
                if (g == null || g.isBlank()) continue;
                String trimmedG = g.trim();
                if (trimmedG.codePointCount(0, trimmedG.length()) > 120) {
                    throw new ValidationException("goals", "Each goal must be 1-120 characters");
                }
                cleaned.add(trimmedG);
            }
            user.setGoals(cleaned);
        }

        userRepository.save(user);
        return toProfileResponse(user);
    }

    @Transactional
    public StatusResponse deleteAccount(UserEntity user, DeleteAccountRequest req) {
        if (req == null || req.password() == null || !passwordEncoder.matches(req.password(), user.getPasswordHash())) {
            throw new ApiException(HttpStatus.FORBIDDEN, "invalid_password", "Wrong password");
        }
        user.setDeletedAt(Instant.now());
        userRepository.save(user);
        revokeAllSessionsForUser(user.getId());
        return new StatusResponse("scheduled");
    }

    // --- 12 & 13. SESSIONS ---
    public SessionListResponse listSessions(UserEntity user, String cookieValue) {
        ParsedCookie parsed = parseRefreshCookie(cookieValue);
        UUID currentFamilyId = parsed != null ? parsed.familyId() : null;

        List<SessionItemResponse> items = sessionRepository
                .findByUserIdAndRevokedFalseAndExpiresAtAfterOrderByCreatedAtDesc(user.getId(), Instant.now())
                .stream()
                .map(s -> new SessionItemResponse(
                        s.getFamilyId(), s.getCreatedAt(), s.getLastUsedAt(), s.getDevice(), s.getFamilyId().equals(currentFamilyId)
                ))
                .toList();
        return new SessionListResponse(items);
    }

    @Transactional
    public void revokeSession(UserEntity user, UUID familyId) {
        AuthSessionEntity session = sessionRepository.findById(familyId).orElse(null);
        if (session == null || !session.getUserId().equals(user.getId()) || session.isRevoked()) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Session not found");
        }
        session.setRevoked(true);
        sessionRepository.save(session);
    }

    // --- 14, 15, 16. ADMIN ---
    public AdminUserResponse findUserByEmail(String rawEmail) {
        String email = validateAndNormalizeEmail(rawEmail);
        UserEntity user = userRepository.findByEmailAndDeletedAtIsNull(email)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found"));
        return toAdminUserResponse(user);
    }

    @Transactional
    public AdminUserResponse suspendUser(UserEntity admin, UUID targetId, SuspendRequest req) {
        if (admin.getId().equals(targetId)) {
            throw new ValidationException("reason", "Admins cannot suspend themselves");
        }
        if (req == null || req.reason() == null || req.reason().isBlank()) {
            throw new ValidationException("reason", "Suspension reason is required");
        }
        UserEntity target = userRepository.findById(targetId)
                .filter(u -> u.getDeletedAt() == null)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found"));

        target.setSuspended(true);
        userRepository.save(target);

        AccountSuspensionEntity audit = new AccountSuspensionEntity();
        audit.setId(UUID.randomUUID());
        audit.setUserId(target.getId());
        audit.setAdminId(admin.getId());
        audit.setReason(req.reason().trim());
        audit.setCreatedAt(Instant.now());
        suspensionRepository.save(audit);

        revokeAllSessionsForUser(target.getId());
        return toAdminUserResponse(target);
    }

    @Transactional
    public AdminUserResponse reactivateUser(UUID targetId) {
        UserEntity target = userRepository.findById(targetId)
                .filter(u -> u.getDeletedAt() == null)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found"));

        target.setSuspended(false);
        userRepository.save(target);

        suspensionRepository.findFirstByUserIdAndLiftedAtIsNullOrderByCreatedAtDesc(targetId)
                .ifPresent(audit -> {
                    audit.setLiftedAt(Instant.now());
                    suspensionRepository.save(audit);
                });

        return toAdminUserResponse(target);
    }

    // --- AUTH & CODE HELPERS ---
    public UserEntity requireCurrentUser(String authHeader) {
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Missing Bearer token");
        }
        String token = authHeader.substring(7).trim();
        UUID userId = jwtService.extractUserId(token);
        if (userId == null) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Invalid or expired token");
        }
        UserEntity user = userRepository.findById(userId).orElse(null);
        if (user == null || user.getDeletedAt() != null || user.isSuspended()) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "User unavailable");
        }
        return user;
    }

    public UserEntity requireAdmin(String authHeader) {
        UserEntity user = requireCurrentUser(authHeader);
        if (!"ADMIN".equals(user.getRole())) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Admin role required");
        }
        return user;
    }

    private void revokeAllSessionsForUser(UUID userId) {
        List<AuthSessionEntity> activeSessions = sessionRepository.findByUserIdAndRevokedFalse(userId);
        for (AuthSessionEntity s : activeSessions) {
            s.setRevoked(true);
        }
        sessionRepository.saveAll(activeSessions);
    }

    private void issueCode(String email, String purpose) {
        String code = generate6DigitCode();
        VerificationCodeEntity entity = new VerificationCodeEntity();
        entity.setId(UUID.randomUUID());
        entity.setEmail(email);
        entity.setPurpose(purpose);
        entity.setCodeHash(passwordEncoder.encode(code));
        entity.setExpiresAt(Instant.now().plus(CODE_EXPIRE_MINUTES, ChronoUnit.MINUTES));
        codeRepository.save(entity);

        if ("VERIFY".equals(purpose)) {
            emailService.sendVerificationCode(email, code);
        } else {
            emailService.sendPasswordResetCode(email, code);
        }
    }

    private VerificationCodeEntity consumeValidCode(String email, String purpose, String rawCode) {
        VerificationCodeEntity codeEntity = codeRepository
                .findFirstByEmailAndPurposeAndConsumedAtIsNullAndExpiresAtAfterOrderByExpiresAtDesc(email, purpose, Instant.now())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.BAD_REQUEST, "Invalid or expired code"));

        if (!passwordEncoder.matches(rawCode, codeEntity.getCodeHash())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Invalid or expired code");
        }
        codeEntity.setConsumedAt(Instant.now());
        return codeEntity;
    }

    private String validateAndNormalizeEmail(String rawEmail) {
        if (rawEmail == null || rawEmail.isBlank()) throw new ValidationException("email", "Email is required");
        String trimmed = rawEmail.trim().toLowerCase();
        if (trimmed.length() > 254 || !EMAIL_PATTERN.matcher(trimmed).matches()) {
            throw new ValidationException("email", "Invalid email");
        }
        return trimmed;
    }

    private void validatePassword(String password) {
        if (password == null) throw new ValidationException("password", "Password is required");
        int codePoints = password.codePointCount(0, password.length());
        if (codePoints < 12 || codePoints > 128) {
            throw new ValidationException("password", "Password must be 12-128 characters");
        }
    }

    private String validateCodeFormat(String rawCode) {
        if (rawCode == null || rawCode.isBlank()) throw new ValidationException("code", "Code is required");
        String trimmed = rawCode.trim();
        int codePoints = trimmed.codePointCount(0, trimmed.length());
        if (codePoints < 6 || codePoints > 128) {
            throw new ValidationException("code", "Code must be 6-128 characters");
        }
        return trimmed;
    }

    private String generate6DigitCode() {
        return String.format("%06d", RANDOM.nextInt(1_000_000));
    }

    private String generateTokenSecret() {
        byte[] bytes = new byte[24];
        RANDOM.nextBytes(bytes);
        return Base64.getUrlEncoder().withoutPadding().encodeToString(bytes);
    }

    private record ParsedCookie(UUID familyId, String secret) {}

    private ParsedCookie parseRefreshCookie(String cookieValue) {
        if (cookieValue == null || !cookieValue.contains(".")) return null;
        String[] parts = cookieValue.split("\\.", 2);
        try {
            return new ParsedCookie(UUID.fromString(parts[0]), parts[1]);
        } catch (IllegalArgumentException e) {
            return null;
        }
    }

    private String parseDevice(String ua) {
        if (ua == null || ua.isBlank()) return "Web browser";
        String browser = ua.contains("Firefox") ? "Firefox" : ua.contains("Edg") ? "Edge"
                : ua.contains("Chrome") ? "Chrome" : ua.contains("Safari") ? "Safari" : "Browser";
        String os = ua.contains("Linux") ? "Linux" : ua.contains("Windows") ? "Windows"
                : ua.contains("Mac OS") ? "macOS" : ua.contains("Android") ? "Android"
                : ua.contains("iPhone") ? "iOS" : "Unknown OS";
        return browser + " on " + os;
    }

    private UserResponse toUserResponse(UserEntity u) {
        return new UserResponse(u.getId(), u.getEmail(), u.getDisplayName(), u.getCefrLevel(), u.getCreatedAt(), u.getRole());
    }

    private ProfileResponse toProfileResponse(UserEntity u) {
        return new ProfileResponse(u.getId(), u.getEmail(), u.getDisplayName(), u.getCefrLevel(), u.getCreatedAt(), u.getRole(), u.getNativeLanguage(), u.getGoals());
    }

    private AdminUserResponse toAdminUserResponse(UserEntity u) {
        return new AdminUserResponse(u.getId(), u.getEmail(), u.getDisplayName(), u.getRole(), u.isSuspended(), u.getCreatedAt());
    }
}