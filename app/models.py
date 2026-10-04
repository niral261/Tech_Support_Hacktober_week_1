"""Small data objects shared by the application layers."""

from dataclasses import asdict, dataclass

from app.errors import AppError


@dataclass(frozen=True)
class SupportAnswer:
    kind: str
    title: str
    instruction: str
    explanation: str
    check: str

    LIMITS = {"title": 100, "instruction": 500, "explanation": 300, "check": 200}
    KINDS = ("step", "question", "escalate")

    @classmethod
    def from_dict(cls, data: object) -> "SupportAnswer":
        expected = {"kind", *cls.LIMITS}
        if not isinstance(data, dict) or set(data) != expected:
            raise AppError(
                "Gemma returned an incomplete answer. Please try again.", 502, "invalid_answer"
            )
        if data["kind"] not in cls.KINDS:
            raise AppError(
                "Gemma returned an unsupported answer. Please try again.", 502, "invalid_answer"
            )
        for key, limit in cls.LIMITS.items():
            value = data[key]
            if not isinstance(value, str) or not value.strip() or len(value) > limit:
                raise AppError(
                    "Gemma returned an incomplete answer. Please try again.", 502, "invalid_answer"
                )
        return cls(**{key: value.strip() for key, value in data.items()})

    @classmethod
    def json_schema(cls) -> dict:
        properties = {"kind": {"type": "string", "enum": list(cls.KINDS)}}
        for key, limit in cls.LIMITS.items():
            properties[key] = {"type": "string", "minLength": 1, "maxLength": limit}
        return {
            "type": "object",
            "additionalProperties": False,
            "properties": properties,
            "required": list(properties),
        }

    def to_dict(self) -> dict:
        return asdict(self)


@dataclass(frozen=True)
class Turn:
    question: str
    answer: SupportAnswer
    outcome: str = "pending"
    note: str = ""


@dataclass(frozen=True)
class Conversation:
    id: str
    device: str
    turns: tuple[Turn, ...] = ()
    version: int = 0
    solved: bool = False
    language: str = "en"
    understanding: "Understanding | None" = None
    confirmed: bool = False
    draft_question: str = ""
    draft_image: str | None = None
    save_history: bool = False

    def summary(self) -> dict:
        return {
            "session_id": self.id,
            "device": self.device,
            "version": self.version,
            "turn_count": len(self.turns),
            "solved": self.solved,
            "language": self.language,
            "confirmed": self.confirmed,
            "save_history": self.save_history,
            "understanding": asdict(self.understanding) if self.understanding else None,
            "attempts": [asdict(turn) for turn in self.turns],
        }


@dataclass(frozen=True)
class Understanding:
    problem: str
    evidence: str
    uncertainty: str

    LIMITS = {"problem": 500, "evidence": 500, "uncertainty": 300}

    @classmethod
    def from_dict(cls, data: object) -> "Understanding":
        if not isinstance(data, dict) or set(data) != set(cls.LIMITS):
            raise AppError("The understanding was incomplete. Try again.", 502, "invalid_answer")
        for key, limit in cls.LIMITS.items():
            if not isinstance(data[key], str) or not data[key].strip() or len(data[key]) > limit:
                raise AppError(
                    "The understanding was incomplete. Try again.", 502, "invalid_answer"
                )
        return cls(**{key: value.strip() for key, value in data.items()})

    @classmethod
    def json_schema(cls) -> dict:
        properties = {
            key: {"type": "string", "minLength": 1, "maxLength": limit}
            for key, limit in cls.LIMITS.items()
        }
        return {
            "type": "object",
            "properties": properties,
            "required": list(properties),
            "additionalProperties": False,
        }
