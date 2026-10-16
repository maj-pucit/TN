/* The Tal four-point sparkle (Phase 1 --ai-star): "Tal recommends", the
   learning pulse title, the key insight. Colour is currentColor. */
export function Sparkle({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" aria-hidden="true">
      <path d="M12 1.5 14.4 9.6 22.5 12 14.4 14.4 12 22.5 9.6 14.4 1.5 12 9.6 9.6 12 1.5Z" fill="currentColor" />
    </svg>
  );
}
