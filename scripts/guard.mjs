/* ============================================================
   TSX GUARD — the half of the lint guard stylelint cannot see.
   A page or module (app/**) may not carry inline style, a raw
   colour, or a raw className string that bypasses the primitives
   for spacing/type. Components may pass CSS custom properties
   (style={{'--x': …}}) and nothing else.
   Run by `npm run build`; exits 1 on any finding.
   ============================================================ */
import { readFileSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";

const walk = (d) => readdirSync(d).flatMap((f) => {
  const p = join(d, f);
  return statSync(p).isDirectory() ? walk(p) : [p];
});

const findings = [];
const check = (file, re, msg) => {
  readFileSync(file, "utf8").split("\n").forEach((line, i) => {
    if (re.test(line)) findings.push(`${file}:${i + 1}  ${msg}\n    ${line.trim()}`);
  });
};

for (const f of walk("app").filter((p) => /\.tsx?$/.test(p))) {
  check(f, /style=\{/, "inline style in a page. Use a primitive or a component prop.");
  check(f, /#[0-9a-fA-F]{3,8}\b(?![^"'`]*["'`]\s*:)/, "raw hex colour in a page. Read a token.");
  check(f, /\brgba?\(/, "raw rgb() in a page. Read a token.");
}
for (const f of walk("components").filter((p) => /\.tsx$/.test(p))) {
  check(f, /style=\{\{(?![^}]*--)/, "inline style that is not a CSS custom property.");
  check(f, /\brgba?\(|#[0-9a-fA-F]{6}\b/, "raw colour in a component. Read a token.");
}

if (findings.length) {
  console.error(`\nDesign guard: ${findings.length} finding(s)\n\n` + findings.join("\n") + "\n");
  process.exit(1);
}
console.log("design guard: clean");
