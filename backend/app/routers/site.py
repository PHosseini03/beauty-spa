"""Spa-specific endpoints."""
import json
import threading
from datetime import date, timedelta

from fastapi import APIRouter, HTTPException, Query, Request

from ..config import settings
from ..db import fetch_all, insert
from ..hours import HOURS_LABEL, free_slots, hours_for, overlaps, to_hhmm, to_minutes
from ..responses import ok
from ..schemas import AppointmentRequest, GiftCardRequest
from ..security import limiter

router = APIRouter()
_booking_lock = threading.Lock()
CATEGORIES = ("hair", "nails", "skin", "massage")

PACKAGES = [
    {"id": 1, "name": "Glow-Moment", "price": 199, "save": 36, "items": ["Lumière Glow Gesichtsbehandlung", "Luxus-Gel-Maniküre", "Brow & Lash Lifting"], "featured": False},
    {"id": 2, "name": "Braut-Strahlen", "price": 420, "save": 85, "items": ["Signature Schnitt & Styling", "HydraFacial Deluxe", "Spa-Pediküre", "Luxus-Gel-Maniküre", "Hot-Stone-Ritual"], "featured": True},
    {"id": 3, "name": "Auszeit-Ritual", "price": 245, "save": 40, "items": ["Hot-Stone-Ritual", "Spa-Pediküre", "Kräutertee-Lounge"], "featured": False},
]

TESTIMONIALS = [
    {"id": 1, "name": "Julia B.", "service": "Balayage & Glossing", "rating": 5, "text": "Charlotte hat mir das weichste, natürlichste Balayage gezaubert, das ich je hatte. Ich bekomme jeden Tag Komplimente."},
    {"id": 2, "name": "Katrin S.", "service": "Lumière Glow Gesichtsbehandlung", "rating": 5, "text": "Meine Haut sah noch nie so ruhig und strahlend aus. Der ganze Salon fühlt sich an wie ein kleiner Rückzugsort."},
    {"id": 3, "name": "Anna W.", "service": "Hot-Stone-Ritual", "rating": 5, "text": "Neunzig Minuten pures Glück. Marie hat Verspannungen gefunden, von denen ich nichts wusste."},
]


def _service(service_id: int) -> dict:
    rows = fetch_all("SELECT * FROM services WHERE id = ?", (service_id,))
    if not rows:
        raise HTTPException(status_code=404, detail="Behandlung nicht gefunden.")
    return rows[0]


def _staff(staff_id: int) -> dict:
    rows = fetch_all("SELECT * FROM staff WHERE id = ?", (staff_id,))
    if not rows:
        raise HTTPException(status_code=404, detail="Teammitglied nicht gefunden.")
    member = rows[0]
    return {**member, "specialties": json.loads(member["specialties"])}


def _booked(staff_id: int, day: date) -> list[tuple[int, int]]:
    rows = fetch_all("SELECT time, end_time FROM appointments WHERE staff_id = ? AND date = ?", (staff_id, day.isoformat()))
    return [(to_minutes(r["time"]), to_minutes(r["end_time"])) for r in rows]


@router.get("/services")
def list_services(category: str | None = Query(default=None, max_length=20)):
    if category is not None and category not in CATEGORIES:
        raise HTTPException(status_code=422, detail=f"Kategorie muss eine der folgenden sein: {', '.join(CATEGORIES)}")
    if category:
        rows = fetch_all("SELECT * FROM services WHERE category = ? ORDER BY id", (category,))
    else:
        rows = fetch_all("SELECT * FROM services ORDER BY id")
    return ok([{**r, "popular": bool(r["popular"])} for r in rows])


@router.get("/staff")
def list_staff():
    rows = fetch_all("SELECT * FROM staff ORDER BY id")
    return ok([{**r, "specialties": json.loads(r["specialties"])} for r in rows])


@router.get("/packages")
def list_packages():
    return ok(PACKAGES)


@router.get("/testimonials")
def list_testimonials():
    return ok(TESTIMONIALS)


@router.get("/hours")
def opening_hours():
    return ok(HOURS_LABEL)


@router.get("/availability")
def availability(staff_id: int = Query(ge=1), service_id: int = Query(ge=1), day: date = Query(alias="date")):
    service = _service(service_id)
    _staff(staff_id)
    if day <= date.today() or day > date.today() + timedelta(days=90):
        return ok({"date": day.isoformat(), "open": False, "slots": []})
    is_open = hours_for(day) is not None
    slots = free_slots(day, service["duration_min"], _booked(staff_id, day))
    return ok({"date": day.isoformat(), "open": is_open, "slots": slots})


@router.post("/appointments", status_code=201)
@limiter.limit(settings.rate_limit)
def create_appointment(request: Request, body: AppointmentRequest):
    service = _service(body.service_id)
    member = _staff(body.staff_id)
    if service["category"] not in member["specialties"]:
        raise HTTPException(status_code=422, detail=f"{member['name']} bietet „{service['name']}“ nicht an.")
    window = hours_for(body.date)
    if window is None:
        raise HTTPException(status_code=422, detail="Montags haben wir geschlossen. Bitte wählen Sie einen anderen Tag.")
    start = to_minutes(body.time)
    end = start + service["duration_min"]
    if start < window[0] or end > window[1]:
        raise HTTPException(status_code=422, detail="Bitte wählen Sie eine Uhrzeit innerhalb unserer Öffnungszeiten.")

    with _booking_lock:
        if overlaps(start, end, _booked(body.staff_id, body.date)):
            raise HTTPException(status_code=409, detail="Dieser Termin wurde soeben vergeben. Bitte wählen Sie eine andere Uhrzeit.")
        appointment_id = insert(
            "INSERT INTO appointments (service_id, staff_id, date, time, end_time, name, email, phone, notes)"
            " VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)",
            (body.service_id, body.staff_id, body.date.isoformat(), body.time, to_hhmm(end),
             body.name, str(body.email), body.phone, body.notes),
        )
    return ok({
        "id": appointment_id,
        "service": service["name"],
        "staff": member["name"],
        "date": body.date.isoformat(),
        "time": body.time,
        "price": service["price"],
        "message": f"Wir freuen uns auf Sie, {body.name}! Eine Bestätigung wurde an {body.email} gesendet.",
    })


@router.post("/gift-cards", status_code=201)
@limiter.limit(settings.rate_limit)
def create_gift_card(request: Request, body: GiftCardRequest):
    card_id = insert(
        "INSERT INTO gift_cards (amount, purchaser_name, purchaser_email, recipient_name, recipient_email, message, delivery)"
        " VALUES (?, ?, ?, ?, ?, ?, ?)",
        (body.amount, body.purchaser_name, str(body.purchaser_email), body.recipient_name,
         str(body.recipient_email), body.message, body.delivery),
    )
    code = f"LUM-{card_id:05d}"
    return ok({
        "id": card_id,
        "code": code,
        "amount": body.amount,
        "message": f"Ihr Gutschein über {body.amount} € für {body.recipient_name} ist reserviert. Die Zahlungsdetails senden wir Ihnen in Kürze per E-Mail.",
    })
