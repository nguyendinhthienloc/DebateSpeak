from dataclasses import FrozenInstanceError, replace
from itertools import product

import pytest
from app.domain.rooms import (
    InvalidTransition,
    LifecycleContext,
    RoomRuleViolation,
    RoomStatus,
    TransitionReason,
    guarded_transition,
    transition,
)

VALID_EDGES = {
    (RoomStatus.LOBBY, RoomStatus.READY),
    (RoomStatus.LOBBY, RoomStatus.CANCELLED),
    (RoomStatus.READY, RoomStatus.LOBBY),
    (RoomStatus.READY, RoomStatus.LIVE),
    (RoomStatus.READY, RoomStatus.CANCELLED),
    (RoomStatus.LIVE, RoomStatus.ENDED),
}


@pytest.mark.parametrize(("current", "target"), tuple(product(RoomStatus, repeat=2)))
def test_complete_g1_transition_matrix(current, target):
    if (current, target) in VALID_EDGES:
        assert transition(current, target) is target
    else:
        with pytest.raises(InvalidTransition) as failure:
            transition(current, target)
        assert failure.value.code == "INVALID_TRANSITION"
        assert failure.value.current is current
        assert failure.value.target is target


@pytest.mark.parametrize("invalid", ["LOBBY", "READY", None, 0, True, object()])
def test_graph_rejects_unvalidated_statuses(invalid):
    with pytest.raises(TypeError):
        transition(invalid, RoomStatus.READY)
    with pytest.raises(TypeError):
        transition(RoomStatus.LOBBY, invalid)


def context(**changes):
    return replace(
        LifecycleContext(
            creator_id="A",
            participant_ids=("A", "B"),
            actor_id="B",
            consented_ids=frozenset({"A", "B"}),
            mic_ready_ids=frozenset({"A", "B"}),
            media_available=True,
            live_enabled=True,
        ),
        **changes,
    )


def start(facts):
    return guarded_transition(
        RoomStatus.READY,
        RoomStatus.LIVE,
        reason=TransitionReason.START_REQUESTED,
        context=facts,
    )


def test_start_requires_current_dual_consent_and_both_mics():
    facts = context()
    assert start(facts) is RoomStatus.LIVE
    assert facts == context()
    with pytest.raises(FrozenInstanceError):
        facts.live_enabled = False


@pytest.mark.parametrize(
    ("change", "code"),
    [
        ({"participant_ids": ("A",), "actor_id": "A"}, "PARTICIPANTS_REQUIRED"),
        ({"participant_ids": ("A", "A")}, "DUPLICATE_PARTICIPANT"),
        ({"participant_ids": ("A", "B", "C")}, "ROOM_FULL"),
        ({"actor_id": "C"}, "FORBIDDEN"),
        ({"actor_id": None}, "FORBIDDEN"),
        ({"lobby_expired": True}, "LOBBY_EXPIRED"),
        ({"live_enabled": False}, "LIVE_DISABLED"),
        ({"media_available": False}, "MEDIA_UNAVAILABLE"),
        ({"consented_ids": frozenset({"A"})}, "CONSENT_REQUIRED"),
        ({"consented_ids": frozenset({"B"})}, "CONSENT_REQUIRED"),
        ({"consented_ids": frozenset({"A", "C"})}, "CONSENT_REQUIRED"),
        ({"mic_ready_ids": frozenset({"A"})}, "MIC_REQUIRED"),
        ({"mic_ready_ids": frozenset({"B"})}, "MIC_REQUIRED"),
    ],
)
def test_start_fails_closed(change, code):
    with pytest.raises(RoomRuleViolation) as failure:
        start(context(**change))
    assert failure.value.code == code


def test_build_one_defaults_never_start_media():
    facts = LifecycleContext(creator_id="A", participant_ids=("A", "B"), actor_id="A")
    assert facts.live_enabled is False
    with pytest.raises(RoomRuleViolation, match="Build 1"):
        start(facts)


def test_join_and_leave_use_correct_snapshot_without_requiring_capture_consent():
    facts = context(
        consented_ids=frozenset(), mic_ready_ids=frozenset(), live_enabled=False
    )
    assert (
        guarded_transition(
            RoomStatus.LOBBY,
            RoomStatus.READY,
            reason=TransitionReason.PARTICIPANT_JOINED,
            context=facts,
        )
        is RoomStatus.READY
    )
    assert (
        guarded_transition(
            RoomStatus.READY,
            RoomStatus.LOBBY,
            reason=TransitionReason.PARTICIPANT_LEFT,
            context=facts,
        )
        is RoomStatus.LOBBY
    )


@pytest.mark.parametrize("target", [RoomStatus.READY, RoomStatus.LOBBY])
def test_expired_lobby_cannot_be_joined_or_reopened(target):
    source = RoomStatus.LOBBY if target is RoomStatus.READY else RoomStatus.READY
    reason = (
        TransitionReason.PARTICIPANT_JOINED
        if target is RoomStatus.READY
        else TransitionReason.PARTICIPANT_LEFT
    )
    with pytest.raises(RoomRuleViolation) as failure:
        guarded_transition(
            source, target, reason=reason, context=context(lobby_expired=True)
        )
    assert failure.value.code == "LOBBY_EXPIRED"


@pytest.mark.parametrize("current", [RoomStatus.LOBBY, RoomStatus.READY])
def test_creator_can_cancel_without_consent_or_media(current):
    assert (
        guarded_transition(
            current,
            RoomStatus.CANCELLED,
            reason=TransitionReason.CREATOR_CANCELLED,
            context=context(
                actor_id="A", media_available=False, consented_ids=frozenset()
            ),
        )
        is RoomStatus.CANCELLED
    )
    with pytest.raises(RoomRuleViolation) as failure:
        guarded_transition(
            current,
            RoomStatus.CANCELLED,
            reason=TransitionReason.CREATOR_CANCELLED,
            context=context(actor_id="B", trusted_service=True),
        )
    assert failure.value.code == "FORBIDDEN"


@pytest.mark.parametrize("current", [RoomStatus.LOBBY, RoomStatus.READY])
def test_lobby_expiry_requires_service_authority_and_actual_expiry(current):
    for facts, expected in [
        (context(lobby_expired=True), "FORBIDDEN"),
        (context(trusted_service=True), "NOT_EXPIRED"),
    ]:
        with pytest.raises(RoomRuleViolation) as failure:
            guarded_transition(
                current,
                RoomStatus.CANCELLED,
                reason=TransitionReason.LOBBY_EXPIRED,
                context=facts,
            )
        assert failure.value.code == expected
    assert (
        guarded_transition(
            current,
            RoomStatus.CANCELLED,
            reason=TransitionReason.LOBBY_EXPIRED,
            context=context(actor_id=None, trusted_service=True, lobby_expired=True),
        )
        is RoomStatus.CANCELLED
    )


@pytest.mark.parametrize("actor", ["A", "B"])
def test_either_participant_can_end_even_when_media_has_failed(actor):
    assert (
        guarded_transition(
            RoomStatus.LIVE,
            RoomStatus.ENDED,
            reason=TransitionReason.PARTICIPANT_ENDED,
            context=context(actor_id=actor, media_available=False, live_enabled=False),
        )
        is RoomStatus.ENDED
    )


@pytest.mark.parametrize(
    "reason", [TransitionReason.TIMER_EXPIRED, TransitionReason.RECONNECT_EXPIRED]
)
def test_service_expiry_can_end_after_disconnect_but_user_cannot_forge_it(reason):
    with pytest.raises(RoomRuleViolation) as failure:
        guarded_transition(
            RoomStatus.LIVE, RoomStatus.ENDED, reason=reason, context=context()
        )
    assert failure.value.code == "FORBIDDEN"
    assert (
        guarded_transition(
            RoomStatus.LIVE,
            RoomStatus.ENDED,
            reason=reason,
            context=context(
                actor_id=None, participant_ids=("A",), trusted_service=True
            ),
        )
        is RoomStatus.ENDED
    )


def test_outsider_cannot_end_live_room():
    with pytest.raises(RoomRuleViolation) as failure:
        guarded_transition(
            RoomStatus.LIVE,
            RoomStatus.ENDED,
            reason=TransitionReason.PARTICIPANT_ENDED,
            context=context(actor_id="C"),
        )
    assert failure.value.code == "FORBIDDEN"


@pytest.mark.parametrize(
    ("current", "target", "reason"),
    [
        (RoomStatus.LOBBY, RoomStatus.READY, TransitionReason.PARTICIPANT_LEFT),
        (RoomStatus.READY, RoomStatus.LOBBY, TransitionReason.PARTICIPANT_JOINED),
        (RoomStatus.READY, RoomStatus.LIVE, TransitionReason.CREATOR_CANCELLED),
        (RoomStatus.LOBBY, RoomStatus.CANCELLED, TransitionReason.TIMER_EXPIRED),
        (RoomStatus.LIVE, RoomStatus.ENDED, TransitionReason.LOBBY_EXPIRED),
    ],
)
def test_reasons_cannot_be_reused_for_another_operation(current, target, reason):
    with pytest.raises(RoomRuleViolation) as failure:
        guarded_transition(current, target, reason=reason, context=context())
    assert failure.value.code == "INVALID_REASON"


@pytest.mark.parametrize(
    "changes",
    [
        {"participant_ids": ["A", "B"]},
        {"consented_ids": {"A", "B"}},
        {"mic_ready_ids": {"A", "B"}},
        {"trusted_service": 1},
        {"media_available": "true"},
        {"creator_id": " "},
        {"actor_id": ""},
        {"participant_ids": ("A", " ")},
    ],
)
def test_context_rejects_mutable_or_unvalidated_facts(changes):
    with pytest.raises((TypeError, ValueError)):
        context(**changes)


def test_guard_rejects_raw_reason_and_context():
    with pytest.raises(TypeError):
        guarded_transition(
            RoomStatus.READY,
            RoomStatus.LIVE,
            reason="START_REQUESTED",
            context=context(),
        )
    with pytest.raises(TypeError):
        guarded_transition(
            RoomStatus.READY,
            RoomStatus.LIVE,
            reason=TransitionReason.START_REQUESTED,
            context={},
        )
