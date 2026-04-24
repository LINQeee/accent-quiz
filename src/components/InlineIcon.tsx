type IconType = "correct" | "wrong" | "restart" | "trophy";

const symbols: Record<IconType, string> = {
  correct: "✓",
  wrong: "×",
  restart: "↻",
  trophy: "★",
};

export function InlineIcon({ type }: { type: IconType }) {
  return (
    <span aria-hidden="true" className="inline-flex h-6 w-6 items-center justify-center rounded-full border text-base font-bold leading-none">
      {symbols[type]}
    </span>
  );
}
