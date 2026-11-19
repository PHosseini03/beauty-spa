from tests.helpers import next_weekday


def test_health_and_headers(client):
    res = client.get("/api/health")
    assert res.json()["data"]["site"] == "Lumière Spa & Salon"
    assert res.headers["x-frame-options"] == "DENY"
    assert res.headers["x-content-type-options"] == "nosniff"


def test_cors_allow_list(client):
    good = client.get("/api/health", headers={"Origin": "http://localhost:5177"})
    bad = client.get("/api/health", headers={"Origin": "https://evil.example"})
    assert good.headers.get("access-control-allow-origin") == "http://localhost:5177"
    assert "access-control-allow-origin" not in bad.headers


def test_services_all_and_by_category(client):
    assert len(client.get("/api/services").json()["data"]) == 12
    nails = client.get("/api/services?category=nails").json()["data"]
    assert {s["category"] for s in nails} == {"nails"}
    assert isinstance(nails[0]["popular"], bool)


def test_services_rejects_unknown_category(client):
    res = client.get("/api/services?category=tattoo")
    assert res.status_code == 422
    assert res.json()["success"] is False


def test_staff_packages_testimonials_hours(client):
    staff = client.get("/api/staff").json()["data"]
    assert len(staff) == 5 and isinstance(staff[0]["specialties"], list)
    assert len(client.get("/api/packages").json()["data"]) == 3
    assert len(client.get("/api/testimonials").json()["data"]) == 3
    assert client.get("/api/hours").json()["data"][0]["hours"] == "Geschlossen"


def test_availability_open_day(client):
    day = next_weekday(1).isoformat()
    data = client.get(f"/api/availability?staff_id=1&service_id=1&date={day}").json()["data"]
    assert data["open"] is True
    assert data["slots"][0] == "09:00"
    assert data["slots"][-1] == "19:00"  # 60-min service must end by 20:00


def test_availability_closed_monday_and_past(client):
    monday = next_weekday(0).isoformat()
    assert client.get(f"/api/availability?staff_id=1&service_id=1&date={monday}").json()["data"]["slots"] == []
    past = client.get("/api/availability?staff_id=1&service_id=1&date=2020-01-01").json()["data"]
    assert past["open"] is False and past["slots"] == []


def test_availability_unknown_ids(client):
    day = next_weekday(1).isoformat()
    assert client.get(f"/api/availability?staff_id=99&service_id=1&date={day}").status_code == 404
    assert client.get(f"/api/availability?staff_id=1&service_id=99&date={day}").status_code == 404


def test_unknown_route_envelope(client):
    res = client.get("/api/missing")
    assert res.status_code == 404 and res.json()["success"] is False
    assert res.json()["error"] == "Nicht gefunden."
