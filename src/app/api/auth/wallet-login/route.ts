import { type NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import {
  buildDisplayNameFromWallet,
  type LabUserProfile,
  persistLabUserId,
  readJsonBody,
  sanitizeWallet,
} from "@/lib/userProfile";

type WalletLoginPayload = {
  walletAddress?: string;
};

type WalletLoginResponse = {
  labUserId: string;
  walletAddress: string | null;
  handle: string | null;
  hasProfile: boolean;
  isSelfVerified: boolean;
  holdScore: number;
};

function normalizeWallet(address: `0x${string}`): `0x${string}` {
  return address.toLowerCase() as `0x${string}`;
}

function buildResponse(user: LabUserProfile): WalletLoginResponse {
  return {
    labUserId: user.id,
    walletAddress: user.wallet_address,
    handle: user.handle,
    hasProfile: Boolean(user.handle),
    isSelfVerified: Boolean(user.self_verified),
    holdScore: Number(user.hold_score ?? 0),
  };
}

export async function POST(request: NextRequest) {
  const payload = await readJsonBody<WalletLoginPayload>(request);
  const sanitizedWallet = sanitizeWallet(payload?.walletAddress);
  if (!sanitizedWallet) {
    return NextResponse.json(
      { error: "Invalid wallet address" },
      { status: 400 },
    );
  }
  const normalizedWallet = normalizeWallet(sanitizedWallet);

  try {
    const { data: existing, error: fetchError } = await supabaseAdmin
      .from("lab_users")
      .select("*")
      .eq("wallet_address", normalizedWallet)
      .maybeSingle();

    if (fetchError && fetchError.code !== "PGRST116") {
      throw fetchError;
    }

    if (existing) {
      let profile = existing as LabUserProfile;
      if (!profile.display_name) {
        const refreshed = await supabaseAdmin
          .from("lab_users")
          .update({
            display_name: buildDisplayNameFromWallet(normalizedWallet),
          })
          .eq("id", profile.id)
          .select("*")
          .single();
        if (!refreshed.error && refreshed.data) {
          profile = refreshed.data as LabUserProfile;
        }
      }
      await persistLabUserId(profile.id);
      return NextResponse.json(buildResponse(profile));
    }

    const displayName = buildDisplayNameFromWallet(normalizedWallet);
    const { data, error } = await supabaseAdmin
      .from("lab_users")
      .insert({
        role: "player",
        wallet_address: normalizedWallet,
        display_name: displayName,
      })
      .select("*")
      .single();

    if (error) {
      if (error.code === "23505") {
        const { data: conflict } = await supabaseAdmin
          .from("lab_users")
          .select("*")
          .eq("wallet_address", normalizedWallet)
          .single();
        if (conflict) {
          await persistLabUserId(conflict.id);
          return NextResponse.json(buildResponse(conflict as LabUserProfile));
        }
      }
      throw error;
    }

    const profile = data as LabUserProfile;
    await persistLabUserId(profile.id);
    return NextResponse.json(buildResponse(profile));
  } catch (error) {
    console.error("Failed to handle wallet login", error);
    return NextResponse.json(
      { error: "Unable to login with wallet" },
      { status: 500 },
    );
  }
}
