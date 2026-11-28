package org.debatespeak.authify.service;

import jakarta.annotation.PostConstruct;
import org.debatespeak.authify.dto.*;
import org.debatespeak.authify.models.User;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.time.Instant;
import java.util.Map;
import java.util.Set;
import java.util.UUID;
import java.util.concurrent.ConcurrentHashMap;
import java.util.regex.Pattern;

@Service
public class AuthService {

    private static final Pattern EMAIL_PATTERN = Pattern.compile("^[^@\\s]+@[^@\\s]+\\.[^@\\s]+$");
    private static final Set<String> VALID_CEFR = Set.of("A1", "A2", "B1", "B2", "C1", "C2");

    // Lưu trữ tạm thời trong RAM (key là email viết thường)
    private final Map<String, User> usersByEmail = new ConcurrentHashMap<>();

    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    public AuthService(PasswordEncoder passwordEncoder, JwtService jwtService) {
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
    }
    @PostConstruct
    public void initMockData() {
        User demoLearner = new User(
                UUID.fromString("d817b684-08e9-49c0-806a-a045fb7f060c"),
                "learner@example.com",
                passwordEncoder.encode("Password123456"),
                "Learner",
                "B1",
                Instant.now()
        );
        usersByEmail.put(demoLearner.email(), demoLearner);

        User testUser = new User(
                UUID.randomUUID(),
                "test@debatespeak.org",
                passwordEncoder.encode("DebateSpeak2026!"),
                "Minh Anh",
                "B2",
                Instant.now()
        );
        usersByEmail.put(testUser.email(), testUser);
    }

    public UserResponse register(RegisterRequest req) {
        if (req == null || req.email() == null || req.password() == null) {
            throw new ResponseStatusException(HttpStatus.UNPROCESSABLE_ENTITY, "Missing required fields");
        }

        String trimmedEmail = req.email().trim().toLowerCase();
        if (!EMAIL_PATTERN.matcher(trimmedEmail).matches()) {
            throw new ResponseStatusException(HttpStatus.UNPROCESSABLE_ENTITY, "Invalid email format");
        }

        int passwordCodePoints = req.password().codePointCount(0, req.password().length());
        if (passwordCodePoints < 12 || passwordCodePoints > 128) {
            throw new ResponseStatusException(HttpStatus.UNPROCESSABLE_ENTITY, "Password must be 12-128 code points");
        }

        String displayName = "Learner";
        if (req.displayName() != null && !req.displayName().isBlank()) {
            String trimmedName = req.displayName().trim();
            if (trimmedName.codePointCount(0, trimmedName.length()) > 80) {
                throw new ResponseStatusException(HttpStatus.UNPROCESSABLE_ENTITY, "Display name exceeds 80 code points");
            }
            displayName = trimmedName;
        }

        String cefr = "B1";
        if (req.cefrLevel() != null && !req.cefrLevel().isBlank()) {
            String upperCefr = req.cefrLevel().trim().toUpperCase();
            if (!VALID_CEFR.contains(upperCefr)) {
                throw new ResponseStatusException(HttpStatus.UNPROCESSABLE_ENTITY, "Invalid CEFR level");
            }
            cefr = upperCefr;
        }

        User newUser = new User(
                UUID.randomUUID(),
                trimmedEmail,
                passwordEncoder.encode(req.password()),
                displayName,
                cefr,
                Instant.now()
        );

        if (usersByEmail.putIfAbsent(trimmedEmail, newUser) != null) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Email already exists");
        }

        return UserResponse.from(newUser);
    }

    public TokenResponse login(LoginRequest req) {
        if (req == null || req.email() == null || req.password() == null) {
            throw new ResponseStatusException(HttpStatus.UNPROCESSABLE_ENTITY, "Missing credentials");
        }

        String trimmedEmail = req.email().trim().toLowerCase();
        User user = usersByEmail.get(trimmedEmail);

        if (user == null || !passwordEncoder.matches(req.password(), user.passwordHash())) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Invalid credentials");
        }

        String token = jwtService.generateToken(user);
        return new TokenResponse(
                token,
                "bearer",
                jwtService.getExpirationSeconds(),
                UserResponse.from(user)
        );
    }
}