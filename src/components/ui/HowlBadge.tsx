"use client";

import { MoonStar } from "lucide-react";
import { useTranslations } from "next-intl";

interface HowlBadgeProps {
  level?: "Cachorro" | "Lobo" | "Alfa";
  className?: string;
}

const baseClasses =
  "inline-flex min-h-[44px] items-center gap-3 rounded-[10px] border px-3 py-2 text-[0.75rem] font-semibold uppercase tracking-[0.18em] transition";

const levelTone: Record<Required<HowlBadgeProps>["level"], string> = {
  Cachorro:
    "border-[#2a2f36] bg-transparent text-wolf-text-subtle [&>svg]:text-[#8a94a1]",
  Lobo: "border-[#4ca22a] bg-[#1a1f24] text-[#baff5c] shadow-[0_0_18px_rgba(186,255,92,0.18)] [&>svg]:text-[#89e24a]",
  Alfa: "border-[#ffd66b] bg-[#1f2210] text-[#ffd66b] shadow-[0_0_18px_rgba(255,200,77,0.25)] [&>svg]:text-[#ffc84d]",
};

export function HowlBadge({
  level = "Cachorro",
  className = "",
}: HowlBadgeProps) {
  const t = useTranslations("HowlBadge");

  return (
    <span className={`${baseClasses} ${levelTone[level]} ${className}`.trim()}>
      <MoonStar className="h-4 w-4" aria-hidden />
      <span className="truncate">{t(`levels.${level}`)}</span>
    </span>
  );
}

export default HowlBadge;
