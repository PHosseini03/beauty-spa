import { useState, type FormEvent } from "react";
import { motion } from "framer-motion";
import { Gift, Loader2 } from "lucide-react";
import { PageHeader } from "../components/PageHeader";
import { GiftCardPreview } from "../components/GiftCardPreview";
import { SelectField, TextArea, TextField } from "../components/Field";
import { useToast } from "../components/toast-context";
import { useSubmit } from "../hooks/useSubmit";
import { rules, validate, type Errors } from "../lib/validation";
import { formatPrice } from "../lib/booking";

const PRESETS = [50, 100, 150, 250];
type Values = { amount: string; purchaser_name: string; purchaser_email: string; recipient_name: string; recipient_email: string; message: string; delivery: string };
const multipleOf5 = (v: string) => (Number(v) % 5 === 0 ? null : "Der Betrag muss durch 5 teilbar sein");
const SCHEMA = {
  amount: [rules.number("Der Betrag", 25, 1000), multipleOf5],
  purchaser_name: [rules.name],
  purchaser_email: [rules.email],
  recipient_name: [rules.name],
  recipient_email: [rules.email],
  message: [rules.safeText],
};
interface GiftResult {
  id: number;
  code: string;
  amount: number;
  message: string;
}

function GiftSuccess({ result, onAgain }: { result: GiftResult; onAgain: () => void }) {
  return (
    <motion.div initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }} className="py-8 text-center" role="status">
      <Gift className="mx-auto size-14 text-rose" aria-hidden />
      <h2 className="mt-5 text-4xl">Gutschein <span className="accent">reserviert</span></h2>
      <p className="lead mt-3">{result.message}</p>
      <p className="mt-4 inline-block rounded-full bg-blush px-5 py-2 font-mono text-sm">{result.code}</p>
      <div className="mt-8"><button type="button" className="btn-primary" onClick={onAgain}>Weiteren Gutschein verschenken</button></div>
    </motion.div>
  );
}

export default function GiftCards() {
  const [values, setValues] = useState<Values>({ amount: "100", purchaser_name: "", purchaser_email: "", recipient_name: "", recipient_email: "", message: "", delivery: "email" });
  const [errors, setErrors] = useState<Errors<Values>>({});
  const { status, result, submit, reset } = useSubmit<object, GiftResult>("/api/gift-cards");
  const toast = useToast();

  const set = (key: keyof Values) => (e: { target: { value: string } }) => {
    setValues((prev) => ({ ...prev, [key]: e.target.value }));
    if (errors[key]) setErrors((prev) => ({ ...prev, [key]: undefined }));
  };

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    const found = validate(values, SCHEMA);
    setErrors(found);
    if (Object.keys(found).length) return toast("error", "Bitte korrigieren Sie die markierten Felder.");
    const data = await submit({ ...values, amount: Number(values.amount) });
    if (data) toast("success", data.message);
    else toast("error", "Ihr Gutschein konnte nicht reserviert werden. Bitte versuchen Sie es erneut.");
  }

  return (
    <>
      <PageHeader eyebrow="Gutscheine" title={<>Verschenken Sie <span className="accent">Strahlen</span></>} lead="12 Monate gültig für alle Behandlungen und Pakete. Sofort per E-Mail oder edel gedruckt." image="/images/oil.jpg" />
      <section className="pb-24">
        <div className="container-x grid items-start gap-10 lg:grid-cols-[1fr_1.2fr]">
          <div className="space-y-4 lg:sticky lg:top-28">
            <GiftCardPreview amount={Number(values.amount)} to={values.recipient_name} from={values.purchaser_name} message={values.message} />
            <p className="text-center text-sm text-taupe">Live-Vorschau Ihres Gutscheins</p>
          </div>
          <div className="card p-6 sm:p-10">
            {status === "success" && result ? (
              <GiftSuccess result={result} onAgain={reset} />
            ) : (
              <form onSubmit={onSubmit} noValidate className="grid gap-5 sm:grid-cols-2">
                <fieldset className="sm:col-span-2">
                  <legend className="field-label mb-2">Betrag</legend>
                  <div className="flex flex-wrap gap-2">
                    {PRESETS.map((p) => (
                      <button key={p} type="button" onClick={() => set("amount")({ target: { value: String(p) } })} aria-pressed={values.amount === String(p)} className={"chip " + (values.amount === String(p) ? "chip-on" : "chip-off")}>{formatPrice(p)}</button>
                    ))}
                  </div>
                </fieldset>
                <div className="sm:col-span-2"><TextField label="Oder Wunschbetrag eingeben (25 bis 1.000 €)" name="amount" type="number" inputMode="numeric" min={25} max={1000} step={5} value={values.amount} onChange={set("amount")} error={errors.amount} /></div>
                <TextField label="Ihr Name" name="purchaser_name" autoComplete="name" value={values.purchaser_name} onChange={set("purchaser_name")} error={errors.purchaser_name} maxLength={80} />
                <TextField label="Ihre E-Mail" name="purchaser_email" type="email" autoComplete="email" value={values.purchaser_email} onChange={set("purchaser_email")} error={errors.purchaser_email} maxLength={120} />
                <TextField label="Name der beschenkten Person" name="recipient_name" value={values.recipient_name} onChange={set("recipient_name")} error={errors.recipient_name} maxLength={80} />
                <TextField label="E-Mail der beschenkten Person" name="recipient_email" type="email" value={values.recipient_email} onChange={set("recipient_email")} error={errors.recipient_email} maxLength={120} />
                <div className="sm:col-span-2"><TextArea label="Persönliche Nachricht (optional)" name="message" value={values.message} onChange={set("message")} error={errors.message} maxLength={300} /></div>
                <div className="sm:col-span-2">
                  <SelectField label="Zustellung" name="delivery" value={values.delivery} onChange={set("delivery")}>
                    <option value="email">Per E-Mail an die beschenkte Person</option>
                    <option value="print">Gedruckter Gutschein, Abholung im Studio</option>
                  </SelectField>
                </div>
                <button type="submit" className="btn-primary sm:col-span-2" disabled={status === "submitting"}>
                  {status === "submitting" ? <><Loader2 className="size-4 animate-spin" aria-hidden />Wird reserviert…</> : "Gutschein reservieren"}
                </button>
                <p className="text-center text-xs text-taupe sm:col-span-2">Demo-Formular: Es erfolgt keine Zahlung.</p>
              </form>
            )}
          </div>
        </div>
      </section>
    </>
  );
}
