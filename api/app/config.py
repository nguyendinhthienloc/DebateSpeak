from pathlib import Path

from pydantic import Field
from pydantic_settings import BaseSettings, SettingsConfigDict

BASE_DIR = Path(__file__).resolve().parent.parent.parent


class Settings(BaseSettings):
    """Application runtime configuration loaded dynamically from environment."""

    APP_NAME: str = "DebateSpeak AI API"
    APP_ENV: str = Field(default="development")
    DEBUG: bool = Field(default=True)
    API_V1_PREFIX: str = "/api/v1"

    # Database & Cache
    DATABASE_URL: str = Field(
        default="postgresql+asyncpg://debatespeak:debatespeak_dev_pwd@localhost:5432/debatespeak"
    )
    REDIS_URL: str = Field(default="redis://localhost:6379/0")

    # Security & Auth
    SECRET_KEY: str = Field(
        default="dev-insecure-secret-key-change-in-production-min-32-chars-long"
    )
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 15
    REFRESH_TOKEN_EXPIRE_DAYS: int = 7

    # LiveKit
    LIVEKIT_URL: str = Field(default="ws://localhost:7880")
    LIVEKIT_API_KEY: str = Field(default="devkey")
    LIVEKIT_API_SECRET: str = Field(default="secret")

    model_config = SettingsConfigDict(
        env_file=str(BASE_DIR / ".env"),
        env_file_encoding="utf-8",
        extra="ignore",
    )


settings = Settings()
