import { Link } from "react-router-dom";
import { Star } from "lucide-react";
import { CATEGORIES, type Category, type Staff } from "../data/demo";

const CATEGORY_LABEL = Object.fromEntries(CATEGORIES.map((c) => [c.id, c.label])) as Record<Category, string>;

export function StaffCard({ member }: { member: Staff }) {
  return (
    <article className="group text-center">
      <div className="arch relative mx-auto aspect-[4/5] w-full max-w-xs overflow-hidden bg-blush">
        <img src={member.image} alt={"Porträt von " + member.name} loading="lazy" className="size-full object-cover transition duration-700 group-hover:scale-105" />
        <span className="absolute top-4 right-4 inline-flex items-center gap-1 rounded-full bg-cream/90 px-2.5 py-1 text-xs font-medium">
          <Star className="size-3 fill-rose text-rose" aria-hidden />{member.rating.toFixed(1).replace(".", ",")}
        </span>
      </div>
      <h3 className="mt-5 text-2xl">{member.name}</h3>
      <p className="mt-1 text-xs tracking-[0.2em] text-moss uppercase">{member.role}</p>
      <p className="mx-auto mt-3 max-w-xs text-sm font-light text-taupe">{member.bio}</p>
      <div className="mt-3 flex flex-wrap justify-center gap-1.5">
        {member.specialties.map((s) => <span key={s} className="rounded-full bg-sage/20 px-3 py-1 text-xs text-moss">{CATEGORY_LABEL[s]}</span>)}
      </div>
      <Link to={"/book?staff=" + member.id} className="mt-5 inline-block text-sm text-rose underline decoration-petal underline-offset-4 hover:decoration-rose">
        Termin bei {member.name.split(" ")[0]}
      </Link>
    </article>
  );
}
