"""SCRUM-47 contract; concrete provider integrations belong to later tickets."""

from typing import Protocol, TypeVar, runtime_checkable

from pydantic import BaseModel, ConfigDict, Field, JsonValue, field_validator


class LLMResult(BaseModel):
    """Provider output before the caller's requested schema is applied."""

    model_config = ConfigDict(strict=True, extra="forbid", allow_inf_nan=False)

    parsed: dict[str, JsonValue]
    prompt_tokens: int = Field(ge=0)
    completion_tokens: int = Field(ge=0)
    model: str
    latency_ms: int = Field(ge=0)

    @field_validator("model")
    @classmethod
    def nonblank_model(cls, value: str) -> str:
        if not value.strip():
            raise ValueError("model must not be blank")
        return value


@runtime_checkable
class LLMAdapter(Protocol):
    """Async JSON-only completion contract from architecture section 8.4.

    Implementations must validate parsed output against schema before returning.
    They own provider timeouts/errors and configuration; business logic depends
    only on this interface. No provider is instantiated by this module.
    """

    async def complete_json(
        self,
        *,
        system: str,
        user: str,
        schema: type[BaseModel],
        temperature: float,
        max_tokens: int,
        model: str | None = None,
    ) -> LLMResult: ...


SchemaModel = TypeVar("SchemaModel", bound=BaseModel)


def validate_completion(result: LLMResult, schema: type[SchemaModel]) -> SchemaModel:
    """Apply the requested schema; malformed provider JSON fails explicitly."""
    if not isinstance(result, LLMResult):
        raise TypeError("result must be a validated LLMResult")
    if not isinstance(schema, type) or not issubclass(schema, BaseModel):
        raise TypeError("schema must be a Pydantic BaseModel class")
    return schema.model_validate(result.parsed)
