import type { ReactNode } from "react";
import { When } from "../ui/CallRow";
import { TalLabel } from "../ui/DarkCard";
import d from "../ui/darkcard.module.css";
import { Text } from "../primitives";
import { Icon } from "../Icon";
import type { Course } from "@/data/level";
import s from "./dashboard.module.css";

/* The course offer black card (Phase 1 enrolOffer). Used by the dashboard
   (slot = View Other Courses, cta = View Course), the course page (slot =
   Continue to payment) and the payment page (no actions).
   CUT (G8): "Cohort starts …", "Cohort Leader: …" and the Cohort seats cell. */
export function CourseOffer({ course, recommended, slot, cta, opens }: {
  course: Course; recommended?: boolean; slot?: ReactNode; cta?: ReactNode; opens?: string;
}) {
  /* Phase 1 .eo: a heading row (16, no rule under it) with its one action
     right, the course block (Tal recommends, a 28px name, the description),
     then the facts under a light rule; the CTA on its own line, right. */
  return (
    <section className={`${d.card} on-dark`}>
      <div className={s.eoHd}>
        <div className={s.eoHdB}>
          <Text role="sec" as="h2">Your Next Step: Course Enrollment</Text>
          {opens && <span className={s.eoWhen}><Icon name="calendar" /><Text role="label" as="span" className={s.eoWhenT}>{opens}</Text></span>}
        </div>
        {slot && <div className={s.eoHdA}>{slot}</div>}
      </div>
      <div className={s.course}>
        {recommended && <TalLabel />}
        <h3 className={s.eoName}>{course.name}</h3>
        <Text role="body" as="p" ink="secondary" className={s.eoDesc}>{course.desc}</Text>
      </div>
      <div className={`${s.eoFacts} ${cta ? s.eoHasCta : ""}`}>
        <EoFact icon="wallet" l="Course Fee" v={<span className={s.acc}>${course.fee}</span>} />
        <EoFact icon="book" l="Chapters" v="13 · One per week" />
        <EoFact icon="starOutline" star l="Rating" v={`${course.rating} · ${course.reviews} reviews`} />
        {cta && <div className={s.cta}>{cta}</div>}
      </div>
    </section>
  );
}

const EoFact = ({ icon, l, v, star }: { icon: "wallet" | "book" | "starOutline"; l: string; v: ReactNode; star?: boolean }) => (
  <div className={s.eoF}>
    <Icon name={star ? "star" : icon} className={star ? s.eoStar : undefined} />
    <span className={s.eoFB}><Text role="h4" as="span">{l}</Text><span className={s.eoV}>{v}</span></span>
  </div>
);
