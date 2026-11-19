import type { ReactNode } from "react";
import { Reveal } from "./Reveal";

interface Props {
  eyebrow: string;
  title: ReactNode;
  lead: string;
  image?: string;
}

export function PageHeader({ eyebrow, title, lead, image }: Props) {
  return (
    <section className="relative isolate overflow-hidden pt-32 pb-14 sm:pt-40 sm:pb-20">
      <div className="blob absolute -top-24 -right-20 -z-10 size-96 bg-blush/70 blur-2xl" aria-hidden />
      <div className="blob absolute top-40 -left-32 -z-10 size-72 bg-sage/25 blur-2xl" aria-hidden />
      <div className="container-x grid items-center gap-10 lg:grid-cols-[1.3fr_1fr]">
        <Reveal>
          <span className="eyebrow">{eyebrow}</span>
          <h1 className="heading mt-5">{title}</h1>
          <p className="lead mt-5 max-w-xl">{lead}</p>
        </Reveal>
        {image && (
          <Reveal delay={0.1} className="hidden justify-end lg:flex">
            <img src={image} alt="" className="arch h-80 w-64 object-cover shadow-2xl shadow-cocoa/20" />
          </Reveal>
        )}
      </div>
    </section>
  );
}
