"""Request models with strict validation."""
import re
from datetime import date, timedelta
from typing import Literal

from pydantic import BaseModel, ConfigDict, EmailStr, Field, field_validator

from .validators import check_name, check_phone, clean_text

TIME_RE = re.compile(r"^([01]\d|2[0-3]):(00|30)$")
MAX_DAYS_AHEAD = 90


class Strict(BaseModel):
    model_config = ConfigDict(extra="forbid", str_strip_whitespace=True)


class AppointmentRequest(Strict):
    service_id: int = Field(ge=1)
    staff_id: int = Field(ge=1)
    date: date
    time: str
    name: str = Field(min_length=2, max_length=80)
    email: EmailStr
    phone: str = Field(min_length=7, max_length=20)
    notes: str = Field(default="", max_length=500)

    @field_validator("date")
    @classmethod
    def _date(cls, v: date) -> date:
        today = date.today()
        if v <= today:
            raise ValueError("muss in der Zukunft liegen")
        if v > today + timedelta(days=MAX_DAYS_AHEAD):
            raise ValueError(f"muss innerhalb der nächsten {MAX_DAYS_AHEAD} Tage liegen")
        return v

    @field_validator("time")
    @classmethod
    def _time(cls, v: str) -> str:
        if not TIME_RE.match(v):
            raise ValueError("muss im Format HH:MM zur vollen oder halben Stunde sein")
        return v

    @field_validator("name")
    @classmethod
    def _name(cls, v: str) -> str:
        return check_name(v)

    @field_validator("phone")
    @classmethod
    def _phone(cls, v: str) -> str:
        return check_phone(v)

    @field_validator("notes")
    @classmethod
    def _notes(cls, v: str) -> str:
        return clean_text(v) if v else v


class GiftCardRequest(Strict):
    amount: int = Field(ge=25, le=1000, multiple_of=5)
    purchaser_name: str = Field(min_length=2, max_length=80)
    purchaser_email: EmailStr
    recipient_name: str = Field(min_length=2, max_length=80)
    recipient_email: EmailStr
    message: str = Field(default="", max_length=300)
    delivery: Literal["email", "print"] = "email"

    @field_validator("purchaser_name", "recipient_name")
    @classmethod
    def _names(cls, v: str) -> str:
        return check_name(v)

    @field_validator("message")
    @classmethod
    def _message(cls, v: str) -> str:
        return clean_text(v) if v else v
