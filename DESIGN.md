# TalentNext Phase 0 — DESIGN.md

**The rulebook for all three Phase 0 portals: Candidate, Talent Agent and Super Admin.** Read it
before any UI change. It is the only design spec for Phase 0. Phase 1's `DESIGN.md` does not apply
here: it was copied from, and then left behind.

**How a rule works in Phase 0:**
- A rule is stated **once** in one of three places: a token (`styles/tokens.css`), a type role
  (`styles/base.css`) or a primitive/component (`components/`).
- Pages only compose those. They cannot hold a size, a colour, a margin or a padding, and the build
  fails if they try (§7).
- So **a universal ask is one edit and lands on every screen of every portal.** A per-screen
  exception happens only when Maryam names the screen, and it is logged in §8.

**A new rule Maryam gives is written HERE first, as one line, in the same session, then implemented.**

---

## 1. The three portals

| Portal | Routes | Widths checked | Rail (in order) |
|---|---|---|---|
| Candidate | `/candidate/…` | 390 · 744 · 1024 · 1280 | Dashboard, My Level, Course Enrollment*, Course Progress*, Interviews, Payments · foot: Profile, Log out |
| Talent Agent | `/agent/…` | 390 · 744 · 1024 · 1280 | Home, Interviews, Availability, Earnings, Standing · foot: Profile, Log out |
| Super Admin | `/admin/…` | 1024 · 1280 (desktop only) | Dashboard, Users & Roles›, Course Catalogue, Interviews›, Levelling›, Onboarding Questions, Finance & Settlement›, Integrations · foot: Settings, Logout |

\* Course Enrollment shows from the `assessed` stage onwards; Course Progress shows once the candidate
is enrolled. Rails, routes and stage gating all live in `lib/portals.ts`.

**One shell for all three portals** (`components/shell/AppShell.tsx`):
- **App bar:** 68px. Nav toggle, page title, bell, account trigger (face + name/role + chevron).
  - **The nav toggle (Phase 1 nav-t):** with the rail shut (900px and up) the cell shows the 21px
    TN mark, which turns into the menu glyph on hover. With the drawer open, the cell is the
    drawer's width: the TALENTnext wordmark (26px tall, 24px in) and the close X (56px) at its end.
    Below 900px it is the menu glyph / X only.
- **Rail:** 72px collapsed or a 260px drawer (310px on Super Admin). Below 900px it becomes an
  overlay drawer.
  - Every row (Log out too) is the full rail width, so a collapsed icon sits centred.
  - Hover is a grey wash (`--overlay-hover`) across the row; the ink does not change.
  - The selected row's accent bar is 2px, the full row height.
  - The foot is Profile, then **Log out** (Phase 1's words), over a hairline.
- **The content sheet (Phase 1 §10.1 / §14.3b):** the page column is white on the `--surface-2`
  ground. From 760px it has a 1px `--rule` stroke down each side. From 900px it is set in from the
  rail and the right wall by `--content-gutter` (12% of the frame, 24 to 200px) and has no max
  width; while the drawer is open that margin is 0. Maryam, 15 Oct 2026.
- **Account menu:** My Profile (plus General Settings on Super Admin), "Switch to {portal}" for the
  other two portals, then Sign Out. **There is no Cohort Leader portal.**

## 2. Tokens

All in `styles/tokens.css`, which is the only file allowed to hold a raw value.

**Colour**

| Token | Value | Role |
|---|---|---|
| `--accent` | `#f9423a` | Brand red, for fills and marks. The selected rail row. |
| `--accent-text` | `#c2332d` | The accent as ink. Words are never `--accent`. |
| `--text-primary` | `#111111` | Body text, headings, figure-card titles. |
| `--text-secondary` | `#828282` | **Every** description, supporting line and eyebrow. |
| `--text-helper` | `#666563` | Floor tier only: timestamps, legal text, chart axes, captions. |
| `--rule` | `#efefef` | **The** hairline. Every stroke, border, divider and card edge. |
| `--border-subtle-02` | `#c7c6c3` | Control edges (input, select, checkbox), so a field stays findable. |
| `--surface-2` | `#fcfcfc` | The one grey ground: tinted panels and the page margin. |
| `--layer-01` | `#ffffff` | Cards and panels are always white. |
| `--surface-dark` | `#111111` | The black card. On it, inks are `--on-dark` / `--on-dark-2`. |
| `--star` | `#ffcb05` | Rating star, always. Never the accent. |

- The state colours are a set and do not follow the accent:
  - `--support-success-ink` (green)
  - `--support-attention` (amber)
  - `--support-error` (red)
  - `--in-progress` (orange)
- Charts use the `--dv-*` ramp and never the brand red.

**Page wash.**
- **HIDDEN on all three portals** (Maryam 16 Oct 2026): `--page-wash` is `none`. The gradient is kept as `--page-wash-on` in `styles/tokens.css`; swap it back to restore. **Exception:** the dashboard top band (`<HeadBand>`, candidate + agent dashboards only) keeps it through `--band-wash` (Maryam 16 Oct 2026). The lines below describe where it paints when on.
- `--page-wash` is Phase 1's "Summary by Tal" ground (Figma 871:6425).
- `<Page>` paints it across the top of **every page on all three portals** (`--page-wash-h`, 360px).
- It belongs to the page, not to any container. There is no summary band in Phase 0.

**Space.**
- `--s01..--s12` = 2 / 4 / 8 / 12 / 16 / 24 / 32 / 40 / 48 / 64 / 80 / 96.
- `--pad-x` is the page side gutter: **24** below 1200px, **32** at 1200px and up.
- The rhythm tokens below are read only by the primitives:

| Token | Value | Meaning |
|---|---|---|
| `--sec-gap` | 28 | **THE section gap**: between any two sections, and on each side of a divider |
| `--sec-pad-y` | 14 | half the gap: section top and bottom (14 + 14 = 28) |
| `--sec-block-gap` | 20 | two bare block rows (no heading) in a row |
| `--sec-h-gap` | 16 | section heading → its content |
| `--sec-desc-gap` | 8 | heading → its own description |
| `--ph-pad-top` / `--ph-pad-bottom` | 32 / 28 | page header; its bottom is the gap above its divider |
| `--page-pad-bottom` | 96 | air under the last section |
| `--content-max` | 1040 | the content column |

**Shape.**
- `--radius` is **0**.
- Round things are a stated set and read `--radius-pill`:
  - avatars and discs
  - status pills
  - page-number buttons
  - `--radius-card-tal` (16) for Tal's stat card
  - `--radius-cbx` (4) for the auth consent boxes

## 3. Type: eight sizes, eleven roles, two weights

The face is **Plus Jakarta Sans** at **400** (book) and **500** (strong). "No bold" means 500.
**600 (`--t-w-semibold`) appears only where Phase 1 renders it, measured 15 Oct 2026:** the auth
welcome heading, a past-interview row's name and outcome (`.ivrow`), a scene title, the ladder's
rung codes, and the chapter row's "Restart" / "Resume". Nothing else takes it.

| Role | Size / line height | Use |
|---|---|---|
| `display` | 34 / 40 | hero **numerals only** |
| `page` | 22 / 28, every width | **the page heading** (PageHeader title or greeting). Maryam, 15 Oct 2026: "make it a little smaller, like 22px" |
| `h1` | 24 / 30 (28 / 34 at 900px and up) | a full-frame scene's heading (auth, onboarding) |
| `h2` | 20 / 26 | a level name, a dialog title on a large card |
| `h3` | 17 / 23 | dialog title, card title |
| `h4` | 14 / 19 | figure-card title, row title |
| `sec` | **16 / 22** | **every section heading, every width, every ground** |
| `body` / `compact` | 13.5 / 22 · 13.5 / 19 | paragraphs · dense rows, buttons, table cells |
| `desc` | 13.5 / auto, `--text-secondary` | every description |
| `label` | 12.5 / 17 | field labels, chips |
| `eyebrow` / `caption` | 11.5 / 16 | small grey label · floor-tier text |

**Rules:**
- **Type is set only through `<Text role="…">`** (or a component that uses a role class). Never a
  `font-size`.
- **Nothing is set in capitals.** Copy is written in sentence case in the markup.
- **Buttons are Title Case**, applied by CSS (`text-transform: capitalize`), not by editing strings.
- **A figure-card title is black** (`h4`, `--text-primary`). Its sub-line is `desc`.
- **A description is one grey, `--text-secondary`, everywhere.** No component picks its own grey.
- On a dark card there are two inks, not three: `--on-dark` and `--on-dark-2` (`.on-dark` flips
  them by token).

## 4. The primitives: how every page is built

Every screen is `<Page>` → `<PageHeader>` → `<Section>`s. These own all spacing, alignment and type.

| Primitive | It owns |
|---|---|
| `<Page>` | the white column, the page wash, the 96px bottom air |
| `<PageHeader title desc actions back greeting>` | the page heading (h1), its description, actions **right-aligned and vertically centred on the title/desc pair**, the back arrow. `greeting="Maryam"` renders "Good morning / afternoon / evening, Maryam". |
| `<Section kind bare tint noline>` | 14/14 padding (28 between), `--pad-x` sides, and the divider rules (§5) |
| `<SectionHeader title desc actions>` | section heading (`sec`), description 8px under it, actions right, 12px to the content |
| `<Stack gap row>` | vertical or row spacing on the scale: gap 1–6 = 4/8/12/16/24/32 |
| `<Grid cols>` | 1 column on a phone, 2 from 600px, `cols` (2/3/4) from 900px |
| `<Text role strong ink>` | all type |

**Rules that follow from these:**
- **Every page has a heading** (`<PageHeader>`). There is no "Summary by Tal" band anywhere.
- **Dashboards open with the greeting**, the time-of-day line with the person's first name.
- **One left edge.**
  - Headings, descriptions, content and dividers all sit on `--pad-x`.
  - The back arrow hangs 12px into the gutter, the one optical exception.
  - The table and tab strip bleeds are inside their components.
- **Actions in a heading row are right-aligned and centred on the heading block.** In a detail
  page's header, options go in a kebab menu, never a strip of inline buttons.
- **Headings are short.** About three words for a section heading.

## 5. Section rhythm and dividers

Maryam, 16 Oct 2026. One token, `--sec-gap`, sets all of it.

- **Sections are 28 apart.** Heading → its content 16. Heading → its own description 8.
- **Two bare block rows** (`kind="block" bare`, no heading of their own) in a row sit **20** apart.
- **A module's first page carries a description** under its heading (Maryam 16 Oct 2026): one plain
  sentence saying what the page is for; dashboards keep their stage line. **A detail page (any
  `PageHeader` with `back`) shows its title alone**, no description; `PageHeader` enforces it.
- **No divider under a page heading that has a tab strip right below it**: the strip's hairline
  is the boundary, 28 between them (Maryam 16 Oct 2026).
- **The page heading closes with a divider** (`PageHeader`, the greeting too). Only the page
  heading. Section headings inside the page do not get one.
- **A dashboard with the journey stepper opens with a head band** (`<HeadBand>`): the greeting and
  the stepper are ONE section, with no divider between them. The band closes with its own
  full-width bottom stroke (like Phase 1's band under "Summary by Tal"), and the page wash moves
  off the page into the band. The greeting's own divider is off inside it. The dashboards that show
  the 90-day progress use the same band: greeting + "Your 90-Day Progress" (full width, no 784 cap),
  then, still inside the band, the three insights (Learning Time / Chapter Retakes / Session
  Attendance) as their own block section of three joint stat cells, one section gap below the bar.
- **A divider is an entity of its own.** It takes the full section gap on each side: 28 above the
  line, 28 below.
- **A divider is drawn only between two text sections.** There is never one above or below a block
  (figures, cards, a table, a black card, a facts grid, a tab strip), even when a new section
  starts. Use `kind="block"` for any section whose content is a block. There is none after the
  last section, and none after a `noline` section.
- **The agent's Earnings page closes every section with a divider** (Maryam 16 Oct 2026), so its
  figure, list and table sections are text sections there. Its Payments list is the admin `Table`.
- **An action row (a section holding only buttons) is a block**: `kind="block"`, so no divider
  is drawn above it (Maryam 16 Oct 2026).
- **Never two lines stacked.** A list's last row draws no bottom line of its own; the section's
  divider, or the air after it, closes the list.
- **Tab strips** sit one section gap above and below, on list pages and detail pages alike.

## 6. Components (ported from Phase 1, measured as it renders)

Every component is live at **`/candidate/gallery/`**. Look there before inventing a class. Each one
was copied from Phase 1's computed styles (15 Oct 2026), not from its CSS source, which is restated
across about 40 layers.

| Component | File | What it is |
|---|---|---|
| `Button` | `ui/Button.tsx` | 40px (sm 32), radius 0, 13.5/18/500 at .05 tracking, Title Case by CSS. Kinds: `primary` black, `accent`, `secondary` filled `--rule` grey, `ghost` (transparent, no edge), `link` (accent ink, no box; hugs its line on the agent portal), `danger`, `dangerText` (a quiet red word in a row, the session "Sign Out"), `onDark`. A disabled `accent` keeps the accent look. `asIs` turns off the CSS Title Case for a label Phase 1 prints as written ("Add a Card", "Book a Call with Priya", "Add to Calendar"). Heading actions are 40 tall on the admin and 36 on the candidate. |
| `Confirm` | `ui/Confirm.tsx` | The `.conf` dialog: a solid accent disc with a white glyph, title, description, then Cancel + confirm. **Every delete and log-out.** `stepup` adds the six-digit security code (Phase 1 story 1.6); confirm stays shut until it is entered. Used on: a role delete, a course price change, an early payout release, a discount edit, enabling / disabling the automatic discount, the Money settings. |
| `Sheet` | `ui/Sheet.tsx` | A centred form sheet (title + X, body, footer of actions). A reason sheet before a confirmation, a small form (rename, holiday). |
| `Toasts` + `lib/store.ts` | `ui/Toasts.tsx` | The prototype store: admin seed records are mutable; `commit(fn, msg)` changes them, re-renders every page reading them (`useStore()`). **No toasts anywhere** (Maryam 16 Oct 2026): `toast()` is a no-op behind `TOASTS_ON = false` and the shell draws no host. |
| `DateFilter` | `ui/DateFilter.tsx` | Our month-grid date picker as a bordered "From: Any" pill (× clears). A list's date range, and a date field in a form. Never a native date input. |
| `BulkBar` | `ui/Table.tsx` | While table rows are selected, the actions for them, floats bottom-centre of the content column, `--dock-gap` 20px above the frame floor (portalled into the shell's `#p0-dock` layer, so it stays put while the page scrolls). One row = its own actions; several = what applies to many. |
| `Stats` / `Stat` | `ui/Figures.tsx` | Figure grid with hairlines drawn as a 1px gap. **2 or 4 cells.** Each cell: mark, black h4 title, grey description, h3 value right. Four across from 900px (frame width); on a phone the value drops under the title. `cols={3}` for a band of 3 or 6. |
| `Facts` / `Fact` | `ui/Figures.tsx` | Facts band: mark, label over value. `cols` 4 (two rows of four) or 3. |
| `DarkCard` | `ui/DarkCard.tsx` | **The black card, whole recipe.** Inset by `--pad-x`, 32 inside, accent haze, head row over a light rule. `slot` holds ONE control or ONE time. `tal` adds "Tal recommends". |
| `QuickActions` | `ui/QuickActions.tsx` | Dashboard action cards, 2 up (3 up from 900px), capped at 784px. The descriptor is static, never queue data. |
| `Table` | `ui/Table.tsx` | Header 13.5 strong over the one rule. No row lines. First row 24px off the header. Cells grey, first column black strong. One page at a time (5/10/25/50) with round page buttons; the active page is an accent disc. |
| Candidate list tables (`.agt`) | `candidate/interviews.module.css` | All Agents and Course Enrollment, laid out like the admin `Table` (Maryam 16 Oct 2026): rows are a subgrid of one shared grid, so a column is as wide as its widest cell and spare width is shared out; header 13.5 Medium black over one rule, no row lines, first row 24 off the header, 24 between columns. Chips show two plus a count. A course's length and cadence share one cell. It is a table once the page column is 820px+ (desktop at 1280); narrower, each row is a stacked card. |
| `Ledger` (restyled) | `ui/Ledger.tsx` | Since 16 Oct 2026 drawn as the admin `Table`: 13.5 Medium black header over one rule, no row lines, first row 24 off the header, grey 13.5 cells, columns sized to their widest cell; cells wrap on a phone instead of scrolling. |
| Profile scenes carousel | `candidate/Profile.tsx` | Phase 1 `.scv-row`: 240px cards with a 3:4 still, play disc, time and a share disc (LinkedIn / Instagram / X); 32px bordered prev/next arrows on the heading scroll the row. CV section headings carry icon-only 32px Add + Edit buttons (`Button` with `label`, no children). |
| `RowMenu` | `ui/Table.tsx` | One kebab per row. The list is portalled above the page because the table wrapper clips it. |
| `PersonCell` / `Status` | `ui/Table.tsx` | A round 28px face + name (+ sub-line). Status is coloured text, never a chip. |
| `Tabs` | `ui/Tabs.tsx` | The `.cs` strip: a `--surface-2` band bleeding to the page edges. The selected tab is white with a 2px accent underline. Counts are captions. Put it in `<Section kind="tabs">`. |
| `Dropdown` | `ui/Dropdown.tsx` | **Never a native select.** `filter` is a 36px bordered "Label: Value"; `form` is a 40px underline. Opens downward and overlays. Options may carry a face (`img`) or right-aligned `meta`. |
| `Field`, `Input`, `TextArea`, `Form`, `FormRow` | `ui/Field.tsx` | Label 12.5 strong, 8px over an underlined 40px control. Focus is a 2px `--focus` line by inset shadow, so the height never changes. Fields sit 32 apart. A field holding several controls (a chip picker, an option list) takes `group`: a plain group, not a `<label>`, which would forward a click on its words to the first chip. |
| `Search`, `Toolbar` | `ui/Field.tsx` | List toolbar: search on the left (with a clear X), filters on the right. Stands `--sec-h-gap` (16) off the table below it. |
| `Slider` | `ui/Slider.tsx` | The right slider (532px). **In flow at 900px and up: the page column narrows beside it.** Full-frame below 900px. Header 68 with an inset rule, body 24 inset, footer two equal buttons over a hairline. |
| `Dialog` | `ui/Dialog.tsx` | The `.conf` dialog with any action row and an optional fee row (label over amount). Success, upsell, payment. |
| `Overlay` | `ui/Overlay.tsx` | **Every modal renders through it.** It portals into the shell's `#p0-modal` layer, which covers the whole frame, app bar included. Escape and a backdrop click close it. |
| `Disclosure`, `HowItWorks` | `ui/Disclosure.tsx` | The `.found` chevron heading that opens in place; the facts + numbered steps body. |
| `CardPicker`, `PayModal` | `ui/CardPicker.tsx` | Pay from a saved card (radio rows, Default pill). Stripe's "Add Payment Method" is **embedded as a picture** with Phase 1's exact hotspots. |
| `Ladder` | `ui/Ladder.tsx` | The 15-rung level ladder on a black card. Passed rungs accent, current rung deep accent, rungs ahead faint. |
| `FreeFee` | `ui/Fee.tsx` | A complimentary fee: the price struck, then "Free". |
| `Accordion` | `ui/Accordion.tsx` | Rows between hairlines that open in place, one at a time; an optional caption sub-line (the course outline's "Chapter N · X min"). |
| `Modal` | `ui/Modal.tsx` | A plain sheet (no disc): content, then a footer of actions. Through `Overlay`. |
| `PerfChart` | `ui/PerfChart.tsx` | Assessment score by chapter against a dashed average line. Lowest point red with a halo; an "Average score" callout beside the latest point that flips left near the edge; key insight + "View Scores" sheet. |
| `ReviewCapsule` | `ui/Review.tsx` | "How would you rate this course?" pill at the page foot. Opens in place to stars + note, thanks, then disappears. |
| Journey stepper | `candidate/Dashboard.tsx` | "Your journey so far" (Maryam 16 Oct 2026, the form of a reference stepper in our icons and type). Each step is Phase 1's bare 24px state mark (`--jrn-mark`: done `checkFilled` green, current `hourglass` orange, ahead `time` grey), a hairline running on to the next step, then the step's name (`h4`, black) over its state word (`label`, book): **Completed** green, **In Progress** orange, **Upcoming** grey. A line takes the state of the step it leads INTO (orange into the current step, grey into one ahead) and stops 24px short of the next mark. On a wide column (desktop) the row takes 78% of it (`--jrn-max`), so the last step stops well short of the right edge; narrower, it uses the whole column to keep labels on one line. The "Step N of 4" chip sits 8 after the heading: an 8% accent ground, accent ink, no stroke. Four columns from a 600px page column; narrower, it stacks with the mark on the left and the line dropping to the next step. The block takes 8 extra above and below on top of the section gap (36 each side). |
| `ProgressWing` | `ui/ProgressWing.tsx` | The head figure (Phase 1 `.prog`): a big number, a second figure right in link blue, a segmented bar (done / now at 40% / empty), small figures below. The candidate's 90-day progress and the agent's earnings. |
| `CallRow`, `When` | `ui/CallRow.tsx` | The black card's call row: a 78px face, name (+ verified seal), grey lines, the actions at the right end, each 40 tall with a 16px mark (Phase 1 `.crow-a`). `When` is the head row's clock + time in the h4 role. Candidate and agent. |
| `TalOrb`, `TnLoader` | `ui/TalOrb.tsx` | Phase 1's orb markup (`borbMark`), drawn by `styles/orb.css`. `live` animates it (the onboarding hero and survey); without it, it is the flat chrome blob (the admin "Approve Tal proposal" button). `TnLoader` is the three-blade loader. |
| `Chips` / `Chip` | `ui/Chip.tsx` | Phase 1 `.skl`: grey pills, 13.5 book, 12 apart. Skills, permissions, course topics. |
| `Ledger` | `ui/Ledger.tsx` | Phase 1 `.paytbl`: the payments ledger (eyebrow header, hairline rows). Candidate Payments and agent Earnings. |
| `StatusChip` | `ui/Table.tsx` | A 24px round pill with a rule edge, for an integration's or session's state. |
| `KV` | `ui/KV.tsx` | Phase 1 `.kv`: a 184px label column (from 600px; stacked below), the value strong, one hairline per row. `ends` right-aligns values. |
| `PersonRow`, `PersonList` | `ui/PersonRow.tsx` | A list row about a person (Phase 1 `.bk-row` / `.gcard`): optional day/time block against a hairline, a 36px face, name over grey lines, a trailing arrow or an action. At `--pad-x`, no hairlines. `roomy` = 24px rows. |
| `DarkHeadCard` | `ui/DarkCard.tsx` | The black card as one heading row: sparkle + title, the sentence, one action right ("Your Learning Pulse"). |
| Agent calendar | `agent/Availability.tsx` | Daily / Weekly / Monthly. Week + day are a time grid (12–8 PM, 88px an hour, blocks filled by type, the now-line); month is a grid of one-line rows (+N more opens the day). A block opens its card (264px). |
| Admin charts | `admin/Charts.tsx` | The dashboard's Platform Users bars, Interviews line, payout rings and sparklines. Chart text is SVG user units (`--svg-*` tokens), scaling with the chart. |
| `Icon` | `Icon.tsx` | HugeIcons Stroke Rounded (100 glyphs, `lib/icons.ts`); four filled state marks on the 960 box. Sizes: 20 rail · 18 page · 22 row lead. |

**Two containers, two jobs.** The desktop tier — every `min-width: 900px` / `max-width: 899.98px`
rule — queries the FRAME (`@container app`), exactly like Phase 1's one real breakpoint: four
figures across, the three-up quick actions, the course offer's figure row. The smaller component
reflows (600 / 700) query the PAGE column (`@container page`), so a page narrowed by the slider
re-flows its forms and lists. **Why (15 Oct 2026):** once the content gutter (12cqw) landed, the
page column at 1280 is about 835px, so a 900 rule on `page` never fired at desktop and every
four-across grid fell to two. Keep the 900 tier on `app`.

Still to port: the notification panel behind the bell.

**How the components were checked (15 Oct 2026):** every screen in all three portals was
captured from the browser (each text element's computed size, line height, weight, tracking,
colour and case; each button's height, padding, fill, edge and icon size) at a 1024 frame and
diffed against Phase 1 at the same stage. What remains is Phase 1 markup that is in the DOM but
not on screen (the collapsed rail's flyout, closed menus), the page headings Phase 0 adds (G5),
and a 4px icon-side padding Phase 1 gives some black-card buttons.

**Component rules carried from Phase 1 (they still hold):**
- **In-page blocks have NO fill** (Maryam 16 Oct 2026, superseding Phase 1's white-fill rule): figure
  and fact cells, filters (dropdown, date), insight blocks, card rows, chips and the calendar are
  transparent so the page gradient shows through. Figure grids draw their hairlines as real
  borders (grid top/left, each cell right/bottom). Floating surfaces keep white: menus, pop-overs,
  modals, sheets, toasts, the selected tab. Grey stays for tracks, hover and the secondary button.
- **A field's line is `--rule` at rest.** On focus it is 2px `--focus`, colour only, with no height
  change.
- **No native `<select>` or date input anywhere.** Use our dropdown and our month-grid picker.
- **Status is plain coloured text, never a chip.** Labels (roles, levels, tracks) are round chips.
- **A cross-reference is the platform link blue `--link`,** underlined where it sits in running
  text or a table: a count that opens a filtered list, a reference that opens its record, a
  "Ready" transcript. An action (Add, Release, Send) stays the accent.
- **A row's actions are one kebab** opening a labelled menu.
- **A table shows one page at a time** (5 rows by default).
- **A disabled Join keeps the accent look** and cannot be pressed. It goes live inside the final
  minute.
- **A dialog sizes to its content.** Header, body and footer all have a 24px inset, and the footer
  has no top divider.
- **A modal overlay covers the whole frame,** app bar included.
- **Every photograph of a person is a disc.** Artwork (covers, badges) stays square.
- **No toasts, and exports make no browser download** (Maryam 16 Oct 2026). An action's outcome shows on the page itself.
- **Modal footer buttons fill the width, split equally** (`.sheetF` and `.confA`, Maryam 16 Oct 2026): Cancel and the primary each take half.
- **Dates are `MM-DD-YYYY`.** The course is "90 days".
- **No scrollbars** (the platform is scrollbar-less), except deliberate carousels.

## 7. The guard: why drift cannot ship

`npm run build` runs three checks before Next.js builds. Any finding stops the build.

1. **`scripts/guard.mjs`** checks `.tsx` files.
   - A page in `app/` may not carry `style={…}`, a hex colour or `rgb()`.
   - A component may only pass CSS custom properties inline.
2. **Stylelint, all CSS.** Outside `tokens.css` it refuses:
   - a hex, named colour or `rgb()`
   - a px/rem value in margin, padding, gap or font-size
   - a numeric font-weight
   - a raw radius
3. **Stylelint, `app/**/*.css` (page files).** These may not set margin, padding, gap, font,
   colour, background or border at all. That is the primitives' job.

## 8. Per-screen exceptions (Maryam-approved only)

Format: `screen · what differs · why · date`.

- `styles/orb.css` · the one CSS file outside the guard: a byte copy of Phase 1's orb and
  loader layers (132-orb, 135-tblob, the tn-loader rules), because the orb is artwork with its own
  gradients and motion · 15 Oct 2026.
- Agent calendar weekday heads · uppercase with .8 tracking (`--cal-dw-ls`) · Phase 1 draws the
  time-grid day abbreviation that way; it is the one place capitals survive besides card wordmarks
  · 15 Oct 2026.
- Onboarding "Let's Get Started" link · `--accent-text`, where Phase 1 hard-codes the retired
  accent `#bd2a2a` · following the token, not the stale hex · 15 Oct 2026.
- `/nil/*` (Next in Leadership run-up) · its own brand: navy + lime, a condensed display face,
  its own sizes and weights (700/800), all from the `--nil-*` token block and read only by
  `components/nil/` · it is another company's microsite, carried over from Phase 1's 30-nil.css,
  which made the same exception · 15 Oct 2026. Phase 1 §63's two rules still reach it: nothing
  is set in capitals, and its buttons take the body size at 500 in Title Case.

## 9. Responsive: part of done

- Candidate and Talent Agent are verified at **390, 744, 1024 and 1280** in the same task as the
  change.
- Super Admin is designed and checked at desktop only (1024, 1280).
- 900px is the one real breakpoint (the rail becomes a drawer below it).
- **A screen is done only when all of the following hold:**
  - no sideways scroll
  - nothing past the frame edge
  - no two-line button label
  - no unstacked two-column block on a phone
  - no console errors
- Measure with the browser pane **open** (`window.innerWidth === 0` means nothing is measurable).

## 10. Copy and voice

- **Tal appears in three places only:**
  - "Tal recommends" on the candidate dashboard
  - "Tal's read" on the agent's evaluation
  - Tal's proposal on the admin Level Approval page
- **No em dashes in anything Tal says.**
- **Copy is copied from Phase 1 verbatim.** Remove only words about a cut feature (cohorts, cohort
  leaders, points, ranks, achievements, certifications, Tal chat, Tal summaries).
- **Supplied copy is kept exactly** as Maryam gives it.
- **Admin dashboard: "Needs your attention" is HIDDEN** (Maryam 16 Oct 2026), behind `ATTN_ON = false` in `components/admin/Dashboard.tsx`; the dashboard opens on Platform at a glance.
- **No "escrow" in any visible copy** (Maryam 16 Oct 2026, matching Phase 1): Funds held / Gross held / Payout state, Returned reads Refunded. Code identifiers keep `escrow`.
- **Settings → Departments follows story 11.1** (Maryam 16 Oct 2026): columns Department / Users assigned; Add, Rename and Delete, no Retired state and no Restore. **No staged Discard / Save** (Maryam overrode the story's staging): Add and Rename apply from their sheet, and Delete asks in a confirmation modal first. Delete is refused while any user is assigned ("Move them to another department first"). Rows carry checkboxes; the bulk bar offers Rename + Delete for one row, Delete All for several. A rename carries onto user records. Names are letters, numbers, spaces and `&`, 1–100 characters, unique. The original Super Admin has no department. With no departments the group reads "No departments have been added yet. Users cannot be invited until at least one exists." and the invite's Department dropdown is disabled with the same line. The prototype keeps its five seeded departments rather than shipping empty.
- **The word is "users", never "staff"** in any visible copy (Maryam 16 Oct 2026): "internal user", "Users assigned", "User details". Code identifiers may keep `staff`.
- **Coursework** (candidate, week 1 and day 34 only — it goes at day 90 as in Phase 1): the module is the LightspeedVT iframe filling the content column, no page header. The mock is `public/lsvt/index.html`, copied from Phase 1's `LS_SCREEN` (chapter menu → chapter → completion), a third-party picture outside the design system.
- **Course Enrollment is in the rail only at `assessed` and `promoted`** (Phase 1: closed once enrolled, story 18.1).
- **`<Table even>`**: every column the same width, all cells left-aligned, so the gaps between columns are equal. Used on the agent Earnings Payments table (Maryam 16 Oct 2026).
- **Super Admin My Profile**: the photo is `--avatar-id-fit` (44px), as tall as the name + email beside it, not the 72px identity disc (`.idhead.fit`); the 8-cell facts grid is its own block section, one section gap (28) under the identity head (Maryam 16 Oct 2026).
- **Portalled layers find their host before the first paint and draw nothing until they do** (`Overlay`, `BulkBar`, `Slider` use `useLayoutEffect`). A modal first drawn inline in the page and then moved into `#p0-modal` flickers and jumps to the centre (Maryam 16 Oct 2026).
