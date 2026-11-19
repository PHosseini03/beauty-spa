// Fictional demo data. Mirrors the backend seed so the site works offline.
export type Category = "hair" | "nails" | "skin" | "massage";

export interface Service {
  id: number;
  category: Category;
  name: string;
  description: string;
  duration_min: number;
  price: number;
  popular: boolean;
}

export interface Staff {
  id: number;
  name: string;
  role: string;
  specialties: Category[];
  bio: string;
  image: string;
  rating: number;
}

export interface Package {
  id: number;
  name: string;
  price: number;
  save: number;
  items: string[];
  featured: boolean;
}

export interface Testimonial {
  id: number;
  name: string;
  service: string;
  rating: number;
  text: string;
}

export const CATEGORIES: { id: Category; label: string; image: string; blurb: string }[] = [
  { id: "hair", label: "Haare", image: "/images/hair.jpg", blurb: "Schnitt, Farbe & Glättung" },
  { id: "nails", label: "Nägel", image: "/images/nails.jpg", blurb: "Gel, Pediküre & Nail-Art" },
  { id: "skin", label: "Haut", image: "/images/skin.jpg", blurb: "Gesicht, Brauen & Wimpern" },
  { id: "massage", label: "Massage", image: "/images/massage.jpg", blurb: "Entspannen & regenerieren" },
];

export const DEMO_SERVICES: Service[] = [
  { id: 1, category: "hair", name: "Signature Schnitt & Styling", description: "Beratung, Haarwäsche, Präzisionsschnitt und Föhn-Finish.", duration_min: 60, price: 85, popular: true },
  { id: 2, category: "hair", name: "Balayage & Glossing", description: "Handgemalte, sonnengeküsste Farbe mit pflegendem Glossing.", duration_min: 150, price: 240, popular: true },
  { id: 3, category: "hair", name: "Keratin-Glättung", description: "Glänzendes Haar ohne Frizz – bis zu 12 Wochen lang.", duration_min: 120, price: 195, popular: false },
  { id: 4, category: "nails", name: "Luxus-Gel-Maniküre", description: "Nagelhautpflege, Formen und langhaftender Gel-Lack.", duration_min: 45, price: 55, popular: true },
  { id: 5, category: "nails", name: "Spa-Pediküre", description: "Warmes Fußbad, Peeling, Massage und Lack.", duration_min: 60, price: 70, popular: false },
  { id: 6, category: "nails", name: "Nail-Art-Set", description: "Individuell handgemalte Designs auf Gel oder Verlängerung.", duration_min: 75, price: 90, popular: false },
  { id: 7, category: "skin", name: "Lumière Glow Gesichtsbehandlung", description: "Unsere Signature-Behandlung mit Enzympeeling und LED-Therapie.", duration_min: 75, price: 145, popular: true },
  { id: 8, category: "skin", name: "HydraFacial Deluxe", description: "Tiefenreinigung, Ausreinigung und Serum-Infusion.", duration_min: 60, price: 175, popular: false },
  { id: 9, category: "skin", name: "Brow & Lash Lifting", description: "Geliftete, gefärbte Wimpern und perfekt geformte Brauen.", duration_min: 60, price: 95, popular: false },
  { id: 10, category: "massage", name: "Schwedische Entspannungsmassage", description: "Lange, fließende Griffe, die jede Anspannung lösen.", duration_min: 60, price: 110, popular: false },
  { id: 11, category: "massage", name: "Hot-Stone-Ritual", description: "Warme Basaltsteine und aromatische Öle.", duration_min: 90, price: 160, popular: true },
  { id: 12, category: "massage", name: "Tiefengewebsmassage", description: "Gezielter Druck für Verspannungen und feste Muskeln.", duration_min: 60, price: 125, popular: false },
];

export const DEMO_STAFF: Staff[] = [
  { id: 1, name: "Charlotte Weber", role: "Creative Director & Coloristin", specialties: ["hair"], bio: "Fünfzehn Jahre Colour-Erfahrung in Paris und Berlin.", image: "/images/staff-1.jpg", rating: 5 },
  { id: 2, name: "Sophie Becker", role: "Senior-Stylistin", specialties: ["hair", "skin"], bio: "Präzisionsschnitte, Brautstyling und Augenbrauen-Design.", image: "/images/staff-2.jpg", rating: 4.9 },
  { id: 3, name: "Lena Hoffmann", role: "Nail-Designerin", specialties: ["nails"], bio: "Von minimalistisch-elegant bis zu ausdrucksstarker Nail-Art.", image: "/images/staff-3.jpg", rating: 4.9 },
  { id: 4, name: "Clara Schneider", role: "Leitende Kosmetikerin", specialties: ["skin", "massage"], bio: "Staatlich geprüfte Kosmetikerin mit Schwerpunkt auf sensibler Haut.", image: "/images/staff-4.jpg", rating: 5 },
  { id: 5, name: "Marie Fischer", role: "Massagetherapeutin", specialties: ["massage"], bio: "Zertifiziert in Tiefengewebs-, Hot-Stone- und Schwangerschaftsmassage.", image: "/images/staff-5.jpg", rating: 4.8 },
];

export const DEMO_PACKAGES: Package[] = [
  { id: 1, name: "Glow-Moment", price: 199, save: 36, items: ["Lumière Glow Gesichtsbehandlung", "Luxus-Gel-Maniküre", "Brow & Lash Lifting"], featured: false },
  { id: 2, name: "Braut-Strahlen", price: 420, save: 85, items: ["Signature Schnitt & Styling", "HydraFacial Deluxe", "Spa-Pediküre", "Luxus-Gel-Maniküre", "Hot-Stone-Ritual"], featured: true },
  { id: 3, name: "Auszeit-Ritual", price: 245, save: 40, items: ["Hot-Stone-Ritual", "Spa-Pediküre", "Kräutertee-Lounge"], featured: false },
];

export const DEMO_TESTIMONIALS: Testimonial[] = [
  { id: 1, name: "Julia B.", service: "Balayage & Glossing", rating: 5, text: "Charlotte hat mir das weichste, natürlichste Balayage gezaubert, das ich je hatte. Ich bekomme jeden Tag Komplimente." },
  { id: 2, name: "Katrin S.", service: "Lumière Glow Gesichtsbehandlung", rating: 5, text: "Meine Haut sah noch nie so ruhig und strahlend aus. Der ganze Salon fühlt sich an wie ein kleiner Rückzugsort." },
  { id: 3, name: "Anna W.", service: "Hot-Stone-Ritual", rating: 5, text: "Neunzig Minuten pures Glück. Marie hat Verspannungen gefunden, von denen ich nichts wusste." },
];

export const HOURS = [
  { days: "Montag", hours: "Geschlossen" },
  { days: "Dienstag bis Freitag", hours: "9:00–20:00 Uhr" },
  { days: "Samstag", hours: "9:00–18:00 Uhr" },
  { days: "Sonntag", hours: "10:00–16:00 Uhr" },
];

export const CONTACT = {
  phone: "+49 30 5550 177",
  email: "hallo@lumiere.example",
  address: "Rosenweg 28, 10115 Berlin",
};
