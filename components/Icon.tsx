import { ICONS, BOX960, type IconName } from "@/lib/icons";

/* One icon component. HugeIcons Stroke Rounded on the 0 0 24 24 box; the
   four filled state marks (star, checkFilled, …) on Material's 960 box.
   Colour is currentColor: set `color` on the host. Size comes from the
   caller's CSS (the rail, page and row sizes are tokens). */
export function Icon({ name, className }: { name: IconName; className?: string }) {
  const filled = BOX960.has(name);
  const inner = filled ? `<path d="${ICONS[name]}" fill="currentColor"/>` : ICONS[name];
  return (
    <svg
      className={className}
      viewBox={filled ? "0 -960 960 960" : "0 0 24 24"}
      aria-hidden="true"
      dangerouslySetInnerHTML={{ __html: inner }}
    />
  );
}
