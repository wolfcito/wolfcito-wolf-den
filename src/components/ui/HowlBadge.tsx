"use client";

import { MoonStar } from "lucide-react";
import { useTranslations } from "next-intl";

interface HowlBadgeProps {
  level?: "Cachorro" | "Lobo" | "Alfa";
  className?: string;
}

const levelTone: Record<Required<HowlBadgeProps>["level"], string> = {
  Cachorro:
    "text-wolf-text-subtle border border-wolf-border bg-transparent backdrop-blur-none",
  Lobo: "text-wolf-emerald border border-wolf-emerald-border-strong bg-wolf-emerald-soft/40 shadow-[0_0_18px_rgba(160,83,255,0.25)]",
  Alfa: "text-white border border-transparent bg-[linear-gradient(135deg,rgba(160,83,255,0.85),rgba(91,45,255,0.7))] shadow-[0_0_28px_rgba(160,83,255,0.45)]",
};

export function HowlBadge({
  level = "Cachorro",
  className = "",
}: HowlBadgeProps) {
  const t = useTranslations("HowlBadge");

  return (
    <span
      className={`inline-flex items-center gap-2 rounded-full px-3.5 py-1.5 text-[0.7rem] font-semibold uppercase tracking-[0.2em] transition ${levelTone[level]} ${className}`.trim()}
    >
      <MoonStar className="h-4 w-4" aria-hidden />
      {t(`levels.${level}`)}
    </span>
  );
}

export default HowlBadge;
