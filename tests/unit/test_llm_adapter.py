import asyncio

import pytest
from app.adapters.llm import LLMAdapter, LLMResult, validate_completion
from pydantic import BaseModel, ConfigDict, ValidationError


class RequestedSchema(BaseModel):
    model_config = ConfigDict(strict=True, extra="forbid")
    summary: str


def completion(**changes):
    values = {
        "parsed": {"summary": "A concise summary."},
        "prompt_tokens": 10,
        "completion_tokens": 5,
        "model": "test-double",
        "latency_ms": 0,
    }
    values.update(changes)
    return LLMResult(**values)


class RecordingAdapter:
    """Test double only: records the contract call and returns fixed local data."""

    def __init__(self, result):
        self.result = result
        self.calls = []

    async def complete_json(
        self,
        *,
        system: str,
        user: str,
        schema: type[BaseModel],
        temperature: float,
        max_tokens: int,
        model: str | None = None,
    ) -> LLMResult:
        self.calls.append((system, user, schema, temperature, max_tokens, model))
        validate_completion(self.result, schema)
        return self.result


def test_async_adapter_contract_works_without_provider_or_api_key():
    adapter = RecordingAdapter(completion())
    assert isinstance(adapter, LLMAdapter)
    result = asyncio.run(
        adapter.complete_json(
            system="Return only the requested JSON.",
            user="Summarize this sample.",
            schema=RequestedSchema,
            temperature=0.0,
            max_tokens=100,
        )
    )
    assert validate_completion(result, RequestedSchema).summary == "A concise summary."
    assert adapter.calls == [
        (
            "Return only the requested JSON.",
            "Summarize this sample.",
            RequestedSchema,
            0.0,
            100,
            None,
        )
    ]


def test_adapter_can_select_model_per_call():
    adapter = RecordingAdapter(completion())
    asyncio.run(
        adapter.complete_json(
            system="s",
            user="u",
            schema=RequestedSchema,
            temperature=0.2,
            max_tokens=80,
            model="selected-model",
        )
    )
    assert adapter.calls[0][-1] == "selected-model"


def test_invalid_provider_payload_cannot_satisfy_requested_schema():
    adapter = RecordingAdapter(completion(parsed={"other": "Not a summary"}))
    with pytest.raises(ValidationError):
        asyncio.run(
            adapter.complete_json(
                system="s",
                user="u",
                schema=RequestedSchema,
                temperature=0.0,
                max_tokens=50,
            )
        )


@pytest.mark.parametrize("field", ["prompt_tokens", "completion_tokens", "latency_ms"])
@pytest.mark.parametrize("value", [-1, True, "10", 1.5])
def test_usage_and_latency_reject_negative_or_coerced_values(field, value):
    with pytest.raises(ValidationError):
        completion(**{field: value})


@pytest.mark.parametrize("model", ["", " \n", 123, None])
def test_provider_model_is_nonblank_string(model):
    with pytest.raises(ValidationError):
        completion(model=model)


@pytest.mark.parametrize(
    "parsed",
    [
        [],
        "{}",
        None,
        {"not_json": object()},
        {1: "non-string key"},
        {"number": float("nan")},
        {"number": float("inf")},
    ],
)
def test_parsed_requires_json_object(parsed):
    with pytest.raises(ValidationError):
        completion(parsed=parsed)


def test_nested_json_is_supported_and_extra_metadata_rejected():
    result = completion(parsed={"values": [1, True, None, {"detail": "text"}]})
    assert result.parsed["values"][3] == {"detail": "text"}
    with pytest.raises(ValidationError):
        completion(api_key="unexpected")


def test_zero_usage_is_valid_for_local_provider():
    result = completion(prompt_tokens=0, completion_tokens=0, latency_ms=0)
    assert result.prompt_tokens == result.completion_tokens == result.latency_ms == 0


def test_validation_helper_rejects_non_schema_and_raw_result():
    with pytest.raises(TypeError):
        validate_completion(completion(), dict)
    with pytest.raises(TypeError):
        validate_completion({}, RequestedSchema)
