"use client";

import { useAppKitAccount } from "@reown/appkit/react";
import { useEffect, useState } from "react";
import {
  getSelfVerification,
  subscribeToSelfVerification,
} from "@/lib/selfVerification";

export type DenUser = {
  walletAddress: `0x${string}` | null;
  selfVerified: boolean;
  selfDid?: string | null;
  roles: string[];
  isBuilder: boolean;
  isMember: boolean;
  isAdmin: boolean;
};

export function useDenUser(): DenUser {
  const { address } = useAppKitAccount();
  const [selfVerified, setSelfVerified] = useState(false);

  useEffect(() => {
    setSelfVerified(getSelfVerification());
    return subscribeToSelfVerification(setSelfVerified);
  }, []);

  const normalizedAddress =
    typeof address === "string" && address.startsWith("0x")
      ? (address as `0x${string}`)
      : null;

  const isBuilder = normalizedAddress !== null;
  const roles = isBuilder ? ["BUILDER"] : [];

  return {
    walletAddress: normalizedAddress,
    selfVerified,
    selfDid: null,
    roles,
    isBuilder,
    isMember: isBuilder && selfVerified,
    isAdmin: false,
  };
}
