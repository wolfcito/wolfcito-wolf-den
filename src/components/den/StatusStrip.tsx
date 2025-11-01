"use client";

import { type ComponentProps, useEffect, useState } from "react";
import HowlBadge from "@/components/ui/HowlBadge";
import SelfBadge from "@/components/ui/SelfBadge";
import {
  getSelfVerification,
  subscribeToSelfVerification,
} from "@/lib/selfVerification";

type StatusStripProps = {
  level?: ComponentProps<typeof HowlBadge>["level"];
  className?: string;
};

export function StatusStrip({
  level = "Lobo",
  className = "",
}: StatusStripProps) {
  const [isSelfVerified, setIsSelfVerified] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }
    setIsSelfVerified(getSelfVerification());
    return subscribeToSelfVerification(setIsSelfVerified);
  }, []);

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <HowlBadge level={level} />
      <SelfBadge status={isSelfVerified ? "verified" : "pending"} />
    </div>
  );
}

export default StatusStrip;
