"""Map API routes to application use cases."""

from app.errors import AppError
from app.service import SupportService


class ApiController:
    def __init__(self, service: SupportService):
        self.service = service
        self.routes = {
            "/api/sessions": service.create_session,
            "/api/help": service.ask,
            "/api/analyze": service.analyze,
            "/api/correct": service.correct,
            "/api/confirm": service.confirm,
            "/api/feedback": service.feedback,
            "/api/solve": service.solve,
            "/api/reset": service.reset,
            "/api/history/list": service.list_history,
            "/api/history/read": service.read_history,
            "/api/history/delete": service.delete_history,
        }

    def get(self, path: str) -> dict:
        if path == "/api/health":
            return self.service.health()
        raise AppError("Page not found.", 404, "not_found")

    def post(self, path: str, data: object) -> dict:
        handler = self.routes.get(path)
        if handler is None:
            raise AppError("Page not found.", 404, "not_found")
        return handler(data)
