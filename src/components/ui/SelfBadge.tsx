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

const statusTone: Record<Required<SelfBadgeProps>["status"], string> = {
  unverified:
    "border border-wolf-border-soft bg-transparent text-wolf-text-subtle backdrop-blur-none",
  pending:
    "border border-wolf-emerald-border-strong bg-wolf-emerald-soft/45 text-wolf-emerald shadow-[0_0_22px_rgba(160,83,255,0.28)] backdrop-blur-sm",
  verified:
    "border border-transparent bg-[linear-gradient(135deg,rgba(160,83,255,0.82),rgba(91,45,255,0.7))] text-white shadow-[0_0_26px_rgba(160,83,255,0.45)]",
  error:
    "border border-wolf-error-border bg-wolf-error-soft text-[#ffb1b1] shadow-[0_0_20px_rgba(255,122,122,0.32)] backdrop-blur-sm",
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
      className={`inline-flex items-center gap-2 rounded-full px-3.5 py-1.5 text-[0.7rem] font-semibold uppercase tracking-[0.2em] transition ${statusTone[status]} ${className}`.trim()}
    >
      <Icon
        className={`h-4 w-4 ${status === "pending" ? "animate-spin" : ""}`}
        aria-hidden
      />
      {t(`statuses.${status}`)}
    </span>
  );
}

export default SelfBadge;
