"""Application use cases. Independent of HTTP and browser code."""

import re
import threading
import time

from app.config import Settings
from app.errors import AppError
from app.images import ImageProcessor
from app.models import SupportAnswer, Turn, Understanding
from app.ollama import ModelClient
from app.prompts import PromptBuilder
from app.repository import SessionRepository
from app.validation import RequestValidator


class SupportService:
    def __init__(
        self,
        settings: Settings,
        repository: SessionRepository,
        model: ModelClient,
        images: ImageProcessor,
        prompts: PromptBuilder,
    ):
        self.settings = settings
        self.repository = repository
        self.model = model
        self.images = images
        self.prompts = prompts
        self.inference_lock = threading.Lock()

    def create_session(self, data: object) -> dict:
        data = RequestValidator.object(data, {"device", "language", "save_history"})
        device = RequestValidator.device(data.get("device"))
        language = data.get("language", "en")
        if language not in ("en", "hi", "gu"):
            raise AppError("Choose English, Hindi or Gujarati.")
        save_history = data.get("save_history", False)
        if type(save_history) is not bool:
            raise AppError("Choose a valid save-history option.")
        return {
            **self.repository.create(device, language, save_history).summary(),
            "max_turns": self.settings.max_turns,
        }

    def ask(self, data: object) -> dict:
        data = RequestValidator.object(data, {"session_id", "version", "message", "image"})
        session_id = RequestValidator.session_id(data.get("session_id"))
        version = RequestValidator.version(data.get("version"))
        question = RequestValidator.message(data.get("message"))
        if not self.inference_lock.acquire(blocking=False):
            raise AppError(
                "Gemma is already answering a question. Wait and try again.", 429, "model_busy"
            )
        try:
            session = self.repository.get(session_id)
            if session.version != version:
                raise AppError(
                    "The conversation changed. Start a new problem.", 409, "session_conflict"
                )
            if not session.confirmed:
                raise AppError("Confirm the understanding first.", 409, "confirmation_required")
            if session.solved:
                raise AppError(
                    "This problem is already solved. Start a new one.", 409, "session_solved"
                )
            if len(session.turns) >= self.settings.max_turns:
                raise AppError("We’ve reached ten replies. Start a new problem.", 409, "turn_limit")
            image = self.images.process(data.get("image"))
            messages = self.prompts.build(session, question, image)
            started = time.monotonic()
            answer = SupportAnswer.from_dict(self.model.generate(messages))
            self._avoid_repeat(session, answer)
            updated = self.repository.append(session_id, version, Turn(question, answer))
            return {
                **updated.summary(),
                "answer": answer.to_dict(),
                "elapsed_seconds": round(time.monotonic() - started, 2),
                "max_turns": self.settings.max_turns,
            }
        finally:
            self.inference_lock.release()

    @staticmethod
    def _identity(data):
        return (
            RequestValidator.session_id(data.get("session_id")),
            RequestValidator.version(data.get("version")),
        )

    def analyze(self, data: object) -> dict:
        data = RequestValidator.object(data, {"session_id", "version", "message", "image"})
        session_id, version = self._identity(data)
        question = RequestValidator.message(data.get("message"))
        if not self.inference_lock.acquire(blocking=False):
            raise AppError("Gemma is busy. Try again shortly.", 429, "model_busy")
        try:
            session = self.repository.get(session_id)
            self.repository._check_version(session, version)
            if session.confirmed or session.solved:
                raise AppError("Start a new problem to analyze again.", 409, "invalid_state")
            image = self.images.process(data.get("image"))
            understanding = Understanding.from_dict(
                self.model.analyze(self.prompts.analysis(session, question, image))
            )
            return self.repository.update(
                session_id,
                version,
                understanding=understanding,
                draft_question=question,
                draft_image=image,
            ).summary()
        finally:
            self.inference_lock.release()

    def correct(self, data: object) -> dict:
        data = RequestValidator.object(data, {"session_id", "version", "understanding"})
        session_id, version = self._identity(data)
        session = self.repository.get(session_id)
        self.repository._check_version(session, version)
        if not session.understanding or session.confirmed:
            raise AppError("There is no draft understanding to edit.", 409, "invalid_state")
        try:
            understanding = Understanding.from_dict(data.get("understanding"))
        except AppError:
            raise AppError("Fill in all three understanding fields within their limits.") from None
        return self.repository.update(session_id, version, understanding=understanding).summary()

    def confirm(self, data: object) -> dict:
        data = RequestValidator.object(data, {"session_id", "version"})
        session_id, version = self._identity(data)
        if not self.inference_lock.acquire(blocking=False):
            raise AppError("Gemma is busy. Try again shortly.", 429, "model_busy")
        try:
            session = self.repository.get(session_id)
            self.repository._check_version(session, version)
            if not session.understanding or session.confirmed:
                raise AppError("Review the understanding first.", 409, "invalid_state")
            started = time.monotonic()
            messages = self.prompts.build(session, session.draft_question, session.draft_image)
            answer = SupportAnswer.from_dict(self.model.generate(messages))
            updated = self.repository.append(
                session_id, version, Turn(session.draft_question, answer)
            )
            return {
                **updated.summary(),
                "answer": answer.to_dict(),
                "elapsed_seconds": round(time.monotonic() - started, 2),
                "max_turns": self.settings.max_turns,
            }
        finally:
            self.inference_lock.release()

    def feedback(self, data: object) -> dict:
        data = RequestValidator.object(data, {"session_id", "version", "outcome", "note"})
        session_id, version = self._identity(data)
        outcome = data.get("outcome")
        note = data.get("note", "")
        if outcome not in ("failed", "unclear") or not isinstance(note, str) or len(note) > 500:
            raise AppError("Choose a valid outcome and a note up to 500 characters.")
        if outcome == "failed" and not note.strip():
            raise AppError("Describe what happened so we can avoid repeating it.")
        return self.repository.feedback(session_id, version, outcome, note.strip()).summary()

    @staticmethod
    def _avoid_repeat(session, answer):
        def normalize(text):
            return re.sub(r"[^\w]", "", text.casefold())

        if answer.kind == "step" and any(
            t.outcome == "failed"
            and normalize(t.answer.instruction) == normalize(answer.instruction)
            for t in session.turns
        ):
            raise AppError(
                "Gemma repeated a failed action. Try asking for a different safe step.",
                502,
                "repeated_step",
            )

    def solve(self, data: object) -> dict:
        data = RequestValidator.object(data, {"session_id", "version"})
        session_id = RequestValidator.session_id(data.get("session_id"))
        version = RequestValidator.version(data.get("version"))
        return self.repository.solve(session_id, version).summary()

    def reset(self, data: object) -> dict:
        data = RequestValidator.object(data, {"session_id"})
        session_id = RequestValidator.session_id(data.get("session_id"))
        self.repository.delete(session_id)
        return {"cleared": True}

    def _history(self):
        if self.repository.history is None:
            raise AppError("History is unavailable.", 503, "history_storage_error")
        return self.repository.history

    def list_history(self, data: object) -> dict:
        data = RequestValidator.object(data, {"query", "before"})
        query = data.get("query", "")
        before = data.get("before")
        if not isinstance(query, str) or len(query) > 200:
            raise AppError("Search must be at most 200 characters.")
        if before is not None and (type(before) is not int or not 0 < before < 2**63):
            raise AppError("Invalid history page.")
        return self._history().list(query.strip(), before)

    def read_history(self, data: object) -> dict:
        data = RequestValidator.object(data, {"session_id"})
        return self._history().get(RequestValidator.session_id(data.get("session_id")))

    def delete_history(self, data: object) -> dict:
        data = RequestValidator.object(data, {"session_id"})
        self._history()
        session = self.repository.forget_history(
            RequestValidator.session_id(data.get("session_id"))
        )
        return {"deleted": True, "active_session": session.summary() if session else None}

    def health(self) -> dict:
        return {
            **self.model.health(),
            "max_turns": self.settings.max_turns,
            "max_message_characters": 1200,
            "version": "1.2.0",
        }
