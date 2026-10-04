"""Validate input at the application boundary, before it reaches the model."""

import re

from app.config import DEVICES
from app.errors import AppError


class RequestValidator:
    @staticmethod
    def object(data: object, fields: set[str]) -> dict:
        if not isinstance(data, dict) or set(data) - fields:
            raise AppError("The request contains unsupported fields.")
        return data

    @staticmethod
    def message(value: object) -> str:
        if not isinstance(value, str) or not value.strip() or len(value) > 1200:
            raise AppError("Enter a question or reply between 1 and 1200 characters.")
        return value.strip()

    @staticmethod
    def device(value: object) -> str:
        if value not in DEVICES:
            raise AppError("Choose a device from the list.")
        return value

    @staticmethod
    def session_id(value: object) -> str:
        if not isinstance(value, str) or not re.fullmatch(r"[A-Za-z0-9_-]{32}", value):
            raise AppError("Conversation ID is invalid. Start a new problem.")
        return value

    @staticmethod
    def version(value: object) -> int:
        if type(value) is not int or value < 0:
            raise AppError("Conversation version is invalid. Start a new problem.")
        return value
