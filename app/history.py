"""SQLite archive of text snapshots, separate from live model sessions."""

import json
import sqlite3
from contextlib import contextmanager
from datetime import datetime, timezone
from pathlib import Path

from app.errors import AppError
from app.models import Conversation


class HistoryRepository:
    def __init__(self, path: Path):
        self.path = Path(path)
        try:
            self.path.parent.mkdir(parents=True, exist_ok=True)
            with self._connection() as db:
                version = db.execute("PRAGMA user_version").fetchone()[0]
                if version not in (0, 1):
                    raise AppError(
                        "This database needs a newer app version.", 503, "history_storage_error"
                    )
                db.execute("""CREATE TABLE IF NOT EXISTS conversations (
                    record_id INTEGER PRIMARY KEY AUTOINCREMENT,
                    session_id TEXT NOT NULL UNIQUE,
                    title TEXT NOT NULL,
                    device TEXT NOT NULL,
                    language TEXT NOT NULL,
                    solved INTEGER NOT NULL,
                    updated_at TEXT NOT NULL,
                    snapshot TEXT NOT NULL
                )""")
                db.execute("PRAGMA user_version = 1")
        except OSError:
            raise AppError(
                "Cannot create the local history database.", 503, "history_storage_error"
            ) from None

    @contextmanager
    def _connection(self):
        db = None
        try:
            db = sqlite3.connect(self.path, timeout=5)
            db.row_factory = sqlite3.Row
            with db:
                yield db
        except sqlite3.Error:
            raise AppError(
                "Cannot read or save local history. Check disk space and folder permissions.",
                503,
                "history_storage_error",
            ) from None
        finally:
            if db is not None:
                db.close()

    def save(self, session: Conversation):
        # Whitelist text fields. Do not serialize dataclass internals or draft_image.
        snapshot = session.summary()
        snapshot["original_question"] = (
            session.turns[0].question if session.turns else session.draft_question
        )
        title = (
            session.understanding.problem
            if session.understanding
            else snapshot["original_question"]
        )
        if not title:
            return  # Empty sessions are not useful saved conversations.
        with self._connection() as db:
            db.execute(
                """INSERT INTO conversations
                (session_id,title,device,language,solved,updated_at,snapshot)
                VALUES (?,?,?,?,?,?,?) ON CONFLICT(session_id) DO UPDATE SET
                title=excluded.title, device=excluded.device, language=excluded.language,
                solved=excluded.solved, updated_at=excluded.updated_at, snapshot=excluded.snapshot""",
                (
                    session.id,
                    title[:500],
                    session.device,
                    session.language,
                    int(session.solved),
                    datetime.now(timezone.utc).isoformat(timespec="seconds"),
                    json.dumps(snapshot, ensure_ascii=False),
                ),
            )

    def list(self, query: str = "", before: int | None = None) -> dict:
        # Escape LIKE wildcards: searches are literal, not user-supplied patterns.
        pattern = "%" + query.replace("\\", "\\\\").replace("%", "\\%").replace("_", "\\_") + "%"
        with self._connection() as db:
            rows = db.execute(
                """SELECT record_id,session_id,title,device,language,solved,updated_at
                FROM conversations WHERE (? IS NULL OR record_id < ?)
                AND (title LIKE ? ESCAPE '\\' OR snapshot LIKE ? ESCAPE '\\')
                ORDER BY record_id DESC LIMIT 51""",
                (before, before, pattern, pattern),
            ).fetchall()
        items = [dict(row) for row in rows[:50]]
        return {"items": items, "next_before": items[-1]["record_id"] if len(rows) > 50 else None}

    def get(self, session_id: str) -> dict:
        with self._connection() as db:
            row = db.execute(
                "SELECT snapshot,updated_at FROM conversations WHERE session_id=?", (session_id,)
            ).fetchone()
        if row is None:
            raise AppError("Saved conversation not found.", 404, "history_missing")
        return {**json.loads(row["snapshot"]), "updated_at": row["updated_at"]}

    def delete(self, session_id: str):
        with self._connection() as db:
            db.execute("DELETE FROM conversations WHERE session_id=?", (session_id,))
