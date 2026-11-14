"""SCRUM-47: exact, attributable transcript evidence for learner feedback.

Grounding proves quote presence and attribution, not an AI diagnosis's accuracy.
No normalization, fuzzy matching, provider call or transcript mutation occurs.
"""

from collections import defaultdict
from collections.abc import Sequence
from dataclasses import dataclass
from enum import StrEnum
from typing import Literal

from pydantic import BaseModel, ConfigDict, field_validator


class _ImmutableModel(BaseModel):
    model_config = ConfigDict(frozen=True, strict=True, extra="forbid")


class TranscriptSegment(_ImmutableModel):
    segment_id: str
    debate_id: str
    speaker_id: str
    text: str
    is_final: bool

    @field_validator("segment_id", "debate_id", "speaker_id")
    @classmethod
    def nonblank_identity(cls, value: str) -> str:
        if not value.strip():
            raise ValueError("identity must not be blank")
        return value


class Citation(_ImmutableModel):
    segment_id: str
    quote: str

    @field_validator("segment_id")
    @classmethod
    def nonblank_segment(cls, value: str) -> str:
        if not value.strip():
            raise ValueError("segment_id must not be blank")
        return value


class FeedbackItem(_ImmutableModel):
    feedback_id: str
    debate_id: str
    speaker_id: str
    kind: Literal["language", "argument"]
    explanation: str
    remediation: str
    citations: tuple[Citation, ...]

    @field_validator("feedback_id", "debate_id", "speaker_id", "explanation", "remediation")
    @classmethod
    def nonblank_content(cls, value: str) -> str:
        if not value.strip():
            raise ValueError("feedback identity, explanation and remediation must not be blank")
        return value


class GroundingReason(StrEnum):
    NO_CITATIONS = "NO_CITATIONS"
    EMPTY_QUOTE = "EMPTY_QUOTE"
    MISSING_SEGMENT = "MISSING_SEGMENT"
    AMBIGUOUS_SEGMENT = "AMBIGUOUS_SEGMENT"
    WRONG_DEBATE = "WRONG_DEBATE"
    WRONG_SPEAKER = "WRONG_SPEAKER"
    PARTIAL_SEGMENT = "PARTIAL_SEGMENT"
    QUOTE_NOT_FOUND = "QUOTE_NOT_FOUND"


@dataclass(frozen=True)
class GroundingFailure:
    citation_index: int | None
    reason: GroundingReason


@dataclass(frozen=True)
class RejectedFeedback:
    item: FeedbackItem
    failures: tuple[GroundingFailure, ...]


@dataclass(frozen=True)
class GroundingResult:
    accepted: tuple[FeedbackItem, ...]
    rejected: tuple[RejectedFeedback, ...]


def ground_feedback(
    feedback: Sequence[FeedbackItem], segments: Sequence[TranscriptSegment]
) -> GroundingResult:
    """Keep an item only when every citation matches its finalized source.

    Segment IDs are unique within this input snapshot; duplicates fail closed,
    even when their texts happen to be identical. Supply only authorized debate
    data. Neither this pure guard nor possession of an ID grants read access.
    Result tuples preserve order within accepted and rejected groups.
    """
    index: dict[str, list[TranscriptSegment]] = defaultdict(list)
    for segment in segments:
        if not isinstance(segment, TranscriptSegment):
            raise TypeError("segments must contain validated TranscriptSegment instances")
        index[segment.segment_id].append(segment)

    accepted: list[FeedbackItem] = []
    rejected: list[RejectedFeedback] = []
    for item in feedback:
        if not isinstance(item, FeedbackItem):
            raise TypeError("feedback must contain validated FeedbackItem instances")
        failures: list[GroundingFailure] = []
        if not item.citations:
            failures.append(GroundingFailure(None, GroundingReason.NO_CITATIONS))
        for position, citation in enumerate(item.citations):
            matches = index.get(citation.segment_id, [])
            reason: GroundingReason | None = None
            if not citation.quote.strip():
                reason = GroundingReason.EMPTY_QUOTE
            elif not matches:
                reason = GroundingReason.MISSING_SEGMENT
            elif len(matches) != 1:
                reason = GroundingReason.AMBIGUOUS_SEGMENT
            else:
                source = matches[0]
                if source.debate_id != item.debate_id:
                    reason = GroundingReason.WRONG_DEBATE
                elif source.speaker_id != item.speaker_id:
                    reason = GroundingReason.WRONG_SPEAKER
                elif not source.is_final:
                    reason = GroundingReason.PARTIAL_SEGMENT
                elif citation.quote not in source.text:
                    reason = GroundingReason.QUOTE_NOT_FOUND
            if reason is not None:
                failures.append(GroundingFailure(position, reason))
        if failures:
            rejected.append(RejectedFeedback(item, tuple(failures)))
        else:
            accepted.append(item)
    return GroundingResult(tuple(accepted), tuple(rejected))
