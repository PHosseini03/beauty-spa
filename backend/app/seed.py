"""Create tables and seed fictional demo data."""
import json
import sqlite3

SCHEMA = """
CREATE TABLE IF NOT EXISTS services (
    id INTEGER PRIMARY KEY, category TEXT NOT NULL, name TEXT NOT NULL, description TEXT NOT NULL,
    duration_min INTEGER NOT NULL, price INTEGER NOT NULL, popular INTEGER NOT NULL DEFAULT 0
);
CREATE TABLE IF NOT EXISTS staff (
    id INTEGER PRIMARY KEY, name TEXT NOT NULL, role TEXT NOT NULL, specialties TEXT NOT NULL,
    bio TEXT NOT NULL, image TEXT NOT NULL, rating REAL NOT NULL
);
CREATE TABLE IF NOT EXISTS appointments (
    id INTEGER PRIMARY KEY AUTOINCREMENT, service_id INTEGER NOT NULL REFERENCES services(id),
    staff_id INTEGER NOT NULL REFERENCES staff(id), date TEXT NOT NULL, time TEXT NOT NULL,
    end_time TEXT NOT NULL, name TEXT NOT NULL, email TEXT NOT NULL, phone TEXT NOT NULL,
    notes TEXT NOT NULL, created_at TEXT NOT NULL DEFAULT (datetime('now'))
);
CREATE TABLE IF NOT EXISTS gift_cards (
    id INTEGER PRIMARY KEY AUTOINCREMENT, amount INTEGER NOT NULL, purchaser_name TEXT NOT NULL,
    purchaser_email TEXT NOT NULL, recipient_name TEXT NOT NULL, recipient_email TEXT NOT NULL,
    message TEXT NOT NULL, delivery TEXT NOT NULL, created_at TEXT NOT NULL DEFAULT (datetime('now'))
);
"""

SERVICES = [
    (1, "hair", "Signature Schnitt & Styling", "Beratung, Haarwäsche, Präzisionsschnitt und Föhn-Finish.", 60, 85, 1),
    (2, "hair", "Balayage & Glossing", "Handgemalte, sonnengeküsste Farbe mit pflegendem Glossing.", 150, 240, 1),
    (3, "hair", "Keratin-Glättung", "Glänzendes Haar ohne Frizz – bis zu 12 Wochen lang.", 120, 195, 0),
    (4, "nails", "Luxus-Gel-Maniküre", "Nagelhautpflege, Formen und langhaftender Gel-Lack.", 45, 55, 1),
    (5, "nails", "Spa-Pediküre", "Warmes Fußbad, Peeling, Massage und Lack.", 60, 70, 0),
    (6, "nails", "Nail-Art-Set", "Individuell handgemalte Designs auf Gel oder Verlängerung.", 75, 90, 0),
    (7, "skin", "Lumière Glow Gesichtsbehandlung", "Unsere Signature-Behandlung mit Enzympeeling und LED-Therapie.", 75, 145, 1),
    (8, "skin", "HydraFacial Deluxe", "Tiefenreinigung, Ausreinigung und Serum-Infusion.", 60, 175, 0),
    (9, "skin", "Brow & Lash Lifting", "Geliftete, gefärbte Wimpern und perfekt geformte Brauen.", 60, 95, 0),
    (10, "massage", "Schwedische Entspannungsmassage", "Lange, fließende Griffe, die jede Anspannung lösen.", 60, 110, 0),
    (11, "massage", "Hot-Stone-Ritual", "Warme Basaltsteine und aromatische Öle.", 90, 160, 1),
    (12, "massage", "Tiefengewebsmassage", "Gezielter Druck für Verspannungen und feste Muskeln.", 60, 125, 0),
]

STAFF = [
    (1, "Charlotte Weber", "Creative Director & Coloristin", ["hair"], "Fünfzehn Jahre Colour-Erfahrung in Paris und Berlin.", "/images/staff-1.jpg", 5.0),
    (2, "Sophie Becker", "Senior-Stylistin", ["hair", "skin"], "Präzisionsschnitte, Brautstyling und Augenbrauen-Design.", "/images/staff-2.jpg", 4.9),
    (3, "Lena Hoffmann", "Nail-Designerin", ["nails"], "Von minimalistisch-elegant bis zu ausdrucksstarker Nail-Art.", "/images/staff-3.jpg", 4.9),
    (4, "Clara Schneider", "Leitende Kosmetikerin", ["skin", "massage"], "Staatlich geprüfte Kosmetikerin mit Schwerpunkt auf sensibler Haut.", "/images/staff-4.jpg", 5.0),
    (5, "Marie Fischer", "Massagetherapeutin", ["massage"], "Zertifiziert in Tiefengewebs-, Hot-Stone- und Schwangerschaftsmassage.", "/images/staff-5.jpg", 4.8),
]


def seed(conn: sqlite3.Connection) -> None:
    conn.executescript(SCHEMA)
    if conn.execute("SELECT COUNT(*) FROM services").fetchone()[0] == 0:
        conn.executemany("INSERT INTO services VALUES (?, ?, ?, ?, ?, ?, ?)", SERVICES)
        conn.executemany(
            "INSERT INTO staff VALUES (?, ?, ?, ?, ?, ?, ?)",
            [(s[0], s[1], s[2], json.dumps(s[3]), s[4], s[5], s[6]) for s in STAFF],
        )
    conn.commit()
