"""HTTP transport: local-only serving, origin checks, and bounded bodies."""

import json
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
from urllib.parse import urlsplit

from app.config import Settings
from app.controller import ApiController
from app.errors import AppError

STATIC_DIRECTORY = Path(__file__).parent / "static"
STATIC_ROUTES = {
    "/history.js": ("history.js", "text/javascript; charset=utf-8"),
    "/hindi.woff2": ("hindi.woff2", "font/woff2"),
    "/gujarati.woff2": ("gujarati.woff2", "font/woff2"),
    "/": ("index.html", "text/html; charset=utf-8"),
    "/translations.js": ("translations.js", "text/javascript; charset=utf-8"),
    "/editor.js": ("editor.js", "text/javascript; charset=utf-8"),
    "/app.js": ("app.js", "text/javascript; charset=utf-8"),
    "/style.css": ("style.css", "text/css; charset=utf-8"),
}


class LocalServer(ThreadingHTTPServer):
    daemon_threads = True

    def __init__(self, address: tuple, controller: ApiController, settings: Settings):
        self.controller = controller
        self.settings = settings
        super().__init__(address, RequestHandler)


class RequestHandler(BaseHTTPRequestHandler):
    server: LocalServer

    def setup(self):
        super().setup()
        self.connection.settimeout(15)

    def log_message(self, format, *args):
        # Never log user questions or screenshots.
        pass

    def _check_host(self):
        hosts = self.headers.get_all("Host", [])
        allowed = (f"127.0.0.1:{self.server.server_port}", f"localhost:{self.server.server_port}")
        if len(hosts) != 1 or hosts[0] not in allowed:
            raise AppError("Use the local app address.", 403, "invalid_origin")

    def _check_origin(self):
        self._check_host()
        allowed = (
            f"http://127.0.0.1:{self.server.server_port}",
            f"http://localhost:{self.server.server_port}",
        )
        if self.headers.get("Origin") not in allowed:
            raise AppError("Open this app using its local address.", 403, "invalid_origin")

    def _read_json(self) -> object:
        if self.headers.get("Content-Type", "").split(";")[0].strip() != "application/json":
            raise AppError("Send the request as JSON.", 415, "unsupported_type")
        if self.headers.get("Transfer-Encoding"):
            raise AppError("Unsupported request format.")
        lengths = self.headers.get_all("Content-Length", [])
        if len(lengths) != 1:
            raise AppError("Request length is missing or invalid.")
        try:
            length = int(lengths[0])
            if length <= 0 or length > self.server.settings.max_body_bytes:
                raise AppError(
                    "The request is empty or too large. Use a smaller screenshot.",
                    413,
                    "request_too_large",
                )
            raw = self.rfile.read(length)
            if len(raw) != length:
                raise AppError("The request was interrupted. Please try again.")
            return json.loads(raw)
        except (ValueError, UnicodeError, TimeoutError):
            raise AppError("The request could not be read. Please try again.") from None

    def _send(self, status: int, body: bytes, content_type: str):
        self.send_response(status)
        self.send_header("Content-Type", content_type)
        self.send_header("Content-Length", str(len(body)))
        self.send_header("Cache-Control", "no-store")
        self.send_header("X-Content-Type-Options", "nosniff")
        self.send_header(
            "Content-Security-Policy",
            "default-src 'self'; img-src 'self' blob: data:; style-src 'self'; script-src 'self'; connect-src 'self'; frame-ancestors 'none'; base-uri 'none'; form-action 'self'",
        )
        self.end_headers()
        try:
            self.wfile.write(body)
        except (BrokenPipeError, ConnectionResetError):
            pass

    def _json(self, status: int, data: dict):
        self._send(status, json.dumps(data).encode(), "application/json; charset=utf-8")

    def _error(self, error: AppError):
        self._json(error.status, {"error": str(error), "code": error.code})

    def do_GET(self):
        try:
            self._check_host()
            path = urlsplit(self.path).path
            if path.startswith("/api/"):
                self._json(200, self.server.controller.get(path))
                return
            if path not in STATIC_ROUTES:
                raise AppError("Page not found.", 404, "not_found")
            name, mime = STATIC_ROUTES[path]
            self._send(200, (STATIC_DIRECTORY / name).read_bytes(), mime)
        except AppError as error:
            self._error(error)
        except Exception:
            self._error(
                AppError("Something went wrong locally. Please try again.", 500, "internal_error")
            )

    def do_POST(self):
        try:
            self._check_origin()
            path = urlsplit(self.path).path
            if path not in self.server.controller.routes:
                raise AppError("Page not found.", 404, "not_found")
            self._json(200, self.server.controller.post(path, self._read_json()))
        except AppError as error:
            self._error(error)
        except Exception:
            self._error(
                AppError("Something went wrong locally. Please try again.", 500, "internal_error")
            )


if __name__ == "__main__":
    from app.main import main

    main()
