from datetime import date, timedelta


def next_weekday(weekday: int, weeks_ahead: int = 0) -> date:
    """Next date (strictly after today) falling on `weekday` (Mon=0)."""
    today = date.today()
    days = (weekday - today.weekday()) % 7 or 7
    return today + timedelta(days=days + 7 * weeks_ahead)


def booking(**overrides) -> dict:
    base = {
        "service_id": 1,
        "staff_id": 1,
        "date": next_weekday(1).isoformat(),
        "time": "10:00",
        "name": "Charlotte Braun",
        "email": "charlotte@example.com",
        "phone": "+49 30 555 0199",
        "notes": "Erster Besuch",
    }
    return {**base, **overrides}


GIFT = {
    "amount": 150,
    "purchaser_name": "Eva Grün",
    "purchaser_email": "ava@example.com",
    "recipient_name": "Mia Grün",
    "recipient_email": "mia@example.com",
    "message": "Alles Liebe zum Geburtstag!",
    "delivery": "email",
}
