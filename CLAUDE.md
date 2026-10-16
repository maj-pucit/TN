@DESIGN.md

# TalentNext — Phase 0

**Phase 0 is the minimum flow for the development deadline.** It covers three portals (Candidate,
Talent Agent, Super Admin), built in Next.js on one design system. It lives on the orphan branch
`phase-0` of `maryamnaz-lang/TN`, checked out as its own folder. **Never merge it into or push it
to `main`.** Phase 1 (the `main` branch, `outputs/` folder) is a separate project with its own
CLAUDE.md and DESIGN.md. Nothing here follows those files, and nothing done here changes them.

**Before any UI change, read `DESIGN.md`** (imported above). What each portal contains, and why, is
in `PHASE0-DECISIONS.md`. That is the handoff document for the dev team, so keep it current
whenever a module's scope changes.

## The golden rule: copy, don't redesign

Phase 0 is a **copy** of Phase 1's screens and flows. Anything Maryam has not cut is copied as it
is in Phase 1: the layout, the copy, the order and the interactions.

The cuts:
- the Cohort Leader portal
- cohorts of any kind (cohort pages, calls, members, messages, leader evaluation)
- the floating Tal bar and the Tal chat
- the "Summary by Tal" band
- points, ranks, achievements and certifications
- the candidate's cancel-interview and rebooking-credit flows
- the agent's `setup` and `reviewed` stages
- Super Admin's Tracks, Levels & Acronyms page
- the Rulings Register, CRM, Employers and Super Admin's other hidden modules

**When something is not on that list and you are unsure, keep it, and do not ask whether to
remove it.** Ask only when Phase 1 itself is ambiguous.

The reference is Phase 1 as it renders. Serve it and open the same screen side by side:

```bash
cd ../outputs && python3 -m http.server 8795 --bind 127.0.0.1
# candidate: http://127.0.0.1:8795/hifi/talentnext-candidate-portal-v24.html#day34/dashboard
# agent:     http://127.0.0.1:8795/tn-agent-portal.html
# admin:     http://127.0.0.1:8795/tn-admin-portal.html
```

Phase 1's markup and CSS sources, for porting a component:
- `../outputs/design-system/gallery.html`: every component, live, with its markup.
- `../outputs/design-system/where.py <class>`: names the `hifi/build/` layer that states a class.
- `../outputs/hifi/build/*.js`: candidate views and data.
- `../outputs/tn-agent-portal.html`, `../outputs/tn-admin-portal.html`: agent and admin views.

## Commands

```bash
npm install
npm run dev      # http://localhost:3100  (preview config "phase0")
npm run build    # design guard + stylelint + static export to out/
npm run guard    # the TSX guard alone
```

Vercel deploys the `phase-0` branch as a preview (static export, `out/`).

## File map

| Path | What it is |
|---|---|
| `styles/tokens.css` | **Every raw value.** The only file allowed a hex, an rgb() or a px spacing/type value |
| `styles/base.css` | Fonts, the reset, the type-role classes (`.t-h1` … `.t-caption`) |
| `components/primitives/` | `Page`, `PageHeader`, `Section`, `SectionHeader`, `Stack`, `Grid`, `Text`: all page rhythm |
| `components/shell/` | `AppShell`: app bar, rail, account menu + portal switcher, logout confirm, the prototype frame + demo menu |
| `components/ui/` | `Button`, `Confirm`, and the ported Phase 1 components |
| `components/Icon.tsx`, `lib/icons.ts` | HugeIcons (copied from Phase 1), the wordmark |
| `lib/portals.ts` | Each portal's rail, sub-pages, signed-in person, the candidate stages, every static route |
| `lib/demo.tsx` | Prototype state: journey stage (`?stage=`), frame (Mobile / Tablet / Desktop) |
| `data/` | The ONE shared mock seed: same people, bookings, payments across portals |
| `app/[portal]/[[...slug]]/` | Routes. A module that has been ported gets its own page file under `app/<portal>/<module>/` |
| `public/images`, `public/fonts` | Copied from Phase 1's `handoff/` export |

## The change protocol: one call changes everywhere

1. **A universal ask** ("section headings smaller", "descriptions darker", "more space between
   sections") means one edit to a token, a type role or a primitive. Never a screen-by-screen fix.
   Find the token in `styles/tokens.css`, or the role in `styles/base.css`, or the primitive.
2. **A one-screen ask** changes that screen only when Maryam names the screen. Log it in
   DESIGN.md §8.
3. **A new rule** goes into `DESIGN.md` first, as one line, then into code.
4. **Never add a raw value to a page or a component.** If a value is missing, add a token. The
   build refuses the alternative (DESIGN.md §7). Do not weaken `.stylelintrc.json` or
   `scripts/guard.mjs` to get past a finding.
5. **Porting a Phase 1 component:**
   - Copy its markup structure from `gallery.html`, and its CSS from the layer `where.py` names.
   - Rewrite every value to a token.
   - Put it in `components/ui/`.
   - Use it from pages.
   - Check it side by side with Phase 1 at the same width.

## Verifying

- `npm run build` must pass (the guards are part of it).
- Open the screen in the Browser pane (preview config `phase0`) next to Phase 1.
- Candidate and agent at 390 / 744 / 1024 / 1280; Super Admin at 1024 / 1280. Use the demo menu's
  frame switch (bottom right).
- Check for: no sideways scroll, nothing past the frame, no two-line button labels, no console
  errors.

## Working rules carried from Maryam

- **Do not commit or push unless Maryam asks.** Make the change, verify it, stop.
- **Confirm every delete and log-out in the `Confirm` dialog.**
- **Design arrives in corrections.** Act on the newest message, and do not ask which version she
  meant.
- **"Reuse X" means port X as it is.** Do not copy extras out of a reference screenshot.
- **Artwork must be a file on disk.** A pasted image cannot be embedded.
- **Responsive is part of done** (DESIGN.md §9).
