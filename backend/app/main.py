"""FastAPI application factory."""
import logging

from fastapi import FastAPI, Request
from fastapi.exceptions import RequestValidationError
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from slowapi.errors import RateLimitExceeded
from starlette.exceptions import HTTPException as StarletteHTTPException

from .config import settings
from .db import get_connection
from .responses import fail, ok
from .routers import site
from .security import BodySizeLimitMiddleware, SecurityHeadersMiddleware, limiter
from .seed import seed

logger = logging.getLogger("demo")


FIELD_LABELS = {
    "service_id": "Behandlung", "staff_id": "Teammitglied", "date": "Datum", "time": "Uhrzeit",
    "name": "Name", "email": "E-Mail", "phone": "Telefon", "notes": "Anmerkungen", "amount": "Betrag",
    "purchaser_name": "Ihr Name", "purchaser_email": "Ihre E-Mail", "recipient_name": "Name der beschenkten Person",
    "recipient_email": "E-Mail der beschenkten Person", "message": "Nachricht", "delivery": "Zustellung",
    "category": "Kategorie",
}
GENERIC_HTTP = {"Not Found": "Nicht gefunden.", "Method Not Allowed": "Methode nicht erlaubt."}


def _german_message(err: dict) -> str:
    """Translate a Pydantic error into a short German message."""
    kind = err.get("type", "")
    ctx = err.get("ctx") or {}
    msg = str(err.get("msg", "")).removeprefix("Value error, ")
    if kind == "value_error":
        return "ist keine gültige E-Mail-Adresse" if "email" in msg.lower() else msg
    templates = {
        "missing": "ist ein Pflichtfeld",
        "string_too_short": "muss mindestens {min_length} Zeichen lang sein",
        "string_too_long": "darf höchstens {max_length} Zeichen lang sein",
        "greater_than_equal": "muss mindestens {ge} sein",
        "less_than_equal": "darf höchstens {le} sein",
        "multiple_of": "muss ein Vielfaches von {multiple_of} sein",
        "extra_forbidden": "ist kein erlaubtes Feld",
        "literal_error": "enthält eine ungültige Auswahl",
    }
    template = templates.get(kind)
    return template.format(**ctx) if template else "enthält einen ungültigen Wert"


def _format_validation(exc: RequestValidationError) -> str:
    messages = []
    for err in exc.errors():
        parts = [str(p) for p in err.get("loc", ()) if p not in ("body", "query")]
        field = ".".join(FIELD_LABELS.get(p, p) for p in parts)
        msg = _german_message(err)
        messages.append(f"{field}: {msg}" if field else msg)
    return "; ".join(messages) or "Ungültige Anfrage."


def create_app() -> FastAPI:
    app = FastAPI(title=f"{settings.site_name} API", version="1.0.0")
    app.state.limiter = limiter

    app.add_middleware(SecurityHeadersMiddleware)
    app.add_middleware(BodySizeLimitMiddleware)
    app.add_middleware(
        CORSMiddleware,
        allow_origins=settings.allowed_origins,
        allow_methods=["GET", "POST"],
        allow_headers=["Content-Type"],
        allow_credentials=False,
    )

    @app.exception_handler(RequestValidationError)
    async def on_validation(_: Request, exc: RequestValidationError):
        return JSONResponse(fail(_format_validation(exc)), status_code=422)

    @app.exception_handler(RateLimitExceeded)
    async def on_rate_limit(_: Request, __: RateLimitExceeded):
        return JSONResponse(fail("Zu viele Anfragen. Bitte versuchen Sie es gleich noch einmal."), status_code=429)

    @app.exception_handler(StarletteHTTPException)
    async def on_http(_: Request, exc: StarletteHTTPException):
        detail = exc.detail if isinstance(exc.detail, str) else "Anfrage fehlgeschlagen."
        detail = GENERIC_HTTP.get(detail, detail)
        return JSONResponse(fail(detail), status_code=exc.status_code)

    @app.exception_handler(Exception)
    async def on_error(request: Request, exc: Exception):
        logger.exception("Unhandled error on %s", request.url.path, exc_info=exc)
        return JSONResponse(fail("Etwas ist schiefgelaufen. Bitte versuchen Sie es erneut."), status_code=500)

    @app.get("/api/health")
    def health():
        return ok({"status": "ok", "site": settings.site_name})

    app.include_router(site.router, prefix="/api")
    seed(get_connection())
    return app


app = create_app()
