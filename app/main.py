"""Composition root: wire concrete classes and start the local app."""

import argparse
import os
import threading
import webbrowser
from pathlib import Path

from app.config import Settings
from app.controller import ApiController
from app.errors import AppError
from app.history import HistoryRepository
from app.images import ImageProcessor
from app.ollama import OllamaClient
from app.prompts import PromptBuilder
from app.repository import SessionRepository
from app.server import LocalServer
from app.service import SupportService


class Application:
    def __init__(self, settings: Settings, history_path: Path | None = None):
        self.settings = settings
        self.history_path = history_path or default_history_path()
        self.service = SupportService(
            settings,
            SessionRepository(settings, history=HistoryRepository(self.history_path)),
            OllamaClient(settings),
            ImageProcessor(settings),
            PromptBuilder(settings),
        )
        self.controller = ApiController(self.service)

    def run(self, port: int, open_browser: bool):
        with LocalServer(("127.0.0.1", port), self.controller, self.settings) as server:
            url = f"http://127.0.0.1:{port}"
            print(
                f"Family Tech Support Assistant: {url}\nKeep this window open. Press Ctrl+C to stop.",
                flush=True,
            )
            print(f"Text history database: {self.history_path}", flush=True)
            if open_browser:
                timer = threading.Timer(0.5, lambda: webbrowser.open(url))
                timer.daemon = True
                timer.start()
            try:
                server.serve_forever()
            except KeyboardInterrupt:
                print("\nStopped.")


def default_history_path() -> Path:
    if os.name == "nt":
        folder = Path(os.environ.get("LOCALAPPDATA", Path.home() / "AppData" / "Local"))
    else:
        folder = Path(os.environ.get("XDG_DATA_HOME", Path.home() / ".local" / "share"))
    return folder / "FamilyTechSupport" / "history.sqlite3"


def main():
    parser = argparse.ArgumentParser(description="Family Tech Support Assistant")
    parser.add_argument("--port", type=int, default=8765)
    parser.add_argument(
        "--cpu-only", action="store_true", help="Use system RAM instead of GPU memory"
    )
    parser.add_argument("--no-browser", action="store_true")
    parser.add_argument("--history-db", type=Path, help="Custom path for the local SQLite history")
    args = parser.parse_args()
    if not 1024 <= args.port <= 65535:
        parser.error("Choose a port between 1024 and 65535.")
    try:
        Application(Settings(cpu_only=args.cpu_only), args.history_db).run(
            args.port, not args.no_browser
        )
    except AppError as error:
        parser.exit(1, str(error) + "\n")
    except OSError:
        parser.exit(
            1,
            "Cannot start the app. Check the extracted files and try --port 8766 if the port is busy.\n",
        )


if __name__ == "__main__":
    main()
