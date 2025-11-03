"use client";

import { createAppKit } from "@reown/appkit/react";
import type { ReactNode } from "react";
import {
  appKitAdapter,
  appKitMetadata,
  appKitNetworks,
  appKitProjectId,
} from "@/lib/appkitConfig";

const shouldEnableAppKit = Boolean(appKitProjectId);

if (shouldEnableAppKit) {
  createAppKit({
    adapters: [appKitAdapter],
    projectId: appKitProjectId,
    networks: appKitNetworks,
    metadata: appKitMetadata,
    themeMode: "dark",
    features: {
      analytics: false,
    },
  });
} else {
  console.warn(
    "Reown AppKit project ID is not configured. Wallet connect modal will be disabled.",
  );
}

export function AppKitProvider({ children }: { children: ReactNode }) {
  return <>{children}</>;
}

export default AppKitProvider;
