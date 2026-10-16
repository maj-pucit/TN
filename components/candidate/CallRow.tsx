import type { ReactNode } from "react";
import { CallRow as Row, When } from "../ui/CallRow";
import { AGENT_PRIYA as A } from "@/data/candidate";

/* The candidate's interview row: Priya, on the shared call row. */
export { When };
export function CallRow({ action }: { action?: ReactNode }) {
  return <Row img={A.img} name={A.name} verified lines={[A.role, <><b>Expertise:</b> {A.expertise}</>]} action={action} />;
}
