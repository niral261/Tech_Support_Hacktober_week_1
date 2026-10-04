"""Application defaults in one place."""

from dataclasses import dataclass


@dataclass(frozen=True)
class Settings:
    model: str = "gemma3:4b"
    context_tokens: int = 4096
    reply_tokens: int = 384
    model_timeout_seconds: int = 240
    cpu_only: bool = False
    max_turns: int = 10
    max_sessions: int = 20
    session_ttl_seconds: int = 1800
    max_image_bytes: int = 5 * 1024 * 1024
    max_body_bytes: int = 8 * 1024 * 1024
    prompt_character_budget: int = 6500


DEVICES = ("Windows computer", "Android phone", "iPhone", "Other device")
