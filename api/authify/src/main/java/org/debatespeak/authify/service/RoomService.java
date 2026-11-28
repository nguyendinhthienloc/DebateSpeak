package org.debatespeak.authify.service;

import tools.jackson.databind.ObjectMapper;
import jakarta.annotation.PostConstruct;
import org.debatespeak.authify.dto.RoomRequests;
import org.debatespeak.authify.dto.RoomResponses;
import org.debatespeak.authify.entity.*;
import org.debatespeak.authify.exception.ApiException;
import org.debatespeak.authify.repository.*;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;
import java.nio.charset.StandardCharsets;
import java.security.SecureRandom;
import java.time.Instant;
import java.util.*;

@Service
public class RoomService {
    private static final Set<String> FORMATS = Set.of("FREE_FLOW", "TIMED_TURNS");
    private static final Set<String> SIDES = Set.of("FOR", "AGAINST", "RANDOM");
    private static final Set<Integer> DURATIONS = Set.of(5, 10, 15, 20);
    private static final char[] CODE_CHARS = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789".toCharArray();

    private final TopicRepository topics;
    private final RoomRepository rooms;
    private final RoomParticipantRepository participants;
    private final DebateSessionRepository sessions;
    private final TranscriptSegmentRepository segments;
    private final UserRepository users;
    private final ObjectMapper objectMapper;
    private final SecureRandom random = new SecureRandom();

    @Value("${app.livekit.url:}")
    private String liveKitUrl;

    @Value("${app.livekit.api-key:}")
    private String liveKitKey;

    @Value("${app.livekit.api-secret:}")
    private String liveKitSecret;

    public RoomService(
            TopicRepository topics,
            RoomRepository rooms,
            RoomParticipantRepository participants,
            DebateSessionRepository sessions,
            TranscriptSegmentRepository segments,
            UserRepository users,
            ObjectMapper objectMapper
    ) {
        this.topics = topics;
        this.rooms = rooms;
        this.participants = participants;
        this.sessions = sessions;
        this.segments = segments;
        this.users = users;
        this.objectMapper = objectMapper;
    }

    @PostConstruct
    void seedTopics() {
        if (topics.count() != 0) {
            return;
        }
        topics.saveAll(List.of(
                new TopicEntity("topic-1", "Cities should ban private cars from the centre", "Society", "B1"),
                new TopicEntity("topic-2", "Schools should start later in the morning", "Education", "A2"),
                new TopicEntity("topic-3", "Social media does more harm than good", "Technology", "B1"),
                new TopicEntity("topic-4", "University education should be free", "Education", "B2"),
                new TopicEntity("topic-5", "Governments should limit fast fashion", "Environment", "B2"),
                new TopicEntity("topic-6", "AI should be used in classrooms", "Technology", "B1"),
                new TopicEntity("topic-7", "Public transport should be free", "Society", "A2"),
                new TopicEntity("topic-8", "Voting should be compulsory", "Politics", "C1")
        ));
    }

    public RoomResponses.Topics listTopics() {
        return new RoomResponses.Topics(
                topics.findAll().stream()
                        .map(t -> new RoomResponses.Topic(t.getId(), t.getMotion(), t.getCategory(), t.getCefrLevel()))
                        .toList()
        );
    }

    @Transactional
    public RoomResponses.Snapshot create(UserEntity user, RoomRequests.Create request) {
        if (request == null || request.topic_id() == null || request.format() == null
                || request.side() == null || request.duration_minutes() == null) {
            throw validation("room_request");
        }
        TopicEntity topic = topics.findById(request.topic_id())
                .orElseThrow(() -> validation("topic_id"));
        String format = request.format().trim().toUpperCase();
        String side = request.side().trim().toUpperCase();
        if (!FORMATS.contains(format)) {
            throw validation("format");
        }
        if (!SIDES.contains(side)) {
            throw validation("side");
        }
        if (!DURATIONS.contains(request.duration_minutes())) {
            throw validation("duration_minutes");
        }

        Instant now = Instant.now();
        RoomEntity room = new RoomEntity();
        room.setId(UUID.randomUUID());
        room.setCode(nextCode());
        room.setStatus("LOBBY");
        room.setTopicId(topic.getId());
        room.setFormat(format);
        room.setDurationSeconds("TIMED_TURNS".equals(format) ? 390 : request.duration_minutes() * 60);
        room.setCreatorId(user.getId());
        room.setCreatorSide(side);
        room.setExpiresAt(now.plusSeconds(1800));
        rooms.save(room);

        RoomParticipantEntity participant = new RoomParticipantEntity();
        participant.setId(UUID.randomUUID());
        participant.setRoomId(room.getId());
        participant.setUserId(user.getId());
        participant.setCreator(true);
        participant.setReady(false);
        participants.save(participant);

        return snapshot(room, now);
    }

    @Transactional
    public RoomResponses.Preview lookup(UserEntity user, String rawCode) {
        RoomEntity room = rooms.findByCode(normalizeCode(rawCode))
                .orElseThrow(() -> missing("room_not_found"));
        applyTime(room, Instant.now());
        if (!Set.of("LOBBY", "READY").contains(room.getStatus())) {
            throw missing("room_not_found");
        }
        List<RoomParticipantEntity> seats = participants.findByRoomIdOrderByCreatorDesc(room.getId());
        if (seats.stream().anyMatch(p -> p.getUserId().equals(user.getId()))) {
            return new RoomResponses.Preview(
                    room.getId(),
                    topic(room).getMotion(),
                    creator(room, seats).getDisplayName(),
                    room.getFormat(),
                    room.getDurationSeconds(),
                    stanceMode(room)
            );
        }
        if (seats.size() >= 2) {
            throw conflict("room_full");
        }
        return new RoomResponses.Preview(
                null,
                topic(room).getMotion(),
                creator(room, seats).getDisplayName(),
                room.getFormat(),
                room.getDurationSeconds(),
                stanceMode(room)
        );
    }

    @Transactional
    public RoomResponses.Snapshot join(UserEntity user, String rawCode) {
        RoomEntity room = rooms.findLockedByCode(normalizeCode(rawCode))
                .orElseThrow(() -> missing("room_not_found"));
        Instant now = Instant.now();
        applyTime(room, now);
        if (!"LOBBY".equals(room.getStatus())) {
            throw conflict("room_unavailable");
        }

        List<RoomParticipantEntity> seats = participants.findByRoomIdOrderByCreatorDesc(room.getId());
        if (seats.stream().anyMatch(p -> p.getUserId().equals(user.getId()))) {
            return snapshot(room, now);
        }
        if (seats.size() >= 2) {
            throw conflict("room_full");
        }

        RoomParticipantEntity guest = new RoomParticipantEntity();
        guest.setId(UUID.randomUUID());
        guest.setRoomId(room.getId());
        guest.setUserId(user.getId());
        guest.setCreator(false);
        guest.setReady(false);
        participants.save(guest);

        RoomParticipantEntity host = seats.stream()
                .filter(RoomParticipantEntity::isCreator)
                .findFirst()
                .orElseThrow();
        String hostSide = room.getCreatorSide();
        if ("RANDOM".equals(hostSide)) {
            hostSide = random.nextBoolean() ? "FOR" : "AGAINST";
        }
        host.setSide(hostSide);
        guest.setSide(opposite(hostSide));
        participants.save(host);
        participants.save(guest);

        room.setStatus("READY");
        rooms.save(room);
        return snapshot(room, now);
    }

    @Transactional
    public RoomResponses.Snapshot get(UserEntity user, UUID id) {
        RoomEntity room = locked(id);
        Instant now = Instant.now();
        applyTime(room, now);
        requireSeat(room, user);
        return snapshot(room, now);
    }

    @Transactional
    public RoomResponses.Snapshot cancel(UserEntity user, UUID id) {
        RoomEntity room = locked(id);
        Instant now = Instant.now();
        applyTime(room, now);
        if (!user.getId().equals(room.getCreatorId())
                || !("LOBBY".equals(room.getStatus()) || "READY".equals(room.getStatus()))) {
            throw conflict("invalid_room_state");
        }
        end(room, "CANCELLED", null, now);
        return snapshot(room, now);
    }

    @Transactional
    public RoomResponses.Snapshot leave(UserEntity user, UUID id) {
        RoomEntity room = locked(id);
        Instant now = Instant.now();
        applyTime(room, now);
        RoomParticipantEntity seat = requireSeat(room, user);
        if (!("LOBBY".equals(room.getStatus()) || "READY".equals(room.getStatus()))) {
            throw conflict("invalid_room_state");
        }
        if (seat.isCreator()) {
            end(room, "CANCELLED", null, now);
        } else {
            participants.delete(seat);
            participants.findByRoomIdOrderByCreatorDesc(id).forEach(p -> {
                p.setReady(false);
                p.setInput(null);
                p.setSide(null);
                participants.save(p);
            });
            room.setStatus("LOBBY");
            room.setExpiresAt(now.plusSeconds(1800));
            rooms.save(room);
        }
        return snapshot(room, now);
    }

    @Transactional
    public RoomResponses.Snapshot ready(UserEntity user, UUID id, RoomRequests.Ready request) {
        if (request == null || !request.consent()) {
            throw new ApiException(HttpStatus.UNPROCESSABLE_ENTITY, "consent_required", "Consent is required");
        }
        String input = request.input() == null ? "" : request.input().trim().toUpperCase();
        if (!Set.of("VOICE", "TYPE").contains(input)) {
            throw validation("input");
        }

        RoomEntity room = locked(id);
        Instant now = Instant.now();
        applyTime(room, now);
        if (!"READY".equals(room.getStatus())) {
            throw conflict("invalid_room_state");
        }

        RoomParticipantEntity seat = requireSeat(room, user);
        seat.setReady(true);
        seat.setInput(input);
        participants.save(seat);

        List<RoomParticipantEntity> all = participants.findByRoomIdOrderByCreatorDesc(id);
        if (all.size() == 2 && all.stream().allMatch(RoomParticipantEntity::isReady)) {
            room.setStatus("LIVE");
            room.setStartedAt(now.plusSeconds(3));
            rooms.save(room);
            if (!sessions.existsByRoomId(id)) {
                DebateSessionEntity session = new DebateSessionEntity();
                session.setId(UUID.randomUUID());
                session.setRoomId(id);
                session.setCreatedAt(now);
                sessions.save(session);
            }
        }
        return snapshot(room, now);
    }

    @Transactional
    public RoomResponses.Snapshot unready(UserEntity user, UUID id) {
        RoomEntity room = locked(id);
        Instant now = Instant.now();
        applyTime(room, now);
        if (!"READY".equals(room.getStatus())) {
            throw conflict("invalid_room_state");
        }
        RoomParticipantEntity seat = requireSeat(room, user);
        seat.setReady(false);
        seat.setInput(null);
        participants.save(seat);
        return snapshot(room, now);
    }

    @Transactional
    public RoomResponses.Snapshot end(UserEntity user, UUID id, RoomRequests.End request) {
        RoomEntity room = locked(id);
        Instant now = Instant.now();
        applyTime(room, now);
        requireSeat(room, user);
        if (!"LIVE".equals(room.getStatus())) {
            throw conflict("invalid_room_state");
        }
        if (request == null || !Set.of("MANUAL", "DISCONNECT").contains(request.reason())) {
            throw validation("reason");
        }
        end(room, request.reason(), "MANUAL".equals(request.reason()) ? user.getId() : null, now);
        return snapshot(room, now);
    }

    @Transactional
    public RoomResponses.Turn turn(UserEntity user, UUID id, RoomRequests.Turn request) {
        RoomEntity room = locked(id);
        Instant now = Instant.now();
        applyTime(room, now);
        requireSeat(room, user);
        if (!"LIVE".equals(room.getStatus())) {
            throw conflict("invalid_room_state");
        }
        String text = request == null || request.text() == null ? "" : request.text().trim();
        if (text.isEmpty() || text.codePointCount(0, text.length()) > 500) {
            throw new ApiException(
                    HttpStatus.UNPROCESSABLE_ENTITY,
                    "invalid_turn",
                    "Text must be 1 to 500 characters"
            );
        }

        TranscriptSegmentEntity segment = new TranscriptSegmentEntity();
        segment.setId(UUID.randomUUID());
        segment.setRoomId(id);
        segment.setUserId(user.getId());
        segment.setSeq(segments.maxSeq(id) + 1);
        segment.setText(text);
        segment.setSource("TYPED");
        segment.setAtMs(Math.max(0, now.toEpochMilli() - room.getStartedAt().toEpochMilli()));
        segments.save(segment);

        return new RoomResponses.Turn(segment.getSeq(), user.getId(), text, segment.getAtMs());
    }

    @Transactional
    public RoomResponses.Turns turns(UserEntity user, UUID id, long after) {
        RoomEntity room = locked(id);
        Instant now = Instant.now();
        applyTime(room, now);
        requireSeat(room, user);
        return new RoomResponses.Turns(
                segments.findByRoomIdAndSeqGreaterThanOrderBySeqAsc(id, Math.max(0, after)).stream()
                        .map(s -> new RoomResponses.Turn(s.getSeq(), s.getUserId(), s.getText(), s.getAtMs()))
                        .toList()
        );
    }

    @Transactional
    public RoomResponses.LiveKit token(UserEntity user, UUID id) {
        RoomEntity room = locked(id);
        Instant now = Instant.now();
        applyTime(room, now);
        RoomParticipantEntity seat = requireSeat(room, user);
        if (!"LIVE".equals(room.getStatus())) {
            throw conflict("room_not_live");
        }
        if (liveKitUrl == null || liveKitUrl.isBlank()
                || liveKitKey == null || liveKitKey.isBlank()
                || liveKitSecret == null || liveKitSecret.isBlank()) {
            throw new ApiException(
                    HttpStatus.SERVICE_UNAVAILABLE,
                    "livekit_unconfigured",
                    "LiveKit is not configured"
            );
        }
        return new RoomResponses.LiveKit(liveKitToken(room, user, seat, now), liveKitUrl);
    }

    private RoomEntity locked(UUID id) {
        return rooms.findLockedById(id).orElseThrow(() -> missing("room_not_found"));
    }

    private TopicEntity topic(RoomEntity r) {
        return topics.findById(r.getTopicId())
                .orElseThrow(() -> new ApiException(
                        HttpStatus.INTERNAL_SERVER_ERROR,
                        "topic_missing",
                        "Room topic is unavailable"
                ));
    }

    private RoomParticipantEntity requireSeat(RoomEntity r, UserEntity u) {
        return participants.findByRoomIdAndUserId(r.getId(), u.getId())
                .orElseThrow(() -> new ApiException(HttpStatus.FORBIDDEN, "not_participant", "Room is not available"));
    }

    private UserEntity creator(RoomEntity r, List<RoomParticipantEntity> ps) {
        UUID id = ps.stream()
                .filter(RoomParticipantEntity::isCreator)
                .findFirst()
                .orElseThrow()
                .getUserId();
        return users.findById(id).orElseThrow();
    }

    private RoomResponses.Snapshot snapshot(RoomEntity r, Instant now) {
        List<RoomResponses.Participant> ps = participants.findByRoomIdOrderByCreatorDesc(r.getId()).stream()
                .map(p -> {
                    UserEntity u = users.findById(p.getUserId()).orElseThrow();
                    return new RoomResponses.Participant(
                            p.getUserId(),
                            u.getDisplayName(),
                            p.getSide(),
                            p.isCreator(),
                            p.isReady(),
                            p.getInput()
                    );
                })
                .toList();
        return new RoomResponses.Snapshot(
                r.getId(),
                r.getCode(),
                r.getStatus(),
                topic(r).getMotion(),
                r.getFormat(),
                r.getDurationSeconds(),
                r.getExpiresAt(),
                r.getStartedAt(),
                r.getEndedAt(),
                r.getEndReason(),
                r.getEndedBy(),
                now,
                ps
        );
    }

    private void applyTime(RoomEntity r, Instant now) {
        if ("LOBBY".equals(r.getStatus()) && !r.getExpiresAt().isAfter(now)) {
            end(r, "EXPIRED", null, now);
        } else if ("LIVE".equals(r.getStatus())
                && r.getStartedAt() != null
                && !r.getStartedAt().plusSeconds(r.getDurationSeconds()).isAfter(now)) {
            end(r, "TIMER", null, now);
        }
    }

    private void end(RoomEntity r, String reason, UUID by, Instant now) {
        r.setStatus("CANCELLED".equals(reason) || "EXPIRED".equals(reason) ? "CANCELLED" : "ENDED");
        r.setCode(null);
        r.setEndReason(reason);
        r.setEndedBy(by);
        r.setEndedAt(now);
        rooms.save(r);
    }

    private String nextCode() {
        for (int i = 0; i < 10; i++) {
            StringBuilder b = new StringBuilder(8);
            for (int j = 0; j < 8; j++) {
                b.append(CODE_CHARS[random.nextInt(CODE_CHARS.length)]);
            }
            String code = b.toString();
            if (rooms.findByCode(code).isEmpty()) {
                return code;
            }
        }
        throw new ApiException(HttpStatus.SERVICE_UNAVAILABLE, "code_generation_failed", "Could not create invite code");
    }

    private String normalizeCode(String value) {
        if (value == null) {
            throw validation("code");
        }
        String code = value.replaceAll("\\s", "").toUpperCase();
        if (!code.matches("[A-Z0-9]{8}")) {
            throw validation("code");
        }
        return code;
    }

    private String opposite(String side) {
        return "FOR".equals(side) ? "AGAINST" : "FOR";
    }

    private String stanceMode(RoomEntity r) {
        return "RANDOM".equals(r.getCreatorSide()) ? "RANDOM" : "CREATOR_PICKS";
    }

    private ApiException validation(String field) {
        return new ApiException(HttpStatus.UNPROCESSABLE_ENTITY, "validation_error", "Invalid " + field);
    }

    private ApiException conflict(String code) {
        return new ApiException(HttpStatus.CONFLICT, code, "Invalid room state");
    }

    private ApiException missing(String code) {
        return new ApiException(HttpStatus.NOT_FOUND, code, "Room is not available");
    }

    private String liveKitToken(RoomEntity room, UserEntity user, RoomParticipantEntity seat, Instant now) {
        try {
            long iat = now.getEpochSecond();
            long exp = iat + 300;
            String header = b64("{\"alg\":\"HS256\",\"typ\":\"JWT\"}");

            Map<String, Object> videoGrant = new LinkedHashMap<>();
            videoGrant.put("roomJoin", true);
            videoGrant.put("room", room.getId().toString());
            videoGrant.put("canSubscribe", true);
            videoGrant.put("canPublishData", true);
            videoGrant.put("canPublish", "VOICE".equals(seat.getInput()));

            Map<String, Object> claims = new LinkedHashMap<>();
            claims.put("iss", liveKitKey);
            claims.put("sub", user.getId().toString());
            claims.put("name", user.getDisplayName());
            claims.put("nbf", iat);
            claims.put("exp", exp);
            claims.put("video", videoGrant);

            String payload = b64(objectMapper.writeValueAsString(claims));
            String signingInput = header + "." + payload;

            Mac mac = Mac.getInstance("HmacSHA256");
            mac.init(new SecretKeySpec(liveKitSecret.getBytes(StandardCharsets.UTF_8), "HmacSHA256"));
            String signature = Base64.getUrlEncoder()
                    .withoutPadding()
                    .encodeToString(mac.doFinal(signingInput.getBytes(StandardCharsets.UTF_8)));
            return signingInput + "." + signature;
        } catch (Exception e) {
            throw new ApiException(
                    HttpStatus.SERVICE_UNAVAILABLE,
                    "livekit_token_failed",
                    "Could not issue media token"
            );
        }
    }

    private String b64(String s) {
        return Base64.getUrlEncoder().withoutPadding().encodeToString(s.getBytes(StandardCharsets.UTF_8));
    }
}
