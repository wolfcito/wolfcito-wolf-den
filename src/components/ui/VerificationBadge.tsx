import clsx from "clsx";
import { ShieldCheck } from "lucide-react";

interface VerificationBadgeProps {
  className?: string;
}

export function VerificationBadge({ className }: VerificationBadgeProps) {
  return (
    <div
      className={clsx(
        "inline-flex items-center gap-2 rounded-full border border-wolf-border-soft/60 bg-wolf-emerald-soft/40 px-3.5 py-1.5 text-[0.68rem] font-semibold uppercase tracking-[0.24em] text-wolf-emerald shadow-[0_0_18px_rgba(160,83,255,0.25)] backdrop-blur-sm",
        className,
      )}
    >
      <ShieldCheck size={14} strokeWidth={2} />
      <span className="whitespace-nowrap">Powered by Self.xyz</span>
    </div>
  );
}

export default VerificationBadge;
