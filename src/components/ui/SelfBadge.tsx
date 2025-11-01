"use client";

import {
  Loader2,
  ShieldAlert,
  ShieldCheck,
  ShieldQuestion,
} from "lucide-react";
import { useTranslations } from "next-intl";

interface SelfBadgeProps {
  status?: "unverified" | "pending" | "verified" | "error";
  className?: string;
}

const baseClasses =
  "inline-flex min-h-[44px] items-center gap-3 rounded-[10px] border px-3 py-2 text-[0.75rem] font-semibold uppercase tracking-[0.18em] transition";

const statusTone: Record<Required<SelfBadgeProps>["status"], string> = {
  unverified:
    "border-[#2a2f36] bg-transparent text-wolf-text-subtle [&>svg]:text-[#8a94a1]",
  pending:
    "border-[#2a2f36] bg-[rgba(20,24,29,0.72)] text-[#c2c7d2] [&>svg]:text-[#89e24a]",
  verified:
    "border-[#4ca22a] bg-[#89e24a] text-[#09140a] shadow-[0_0_20px_rgba(186,255,92,0.35)] [&>svg]:text-[#04140c]",
  error:
    "border-wolf-error-border bg-wolf-error-soft text-[#ffb1b1] shadow-[0_0_20px_rgba(255,122,122,0.32)] backdrop-blur-sm [&>svg]:text-[#ff7a7a]",
};

const statusIcon: Record<
  Required<SelfBadgeProps>["status"],
  React.ComponentType<React.SVGProps<SVGSVGElement>>
> = {
  unverified: ShieldQuestion,
  pending: Loader2,
  verified: ShieldCheck,
  error: ShieldAlert,
};

export function SelfBadge({
  status = "unverified",
  className = "",
}: SelfBadgeProps) {
  const t = useTranslations("SelfBadge");
  const Icon = statusIcon[status];

  return (
    <span
      className={`${baseClasses} ${statusTone[status]} ${className}`.trim()}
    >
      <Icon
        className={`h-4 w-4 ${
          status === "pending" ? "animate-spin" : "animate-none"
        }`}
        aria-hidden
      />
      <span className="truncate">{t(`statuses.${status}`)}</span>
    </span>
  );
}

export default SelfBadge;
