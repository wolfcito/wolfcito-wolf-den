"use client";

import { MoonStar } from "lucide-react";
import { useTranslations } from "next-intl";

type HowlBadgeProps = {
  score?: number | null;
  className?: string;
};

const baseClasses =
  "inline-flex items-center gap-3 rounded-lg border px-3 py-1 text-[0.75rem] font-semibold uppercase transition";

export default function HowlBadge({
  score = null,
  className = "",
}: HowlBadgeProps) {
  const t = useTranslations("HowlBadge");
  const displayValue =
    typeof score === "number" && Number.isFinite(score) ? score : "—";

  return (
    <span
      className={`${baseClasses} border-[#4ca22a] bg-[#1a1f24] text-[#baff5c] [&>svg]:text-[#89e24a] ${className}`.trim()}
    >
      <MoonStar className="h-4 w-4" aria-hidden />
      <span className="hidden sm:inline-block sm:truncate">
        {t("score", { value: displayValue })}
      </span>
    </span>
  );
}
