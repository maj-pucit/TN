"use client";
import { useEffect, useState } from "react";
import s from "./review.module.css";
import { Icon } from "../Icon";
import { Text } from "../primitives/Text";
import { Button } from "./Button";

/* <ReviewCapsule> — "How would you rate this course?" at the page foot.
   Opens in place; Submit thanks you, then the whole thing goes (~3.5s). */
export function ReviewCapsule({ title }: { title: string }) {
  const [state, setState] = useState<"cap" | "open" | "thanks" | "gone">("cap");
  const [score, setScore] = useState(0);
  useEffect(() => {
    if (state !== "thanks") return;
    const t = setTimeout(() => setState("gone"), 3500);
    return () => clearTimeout(t);
  }, [state]);
  if (state === "gone") return null;
  return (
    <div className={s.float}>
      {state === "cap" && (
        <button className={`${s.cap} t-compact w-strong`} onClick={() => setState("open")}><Icon name="chat" />{title}</button>
      )}
      {state === "open" && (
        <div className={s.card} role="dialog" aria-label={title}>
          <button className={s.x} aria-label="Close" onClick={() => setState("cap")}><Icon name="close" /></button>
          <Text role="h3">{title}</Text>
          <div className={s.stars}>
            {[1, 2, 3, 4, 5].map((n) => (
              <button key={n} className={`${s.star} ${n <= score ? s.on : ""}`} aria-label={`${n} star${n > 1 ? "s" : ""}`} onClick={() => setScore(n)}>
                <Icon name={n <= score ? "star" : "starOutline"} />
              </button>
            ))}
          </div>
          <textarea className={s.ta} aria-label="Your review" placeholder="Share a few words about your experience (optional)" />
          <div className={s.acts}>
            <Button kind="secondary" onClick={() => setState("cap")}>Maybe later</Button>
            <Button kind="primary" disabled={!score} onClick={() => setState("thanks")}>Submit review</Button>
          </div>
        </div>
      )}
      {state === "thanks" && <div className={s.card}><Text role="h3">Thanks for your review</Text></div>}
    </div>
  );
}
