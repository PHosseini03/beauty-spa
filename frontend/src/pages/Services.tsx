import { useSearchParams } from "react-router-dom";
import { PageHeader } from "../components/PageHeader";
import { ServiceMenu } from "../components/ServiceMenu";
import { PackageCards } from "../components/PackageCards";
import { SectionTitle } from "../components/SectionTitle";
import { CATEGORIES, type Category } from "../data/demo";

export default function Services() {
  const [params] = useSearchParams();
  const requested = params.get("category");
  const initial = (CATEGORIES.some((c) => c.id === requested) ? requested : "hair") as Category;
  return (
    <>
      <PageHeader eyebrow="Behandlungen" title={<>Behandlungen mit <span className="accent">Liebe</span> zum Detail</>} lead="Jeder Besuch beginnt mit einer Beratung und endet mit einer Tasse Kräutertee. Alle Preise inklusive Produkte und Pflegetipps für zu Hause." image="/images/interior.jpg" />
      <section className="pb-24">
        <div className="container-x"><ServiceMenu initial={initial} /></div>
      </section>
      <section id="packages" className="section bg-linen">
        <div className="container-x">
          <SectionTitle eyebrow="Pakete" title={<>Ausgewählte <span className="accent">Rituale</span></>} lead="Kombinieren Sie Ihre Lieblingsbehandlungen und sparen Sie." />
          <div className="mt-14"><PackageCards /></div>
        </div>
      </section>
    </>
  );
}
