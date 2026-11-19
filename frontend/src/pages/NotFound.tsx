import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <section className="relative isolate grid min-h-[80vh] place-items-center px-4 pt-24 text-center">
      <div className="blob absolute top-1/3 left-1/2 -z-10 size-80 -translate-x-1/2 bg-blush/70 blur-2xl" aria-hidden />
      <div>
        <p className="eyebrow justify-center">Seite nicht gefunden</p>
        <h1 className="mt-4 font-display text-8xl italic text-rose">404</h1>
        <p className="lead mt-3">Diese Seite gönnt sich gerade eine kleine Auszeit.</p>
        <Link to="/" className="btn-primary mt-8">Zur Startseite</Link>
      </div>
    </section>
  );
}
