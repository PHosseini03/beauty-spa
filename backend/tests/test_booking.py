from datetime import date

from tests.helpers import GIFT, booking, next_weekday


def test_book_appointment_success(client):
    res = client.post("/api/appointments", json=booking())
    assert res.status_code == 201
    data = res.json()["data"]
    assert data["id"] == 1 and data["service"] == "Signature Schnitt & Styling" and data["price"] == 85
    assert "Charlotte" in data["message"]


def test_booked_slot_disappears_from_availability(client):
    client.post("/api/appointments", json=booking(time="10:00"))
    day = booking()["date"]
    slots = client.get(f"/api/availability?staff_id=1&service_id=1&date={day}").json()["data"]["slots"]
    assert "10:00" not in slots and "10:30" not in slots and "09:00" in slots and "11:00" in slots


def test_double_booking_conflict(client):
    assert client.post("/api/appointments", json=booking(time="10:00")).status_code == 201
    clash = client.post("/api/appointments", json=booking(time="10:30", email="other@example.com"))
    assert clash.status_code == 409
    assert "soeben vergeben" in clash.json()["error"]
    other_staff = client.post("/api/appointments", json=booking(staff_id=2, time="10:00"))
    assert other_staff.status_code == 201


def test_rejects_past_and_far_future_dates(client):
    assert client.post("/api/appointments", json=booking(date=date.today().isoformat())).status_code == 422
    assert client.post("/api/appointments", json=booking(date="2099-01-01")).status_code == 422


def test_rejects_monday_and_outside_hours(client):
    closed = client.post("/api/appointments", json=booking(date=next_weekday(0).isoformat()))
    assert closed.status_code == 422 and "Montags" in closed.json()["error"]
    late = client.post("/api/appointments", json=booking(time="19:30"))
    assert late.status_code == 422 and "Öffnungszeiten" in late.json()["error"]
    early = client.post("/api/appointments", json=booking(time="08:00"))
    assert early.status_code == 422


def test_rejects_bad_time_format(client):
    assert client.post("/api/appointments", json=booking(time="10:15")).status_code == 422
    assert client.post("/api/appointments", json=booking(time="25:00")).status_code == 422


def test_rejects_unknown_service_staff_and_mismatch(client):
    assert client.post("/api/appointments", json=booking(service_id=999)).status_code == 404
    assert client.post("/api/appointments", json=booking(staff_id=999)).status_code == 404
    mismatch = client.post("/api/appointments", json=booking(service_id=4, staff_id=1))
    assert mismatch.status_code == 422 and "nicht an" in mismatch.json()["error"]


def test_rejects_injection_and_extra_fields(client):
    assert client.post("/api/appointments", json=booking(name="<img src=x onerror=alert(1)>")).status_code == 422
    assert client.post("/api/appointments", json=booking(is_admin=True)).status_code == 422
    assert client.post("/api/appointments", json=booking(email="bad")).status_code == 422
    assert client.post("/api/appointments", json=booking(phone="call me")).status_code == 422


def test_sql_injection_is_stored_as_text(client):
    assert client.post("/api/appointments", json=booking(notes="'); DROP TABLE appointments; --")).status_code == 201
    assert client.post("/api/appointments", json=booking(time="14:00")).json()["data"]["id"] == 2


def test_gift_card_success(client):
    res = client.post("/api/gift-cards", json=GIFT)
    assert res.status_code == 201
    data = res.json()["data"]
    assert data["code"] == "LUM-00001" and data["amount"] == 150 and "Mia" in data["message"]


def test_gift_card_validation(client):
    for bad in ({"amount": 10}, {"amount": 2000}, {"amount": 52}, {"recipient_email": "nope"},
                {"delivery": "pigeon"}, {"message": "<script>"}, {"purchaser_name": "x"}):
        res = client.post("/api/gift-cards", json={**GIFT, **bad})
        assert res.status_code == 422, bad
        assert res.json()["success"] is False


def test_body_size_limit(client):
    res = client.post("/api/gift-cards", content=b"x" * 20000, headers={"Content-Type": "application/json"})
    assert res.status_code == 413


def test_invalid_content_length(client):
    res = client.post("/api/gift-cards", content=b"{}", headers={"Content-Type": "application/json", "Content-Length": "abc"})
    assert res.status_code in (400, 422)


def test_rate_limit(client):
    codes = [client.post("/api/gift-cards", json=GIFT).status_code for _ in range(12)]
    assert 429 in codes
    body = client.post("/api/gift-cards", json=GIFT).json()
    assert body["success"] is False and "Zu viele" in body["error"]


def test_validation_messages_are_german(client):
    res = client.post("/api/gift-cards", json={**GIFT, "amount": 10, "recipient_email": "nope", "extra": 1})
    error = res.json()["error"]
    assert "Betrag: muss mindestens 25 sein" in error
    assert "E-Mail der beschenkten Person: ist keine gültige E-Mail-Adresse" in error
    assert "kein erlaubtes Feld" in error
    missing = client.post("/api/gift-cards", json={k: v for k, v in GIFT.items() if k != "purchaser_name"})
    assert "Ihr Name: ist ein Pflichtfeld" in missing.json()["error"]
    too_short = client.post("/api/appointments", json=booking(phone="12"))
    assert "Telefon: muss mindestens 7 Zeichen lang sein" in too_short.json()["error"]
    bad_time = client.post("/api/appointments", json=booking(time="10:15"))
    assert "vollen oder halben Stunde" in bad_time.json()["error"]
    bad_type = client.post("/api/appointments", json=booking(service_id="abc"))
    assert "ungültigen Wert" in bad_type.json()["error"]


def test_gift_card_message_uses_euro(client):
    assert "150 €" in client.post("/api/gift-cards", json=GIFT).json()["data"]["message"]
