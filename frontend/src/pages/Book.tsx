import { useState, type FormEvent } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, ArrowRight, CalendarCheck, Loader2 } from "lucide-react";
import { PageHeader } from "../components/PageHeader";
import { StepService, StepStaff, StepTime } from "../components/BookingSteps";
import { BookingSummary } from "../components/BookingSummary";
import { TextArea, TextField } from "../components/Field";
import { useToast } from "../components/toast-context";
import { useApi } from "../hooks/useApi";
import { useSubmit } from "../hooks/useSubmit";
import { DEMO_SERVICES, DEMO_STAFF, type Service, type Staff } from "../data/demo";
import { formatDay } from "../lib/booking";
import { rules, validate, type Errors } from "../lib/validation";

const STEPS = ["Behandlung", "Expertin", "Datum & Uhrzeit", "Ihre Daten"];
type Details = { name: string; email: string; phone: string; notes: string };
const SCHEMA = { name: [rules.name], email: [rules.email], phone: [rules.phone], notes: [rules.safeText] };

interface Confirmation {
  id: number;
  service: string;
  staff: string;
  date: string;
  time: string;
  message: string;
}

const toId = (v: string | null) => (v && /^\d+$/.test(v) ? Number(v) : null);

function Confirmed({ result, onAgain }: { result: Confirmation; onAgain: () => void }) {
  return (
    <section className="grid min-h-[85vh] place-items-center px-4 pt-28 pb-16">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="card max-w-lg p-10 text-center" role="status">
        <CalendarCheck className="mx-auto size-14 text-moss" aria-hidden />
        <h1 className="mt-6 text-4xl">Ihr Termin ist <span className="accent">gebucht!</span></h1>
        <p className="lead mt-4">{result.message}</p>
        <p className="mt-6 rounded-2xl bg-blush/50 p-4 text-sm">
          {result.service} bei {result.staff}
          <br />
          {formatDay(result.date, { weekday: "long", day: "numeric", month: "long" })} um {result.time} Uhr
        </p>
        <p className="mt-3 text-xs text-taupe">Buchungsnummer {String(result.id).padStart(5, "0")}</p>
        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          <Link to="/" className="btn-outline">Zur Startseite</Link>
          <button type="button" className="btn-primary" onClick={onAgain}>Weiteren Termin buchen</button>
        </div>
      </motion.div>
    </section>
  );
}

export default function Book() {
  const [params] = useSearchParams();
  const { data: services } = useApi<Service[]>("/api/services", DEMO_SERVICES);
  const { data: staff } = useApi<Staff[]>("/api/staff", DEMO_STAFF);
  const [serviceId, setServiceId] = useState<number | null>(toId(params.get("service")));
  const [staffId, setStaffId] = useState<number | null>(toId(params.get("staff")));
  const [step, setStep] = useState(serviceId ? 1 : 0);
  const [date, setDate] = useState<string | null>(null);
  const [time, setTime] = useState<string | null>(null);
  const [details, setDetails] = useState<Details>({ name: "", email: "", phone: "", notes: "" });
  const [errors, setErrors] = useState<Errors<Details>>({});
  const { status, result, submit, reset } = useSubmit<object, Confirmation>("/api/appointments");
  const toast = useToast();

  const service = services.find((s) => s.id === serviceId);
  const eligible = service ? staff.filter((m) => m.specialties.includes(service.category)) : staff;
  const member = eligible.find((m) => m.id === staffId);
  const canNext = [!!service, !!member, !!date && !!time, true][step];

  const pick = <T,>(setter: (v: T) => void) => (v: T) => {
    setter(v);
    setTime(null);
  };

  const set = (key: keyof Details) => (e: { target: { value: string } }) => {
    setDetails((prev) => ({ ...prev, [key]: e.target.value }));
    if (errors[key]) setErrors((prev) => ({ ...prev, [key]: undefined }));
  };

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    const found = validate(details, SCHEMA);
    setErrors(found);
    if (Object.keys(found).length) return toast("error", "Bitte überprüfen Sie Ihre Angaben.");
    if (!service || !member || !date || !time) return toast("error", "Bitte schließen Sie alle Schritte ab.");
    const data = await submit({ service_id: service.id, staff_id: member.id, date, time, ...details });
    if (data) toast("success", data.message);
    else toast("error", "Dieser Termin konnte nicht bestätigt werden. Bitte wählen Sie eine andere Uhrzeit oder rufen Sie uns an.");
  }

  if (status === "success" && result) {
    return <Confirmed result={result} onAgain={() => { reset(); setStep(0); setTime(null); }} />;
  }

  return (
    <>
      <PageHeader eyebrow="Online-Buchung" title={<>Ihre <span className="accent">Auszeit</span> reservieren</>} lead="Vier schnelle Schritte. Verfügbarkeit in Echtzeit, sofortige Bestätigung." image="/images/spa.jpg" />
      <section className="pb-24">
        <div className="container-x grid gap-8 lg:grid-cols-[1.6fr_1fr]">
          <div className="card min-w-0 p-5 sm:p-9">
            <ol className="mb-9 grid grid-cols-4 gap-2" aria-label="Buchungsfortschritt">
              {STEPS.map((label, i) => (
                <li key={label} aria-current={i === step ? "step" : undefined} className="text-center">
                  <span className={"block h-1.5 rounded-full " + (i <= step ? "bg-rose" : "bg-petal/60")} />
                  <span className={"mt-2 hidden text-xs sm:block " + (i === step ? "font-medium text-cocoa" : "text-taupe")}>{label}</span>
                </li>
              ))}
            </ol>
            <h2 className="mb-6 text-3xl">{STEPS[step]}</h2>
            {step === 0 && <StepService services={services} value={serviceId} onSelect={pick(setServiceId)} />}
            {step === 1 && <StepStaff staff={eligible} value={member?.id ?? null} onSelect={pick(setStaffId)} />}
            {step === 2 && service && member && <StepTime serviceId={service.id} staffId={member.id} duration={service.duration_min} date={date} time={time} onDate={pick(setDate)} onTime={setTime} />}
            {step === 3 && (
              <form id="details-form" onSubmit={onSubmit} noValidate className="grid gap-5 sm:grid-cols-2">
                <TextField label="Vollständiger Name" name="name" autoComplete="name" value={details.name} onChange={set("name")} error={errors.name} maxLength={80} />
                <TextField label="Telefon" name="phone" type="tel" autoComplete="tel" value={details.phone} onChange={set("phone")} error={errors.phone} maxLength={20} />
                <div className="sm:col-span-2"><TextField label="E-Mail" name="email" type="email" autoComplete="email" value={details.email} onChange={set("email")} error={errors.email} maxLength={120} /></div>
                <div className="sm:col-span-2"><TextArea label="Anmerkungen (optional)" name="notes" value={details.notes} onChange={set("notes")} error={errors.notes} maxLength={500} placeholder="Allergien, Haarhistorie, bevorzugte Massagestärke…" /></div>
              </form>
            )}
            <div className="mt-10 flex items-center justify-between gap-3 border-t border-petal/50 pt-6">
              <button type="button" onClick={() => setStep((s) => s - 1)} disabled={step === 0} className="btn-outline !px-5"><ArrowLeft className="size-4" aria-hidden />Zurück</button>
              {step < 3 ? (
                <button type="button" onClick={() => setStep((s) => s + 1)} disabled={!canNext} className="btn-primary">Weiter <ArrowRight className="size-4" aria-hidden /></button>
              ) : (
                <button type="submit" form="details-form" disabled={status === "submitting"} className="btn-primary">
                  {status === "submitting" ? <><Loader2 className="size-4 animate-spin" aria-hidden />Wird gebucht…</> : "Termin verbindlich buchen"}
                </button>
              )}
            </div>
          </div>
          <BookingSummary service={service} member={member} date={date} time={time} />
        </div>
      </section>
    </>
  );
}
