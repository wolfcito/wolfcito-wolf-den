import { type NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import {
  getStoredLabUserId,
  type LabUserProfile,
  persistLabUserId,
  readJsonBody,
  sanitizeWallet,
  type WalletUpdatePayload,
} from "@/lib/userProfile";

function responseWithUser(user: LabUserProfile | null, init?: ResponseInit) {
  return NextResponse.json({ user }, init);
}

async function findUserByWallet(
  wallet: `0x${string}`,
): Promise<LabUserProfile | null> {
  const { data, error } = await supabaseAdmin
    .from("lab_users")
    .select("*")
    .eq("wallet_address", wallet)
    .maybeSingle();

  if (error && error.code !== "PGRST116") {
    throw error;
  }

  return (data as LabUserProfile) ?? null;
}

async function adoptUserByWallet(
  wallet: `0x${string}`,
): Promise<LabUserProfile | null> {
  const existing = await findUserByWallet(wallet);
  if (!existing) {
    return null;
  }
  await persistLabUserId(existing.id);
  return existing;
}

async function createUserFromWallet(
  wallet: `0x${string}`,
): Promise<LabUserProfile | null> {
  const { data, error } = await supabaseAdmin
    .from("lab_users")
    .insert({
      name: wallet,
      role: "player",
      wallet_address: wallet,
    })
    .select("*")
    .single();

  if (error) {
    if (error.code === "23505") {
      return adoptUserByWallet(wallet);
    }
    throw error;
  }

  await persistLabUserId(data.id);
  return data as LabUserProfile;
}

async function upsertWalletForUser(
  id: string,
  wallet: `0x${string}`,
): Promise<LabUserProfile | null> {
  const { data, error } = await supabaseAdmin
    .from("lab_users")
    .update({ wallet_address: wallet })
    .eq("id", id)
    .select("*")
    .single();

  if (error) {
    if (error.code === "23505") {
      return adoptUserByWallet(wallet);
    }
    if (error.code === "PGRST116") {
      return null;
    }
    throw error;
  }

  await persistLabUserId(data.id);
  return data as LabUserProfile;
}

export async function PATCH(request: NextRequest) {
  const payload = await readJsonBody<WalletUpdatePayload>(request);
  const sanitizedWallet = sanitizeWallet(payload?.walletAddress);
  if (!sanitizedWallet) {
    return responseWithUser(null, {
      status: 400,
      statusText: "Invalid wallet address",
    });
  }

  const storedId = await getStoredLabUserId();
  const targetId = payload?.id ?? storedId ?? undefined;

  try {
    if (targetId) {
      const updated = await upsertWalletForUser(targetId, sanitizedWallet);
      if (updated) {
        return responseWithUser(updated);
      }
    }

    const ensured = await adoptUserByWallet(sanitizedWallet);
    if (ensured) {
      return responseWithUser(ensured);
    }

    const created = await createUserFromWallet(sanitizedWallet);
    return responseWithUser(created);
  } catch (error) {
    console.error("Failed to update wallet", error);
    return responseWithUser(null, { status: 500 });
  }
}
