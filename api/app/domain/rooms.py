"""SCRUM-28: room graph and pure lifecycle guards.

The room service supplies an authenticated, locked snapshot and persists the
returned state in its own transaction. These functions perform no I/O or mutation.
For join, participant_ids includes the candidate; for leave it is the pre-leave
snapshot. An idempotent join retry bypasses this graph and returns the snapshot.
"""

from dataclasses import dataclass
from enum import StrEnum


class RoomStatus(StrEnum):
    LOBBY = "LOBBY"
    READY = "READY"
    LIVE = "LIVE"
    ENDED = "ENDED"
    CANCELLED = "CANCELLED"


class TransitionReason(StrEnum):
    PARTICIPANT_JOINED = "PARTICIPANT_JOINED"
    PARTICIPANT_LEFT = "PARTICIPANT_LEFT"
    CREATOR_CANCELLED = "CREATOR_CANCELLED"
    LOBBY_EXPIRED = "LOBBY_EXPIRED"
    START_REQUESTED = "START_REQUESTED"
    PARTICIPANT_ENDED = "PARTICIPANT_ENDED"
    TIMER_EXPIRED = "TIMER_EXPIRED"
    RECONNECT_EXPIRED = "RECONNECT_EXPIRED"


class RoomRuleViolation(ValueError):
    """Stable domain code; HTTP mapping belongs to the room service."""

    def __init__(self, code: str, message: str) -> None:
        self.code = code
        super().__init__(message)


class InvalidTransition(RoomRuleViolation):
    def __init__(self, current: RoomStatus, target: RoomStatus) -> None:
        self.current = current
        self.target = target
        super().__init__(
            "INVALID_TRANSITION", f"Cannot move room from {current.value} to {target.value}."
        )


_EDGES = frozenset(
    {
        (RoomStatus.LOBBY, RoomStatus.READY),
        (RoomStatus.LOBBY, RoomStatus.CANCELLED),
        (RoomStatus.READY, RoomStatus.LOBBY),
        (RoomStatus.READY, RoomStatus.LIVE),
        (RoomStatus.READY, RoomStatus.CANCELLED),
        (RoomStatus.LIVE, RoomStatus.ENDED),
    }
)


def transition(current: RoomStatus, target: RoomStatus) -> RoomStatus:
    """Validate the graph only; this never authorizes a lifecycle operation."""
    if not isinstance(current, RoomStatus) or not isinstance(target, RoomStatus):
        raise TypeError("current and target must be RoomStatus members")
    if (current, target) not in _EDGES:
        raise InvalidTransition(current, target)
    return target


@dataclass(frozen=True)
class LifecycleContext:
    """Server-derived facts, never request-body authorization claims.

    Expiry booleans are computed by the service using its clock. trusted_service
    means the caller verified a scheduled expiry event, not an HTTP user's flag.
    Consent and mic identities represent current membership/readiness records.
    LIVE is disabled by default for Build 1.
    """

    creator_id: str
    participant_ids: tuple[str, ...]
    actor_id: str | None = None
    consented_ids: frozenset[str] = frozenset()
    mic_ready_ids: frozenset[str] = frozenset()
    lobby_expired: bool = False
    media_available: bool = False
    live_enabled: bool = False
    trusted_service: bool = False

    def __post_init__(self) -> None:
        if not isinstance(self.creator_id, str) or not self.creator_id.strip():
            raise ValueError("creator_id must be a nonblank string")
        if self.actor_id is not None and (
            not isinstance(self.actor_id, str) or not self.actor_id.strip()
        ):
            raise ValueError("actor_id must be absent or a nonblank string")
        if not isinstance(self.participant_ids, tuple):
            raise TypeError("participant_ids must be an immutable tuple")
        for name in ("consented_ids", "mic_ready_ids"):
            if not isinstance(getattr(self, name), frozenset):
                raise TypeError(f"{name} must be an immutable frozenset")
        for identities in (self.participant_ids, self.consented_ids, self.mic_ready_ids):
            if any(not isinstance(value, str) or not value.strip() for value in identities):
                raise ValueError("identities must be nonblank strings")
        for name in ("lobby_expired", "media_available", "live_enabled", "trusted_service"):
            if type(getattr(self, name)) is not bool:
                raise TypeError(f"{name} must be a boolean")


def _require(condition: bool, code: str, message: str) -> None:
    if not condition:
        raise RoomRuleViolation(code, message)


def guarded_transition(
    current: RoomStatus,
    target: RoomStatus,
    *,
    reason: TransitionReason,
    context: LifecycleContext,
) -> RoomStatus:
    """Validate graph, authorization and guards, returning a proposed new state.

    No status, membership, stance, consent, timer, media or database side effect
    occurs here. The caller applies those changes atomically after success.
    """
    transition(current, target)
    if not isinstance(reason, TransitionReason):
        raise TypeError("reason must be a TransitionReason member")
    if not isinstance(context, LifecycleContext):
        raise TypeError("context must be a LifecycleContext")
    members = frozenset(context.participant_ids)
    _require(
        len(members) == len(context.participant_ids),
        "DUPLICATE_PARTICIPANT",
        "A participant cannot occupy both seats.",
    )
    _require(len(members) <= 2, "ROOM_FULL", "A room has exactly two debater seats.")

    if target is RoomStatus.CANCELLED:
        _require(
            reason in {TransitionReason.CREATOR_CANCELLED, TransitionReason.LOBBY_EXPIRED},
            "INVALID_REASON",
            "Cancellation requires creator action or lobby expiry.",
        )
        if reason is TransitionReason.LOBBY_EXPIRED:
            _require(
                context.trusted_service, "FORBIDDEN", "Expiry requires trusted service authority."
            )
            _require(context.lobby_expired, "NOT_EXPIRED", "The lobby has not expired.")
        else:
            _require(
                context.actor_id == context.creator_id,
                "FORBIDDEN",
                "Only the creator may cancel this room.",
            )
        return target

    if target is RoomStatus.ENDED:
        _require(
            reason
            in {
                TransitionReason.PARTICIPANT_ENDED,
                TransitionReason.TIMER_EXPIRED,
                TransitionReason.RECONNECT_EXPIRED,
            },
            "INVALID_REASON",
            "Ending requires a participant action, timer expiry or reconnection expiry.",
        )
        if reason is TransitionReason.PARTICIPANT_ENDED:
            _require(
                context.actor_id in members, "FORBIDDEN", "Only a participant may end the debate."
            )
        else:
            _require(
                context.trusted_service, "FORBIDDEN", "Expiry requires trusted service authority."
            )
        return target

    _require(not context.lobby_expired, "LOBBY_EXPIRED", "An expired lobby must be cancelled.")
    _require(context.actor_id in members, "FORBIDDEN", "The caller must be a room participant.")
    _require(len(members) == 2, "PARTICIPANTS_REQUIRED", "Two distinct participants are required.")

    expected_reason = {
        RoomStatus.READY: TransitionReason.PARTICIPANT_JOINED,
        RoomStatus.LOBBY: TransitionReason.PARTICIPANT_LEFT,
        RoomStatus.LIVE: TransitionReason.START_REQUESTED,
    }[target]
    _require(
        reason is expected_reason, "INVALID_REASON", "The operation does not match this transition."
    )

    if target is RoomStatus.LIVE:
        _require(context.live_enabled, "LIVE_DISABLED", "Build 1 does not enable live sessions.")
        _require(context.media_available, "MEDIA_UNAVAILABLE", "Live media is unavailable.")
        _require(
            members <= context.consented_ids,
            "CONSENT_REQUIRED",
            "Both participants must explicitly consent.",
        )
        _require(
            members <= context.mic_ready_ids,
            "MIC_REQUIRED",
            "Both participants must pass the microphone test.",
        )
    return target
