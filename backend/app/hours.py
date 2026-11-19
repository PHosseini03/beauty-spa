"""Opening hours and slot arithmetic."""
from datetime import date

SLOT_MIN = 30
# weekday() -> (open_minute, close_minute); Monday closed.
OPENING_HOURS: dict[int, tuple[int, int] | None] = {
    0: None,
    1: (9 * 60, 20 * 60),
    2: (9 * 60, 20 * 60),
    3: (9 * 60, 20 * 60),
    4: (9 * 60, 20 * 60),
    5: (9 * 60, 18 * 60),
    6: (10 * 60, 16 * 60),
}
HOURS_LABEL = [
    {"days": "Montag", "hours": "Geschlossen"},
    {"days": "Dienstag bis Freitag", "hours": "9:00–20:00 Uhr"},
    {"days": "Samstag", "hours": "9:00–18:00 Uhr"},
    {"days": "Sonntag", "hours": "10:00–16:00 Uhr"},
]


def to_minutes(hhmm: str) -> int:
    hours, minutes = hhmm.split(":")
    return int(hours) * 60 + int(minutes)


def to_hhmm(minutes: int) -> str:
    return f"{minutes // 60:02d}:{minutes % 60:02d}"


def hours_for(day: date) -> tuple[int, int] | None:
    return OPENING_HOURS[day.weekday()]


def overlaps(start: int, end: int, booked: list[tuple[int, int]]) -> bool:
    return any(start < b_end and b_start < end for b_start, b_end in booked)


def free_slots(day: date, duration: int, booked: list[tuple[int, int]]) -> list[str]:
    window = hours_for(day)
    if window is None:
        return []
    open_m, close_m = window
    return [
        to_hhmm(start)
        for start in range(open_m, close_m - duration + 1, SLOT_MIN)
        if not overlaps(start, start + duration, booked)
    ]
