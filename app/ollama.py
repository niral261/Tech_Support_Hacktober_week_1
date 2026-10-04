"""Adapter between the application and Ollama's local HTTP API."""

import json
import socket
import urllib.error
import urllib.request
from typing import Protocol

from app.config import Settings
from app.errors import AppError
from app.models import SupportAnswer, Understanding


class ModelClient(Protocol):
    def health(self) -> dict: ...
    def generate(self, messages: list[dict]) -> dict: ...
    def analyze(self, messages: list[dict]) -> dict: ...


class NoRedirects(urllib.request.HTTPRedirectHandler):
    def redirect_request(self, request, file, code, message, headers, new_url):
        return None


class OllamaClient:
    BASE_URL = "http://127.0.0.1:11434"

    def __init__(self, settings: Settings):
        self.settings = settings
        self.opener = urllib.request.build_opener(urllib.request.ProxyHandler({}), NoRedirects())

    def _request(self, path: str, payload: dict | None = None, timeout: int | None = None) -> dict:
        request = urllib.request.Request(
            self.BASE_URL + path,
            data=json.dumps(payload).encode() if payload is not None else None,
            headers={"Content-Type": "application/json"},
        )
        try:
            with self.opener.open(
                request, timeout=timeout or self.settings.model_timeout_seconds
            ) as response:
                raw = response.read(1024 * 1024 + 1)
                if len(raw) > 1024 * 1024:
                    raise AppError(
                        "Ollama returned too much data. Please try again.", 502, "invalid_answer"
                    )
                result = json.loads(raw)
                if not isinstance(result, dict):
                    raise ValueError("Expected an object")
                return result
        except urllib.error.HTTPError as error:
            if error.code == 404:
                raise AppError(
                    f"Model missing. Run: ollama pull {self.settings.model}", 503, "model_missing"
                ) from None
            raise AppError(
                "Ollama could not run the model. Close other GPU apps or restart this app with --cpu-only.",
                502,
                "model_error",
            ) from None
        except (TimeoutError, socket.timeout):
            raise AppError(
                "Gemma took too long. Wait before retrying; try a shorter question or cropped screenshot.",
                504,
                "model_timeout",
            ) from None
        except urllib.error.URLError:
            raise AppError(
                "Cannot reach Ollama. Open Ollama on this PC, then check the connection.",
                503,
                "ollama_unavailable",
            ) from None
        except (ValueError, UnicodeError, OSError):
            raise AppError(
                "Ollama returned an unreadable response. Please try again.", 502, "invalid_answer"
            ) from None

    def health(self) -> dict:
        result = self._request("/api/tags", timeout=5)
        models = result.get("models")
        if not isinstance(models, list):
            raise AppError("Ollama returned an invalid model list.", 502, "invalid_answer")
        installed = any(
            isinstance(item, dict) and item.get("name") == self.settings.model for item in models
        )
        return {
            "ready": installed,
            "model": self.settings.model,
            "cpu_only": self.settings.cpu_only,
            "message": "Gemma is installed and available"
            if installed
            else f"Download in progress or model missing. Run: ollama pull {self.settings.model}",
        }

    def generate(self, messages: list[dict]) -> dict:
        return self._chat(messages, SupportAnswer.json_schema())

    def analyze(self, messages: list[dict]) -> dict:
        return self._chat(messages, Understanding.json_schema())

    def _chat(self, messages: list[dict], schema: dict) -> dict:
        options = {
            "temperature": 0.2,
            "num_ctx": self.settings.context_tokens,
            "num_predict": self.settings.reply_tokens,
        }
        if self.settings.cpu_only:
            options["num_gpu"] = 0
        result = self._request(
            "/api/chat",
            {
                "model": self.settings.model,
                "messages": messages,
                "stream": False,
                "format": schema,
                "options": options,
                "keep_alive": "5m",
            },
        )
        try:
            return json.loads(result["message"]["content"])
        except (KeyError, TypeError, ValueError):
            raise AppError(
                "Gemma returned an incomplete answer. Please try again.", 502, "invalid_answer"
            ) from None
