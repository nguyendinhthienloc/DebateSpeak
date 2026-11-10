from dataclasses import FrozenInstanceError

import pytest
from app.domain.grounding import (
    Citation,
    FeedbackItem,
    GroundingReason,
    TranscriptSegment,
    ground_feedback,
)
from pydantic import ValidationError


def segment(**changes):
    values = {
        "segment_id": "s1",
        "debate_id": "d1",
        "speaker_id": "A",
        "text": "I said: He go to school every day. That is my example.",
        "is_final": True,
    }
    values.update(changes)
    return TranscriptSegment(**values)


def feedback(**changes):
    values = {
        "feedback_id": "f1",
        "debate_id": "d1",
        "speaker_id": "A",
        "kind": "language",
        "explanation": "The third-person singular subject requires 'goes'.",
        "remediation": "Say 'He goes to school every day.' Practise five similar sentences.",
        "citations": (Citation(segment_id="s1", quote="He go to school every day."),),
    }
    values.update(changes)
    return FeedbackItem(**values)


def test_exact_substring_is_kept_without_mutating_any_input():
    source, item = segment(), feedback()
    sources, items = [source], [item]
    result = ground_feedback(items, sources)
    assert result.accepted == (item,)
    assert result.rejected == ()
    assert items == [item]
    assert sources == [source]
    assert item.citations[0].quote == "He go to school every day."
    with pytest.raises(ValidationError):
        item.remediation = "Changed"
    with pytest.raises(ValidationError):
        source.text = "Changed"
    with pytest.raises(FrozenInstanceError):
        result.accepted = ()


@pytest.mark.parametrize(
    ("item", "sources", "reason"),
    [
        (feedback(citations=()), [segment()], GroundingReason.NO_CITATIONS),
        (
            feedback(citations=(Citation(segment_id="s1", quote=""),)),
            [segment()],
            GroundingReason.EMPTY_QUOTE,
        ),
        (
            feedback(citations=(Citation(segment_id="s1", quote=" \n\t"),)),
            [segment()],
            GroundingReason.EMPTY_QUOTE,
        ),
        (feedback(), [], GroundingReason.MISSING_SEGMENT),
        (feedback(), [segment(), segment()], GroundingReason.AMBIGUOUS_SEGMENT),
        (feedback(), [segment(debate_id="d2")], GroundingReason.WRONG_DEBATE),
        (feedback(), [segment(speaker_id="B")], GroundingReason.WRONG_SPEAKER),
        (feedback(), [segment(is_final=False)], GroundingReason.PARTIAL_SEGMENT),
        (
            feedback(
                citations=(
                    Citation(segment_id="s1", quote="He goes to school every day."),
                )
            ),
            [segment()],
            GroundingReason.QUOTE_NOT_FOUND,
        ),
    ],
)
def test_invalid_evidence_is_discarded_with_stable_reason(item, sources, reason):
    result = ground_feedback([item], sources)
    assert result.accepted == ()
    assert len(result.rejected) == 1
    assert result.rejected[0].item is item
    assert result.rejected[0].failures[0].reason is reason


@pytest.mark.parametrize(
    ("text", "quote"),
    [
        ("He go.", "he go."),
        ("He go.", "He go!"),
        ("He  go.", "He go."),
        ("He go.", " He go. "),
        ("It’s useful.", "It's useful."),
        ("caf\u00e9", "cafe\u0301"),
    ],
)
def test_guard_never_normalizes_or_fuzzy_matches(text, quote):
    item = feedback(citations=(Citation(segment_id="s1", quote=quote),))
    result = ground_feedback([item], [segment(text=text)])
    assert result.rejected[0].failures[0].reason is GroundingReason.QUOTE_NOT_FOUND


def test_quote_is_not_searched_in_another_segment_or_stitched_across_segments():
    item = feedback(citations=(Citation(segment_id="s1", quote="He go to school"),))
    sources = [segment(text="He go"), segment(segment_id="s2", text=" to school")]
    assert ground_feedback([item], sources).accepted == ()
    sources = [segment(text="Different"), segment(segment_id="s2")]
    assert ground_feedback([feedback()], sources).accepted == ()


def test_one_invalid_citation_rejects_whole_item_and_reports_its_position():
    item = feedback(
        citations=(
            Citation(segment_id="s1", quote="He go"),
            Citation(segment_id="missing", quote="A made up claim"),
        )
    )
    result = ground_feedback([item], [segment()])
    assert result.accepted == ()
    assert result.rejected[0].failures[0].citation_index == 1
    assert result.rejected[0].failures[0].reason is GroundingReason.MISSING_SEGMENT


def test_multiple_valid_citations_and_argument_feedback_are_supported():
    item = feedback(
        kind="argument",
        explanation="The conclusion does not address the opponent's transport-cost evidence.",
        remediation="Address the cost estimate, then state which evidence supports your conclusion.",
        citations=(
            Citation(segment_id="s1", quote="He go"),
            Citation(segment_id="s2", quote="I disagree"),
        ),
    )
    assert ground_feedback(
        [item], [segment(), segment(segment_id="s2", text="I disagree.")]
    ).accepted == (item,)


def test_partition_preserves_input_order_and_original_item_identity():
    good1, good2 = feedback(), feedback(feedback_id="f3")
    bad1 = feedback(feedback_id="f2", speaker_id="B")
    bad2 = feedback(feedback_id="f4", citations=())
    result = ground_feedback([good1, bad1, good2, bad2], [segment()])
    assert result.accepted == (good1, good2)
    assert tuple(entry.item for entry in result.rejected) == (bad1, bad2)
    assert result.accepted[0] is good1


def test_empty_batch_is_valid():
    result = ground_feedback([], [])
    assert result.accepted == result.rejected == ()


def test_duplicate_identity_fails_closed_even_when_other_debate_contains_it():
    sources = [segment(), segment(debate_id="d2", text="Different")]
    result = ground_feedback([feedback()], sources)
    assert result.rejected[0].failures[0].reason is GroundingReason.AMBIGUOUS_SEGMENT


def test_json_feedback_parses_to_immutable_citation_tuple():
    item = feedback()
    restored = FeedbackItem.model_validate_json(item.model_dump_json())
    assert restored == item
    assert isinstance(restored.citations, tuple)


@pytest.mark.parametrize(
    "field", ["feedback_id", "speaker_id", "debate_id", "explanation", "remediation"]
)
def test_blank_feedback_identity_or_instruction_is_invalid(field):
    with pytest.raises(ValidationError):
        feedback(**{field: " \n"})


def test_schema_rejects_coercion_unknown_fields_and_invalid_kind():
    with pytest.raises(ValidationError):
        segment(is_final="true")
    with pytest.raises(ValidationError):
        segment(secret="Unexpected data")
    with pytest.raises(ValidationError):
        feedback(kind="praise")
    with pytest.raises(ValidationError):
        Citation(segment_id="s1", quote=123)


def test_guard_rejects_unvalidated_raw_inputs():
    with pytest.raises(TypeError):
        ground_feedback([{}], [segment()])
    with pytest.raises(TypeError):
        ground_feedback([feedback()], [{}])
