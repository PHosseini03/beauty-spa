import { PageHeader } from "../components/PageHeader";
import { StaffCard } from "../components/StaffCard";
import { Reveal } from "../components/Reveal";
import { useApi } from "../hooks/useApi";
import { DEMO_STAFF, type Staff } from "../data/demo";

export default function Team() {
  const { data } = useApi<Staff[]>("/api/staff", DEMO_STAFF);
  return (
    <>
      <PageHeader eyebrow="Unser Team" title={<>Lernen Sie unsere <span className="accent">Expertinnen</span> kennen</>} lead="Ausgebildet, ausgezeichnet und von Herzen herzlich. Wählen Sie bei der Buchung Ihre Favoritin – oder lassen Sie sich von uns beraten." image="/images/hair.jpg" />
      <section className="pb-28">
        <div className="container-x grid gap-x-8 gap-y-16 sm:grid-cols-2 lg:grid-cols-3">
          {data.map((m, i) => <Reveal key={m.id} delay={(i % 3) * 0.08}><StaffCard member={m} /></Reveal>)}
        </div>
      </section>
    </>
  );
}
