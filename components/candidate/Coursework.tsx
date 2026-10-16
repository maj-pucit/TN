"use client";
import s from "./coursework.module.css";

/* /candidate/coursework/ — Phase 1 V.coursework (views.js lsvtFrame). In the product
   this module IS LightspeedVT's interface inside an iframe, so the page draws
   nothing of its own around it: no header, no sections. The frame fills the
   content column and navigates itself (chapter menu → chapter → completion).
   The mock is public/lsvt/index.html, copied from Phase 1's LS_SCREEN. */
export function CourseworkPage() {
  return <iframe className={s.frame} src="/lsvt/index.html" title="Coursework — LightspeedVT" />;
}
