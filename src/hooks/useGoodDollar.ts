import { useCallback } from "react";
import { createPublicClient, createWalletClient, custom, http } from "viem";
import { celo } from "viem/chains";
import { useAppKitProvider } from "@reown/appkit/react";
import { EngagementRewardsSDK } from "@goodsdks/engagement-sdk";

const REWARDS_CONTRACT_ADDRESS = process.env
  .NEXT_PUBLIC_GD_REWARDS_CONTRACT! as `0x${string}`;
const APP_ADDRESS = process.env.NEXT_PUBLIC_GD_APP_ADDRESS! as `0x${string}`;

export const useGoodDollar = () => {
  const { walletProvider } = useAppKitProvider("eip155");

  const initSDK = useCallback(async () => {
    if (!walletProvider) {
      throw new Error("No wallet provider available");
    }

    // Create public client for reading
    const publicClient = createPublicClient({
      chain: celo,
      transport: http(),
    });

    // Create wallet client for signing
    const walletClient = createWalletClient({
      chain: celo,
      transport: custom(walletProvider),
    });

    const rewards = new EngagementRewardsSDK(
      publicClient,
      walletClient,
      REWARDS_CONTRACT_ADDRESS,
    );

    return rewards;
  }, [walletProvider]);

  return {
    initSDK,
    appAddress: APP_ADDRESS,
  };
};
