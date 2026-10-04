"""Bounded, temporary conversations. Text snapshots optionally go to the SQLite archive."""

import secrets
import threading
import time
from dataclasses import replace
from typing import Callable

from app.config import Settings
from app.errors import AppError
from app.history import HistoryRepository
from app.models import Conversation, Turn


class SessionRepository:
    def __init__(
        self,
        settings: Settings,
        clock: Callable[[], float] = time.monotonic,
        history: HistoryRepository | None = None,
    ):
        self.history = history
        self.settings = settings
        self.clock = clock
        self.sessions: dict[str, Conversation] = {}
        self.last_used: dict[str, float] = {}
        self.lock = threading.Lock()

    def _remove_expired(self):
        now = self.clock()
        expired = [
            key
            for key, used in self.last_used.items()
            if now - used >= self.settings.session_ttl_seconds
        ]
        for key in expired:
            self.sessions.pop(key, None)
            self.last_used.pop(key, None)

    def _get(self, session_id: str) -> Conversation:
        self._remove_expired()
        session = self.sessions.get(session_id)
        if session is None:
            raise AppError(
                "This conversation expired. Start a new problem.", 404, "session_missing"
            )
        self.last_used[session_id] = self.clock()
        return session

    def create(self, device: str, language: str = "en", save_history: bool = False) -> Conversation:
        with self.lock:
            self._remove_expired()
            if len(self.sessions) >= self.settings.max_sessions:
                raise AppError(
                    "Too many open conversations. Close an old problem or wait 30 minutes.",
                    429,
                    "session_capacity",
                )
            session = Conversation(
                id=secrets.token_urlsafe(24),
                device=device,
                language=language,
                save_history=save_history,
            )
            self.sessions[session.id] = session
            self.last_used[session.id] = self.clock()
            return session

    def get(self, session_id: str) -> Conversation:
        with self.lock:
            return self._get(session_id)

    def append(self, session_id: str, version: int, turn: Turn) -> Conversation:
        with self.lock:
            session = self._get(session_id)
            self._check_version(session, version)
            if session.solved:
                raise AppError(
                    "This problem is already solved. Start a new one.", 409, "session_solved"
                )
            updated = replace(
                session,
                turns=(*session.turns, turn),
                version=session.version + 1,
                draft_image=None,
                draft_question="",
                confirmed=True,
            )
            self._commit(updated)
            return updated

    def solve(self, session_id: str, version: int) -> Conversation:
        with self.lock:
            session = self._get(session_id)
            self._check_version(session, version)
            if not session.turns:
                raise AppError("Ask a question before marking this problem solved.")
            turns = (*session.turns[:-1], replace(session.turns[-1], outcome="worked"))
            updated = replace(session, solved=True, turns=turns, version=session.version + 1)
            self._commit(updated)
            return updated

    def update(self, session_id: str, version: int, **changes) -> Conversation:
        with self.lock:
            session = self._get(session_id)
            self._check_version(session, version)
            updated = replace(session, version=version + 1, **changes)
            self._commit(updated)
            return updated

    def feedback(self, session_id: str, version: int, outcome: str, note: str) -> Conversation:
        with self.lock:
            session = self._get(session_id)
            self._check_version(session, version)
            if not session.turns or session.solved or session.turns[-1].answer.kind != "step":
                raise AppError("There is no active step to mark.", 409, "invalid_state")
            if session.turns[-1].outcome != "pending":
                raise AppError("This outcome is already recorded.", 409, "invalid_state")
            turns = (*session.turns[:-1], replace(session.turns[-1], outcome=outcome, note=note))
            updated = replace(session, turns=turns, version=version + 1)
            self._commit(updated)
            return updated

    def _commit(self, updated: Conversation):
        if updated.save_history and self.history:
            self.history.save(updated)
        self.sessions[updated.id] = updated

    def forget_history(self, session_id: str) -> Conversation | None:
        with self.lock:
            if self.history:
                self.history.delete(session_id)
            session = self.sessions.get(session_id)
            if session is not None and session.save_history:
                session = replace(session, save_history=False, version=session.version + 1)
                self.sessions[session_id] = session
            return session

    def delete(self, session_id: str):
        with self.lock:
            # Idempotent so an expired session can still be reset.
            self.sessions.pop(session_id, None)
            self.last_used.pop(session_id, None)

    @staticmethod
    def _check_version(session: Conversation, version: int):
        if session.version != version:
            raise AppError(
                "This conversation changed. Start a new problem to avoid repeating a step.",
                409,
                "session_conflict",
            )
