import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { getStoredLabUserId, persistLabUserId } from "@/lib/userProfile";

type SelfVerifyPayload = {
  holdBonus?: number;
};

export async function POST(request: Request) {
  const labUserId = await getStoredLabUserId();
  if (!labUserId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  let bonus = 10;
  try {
    const body = (await request.json()) as SelfVerifyPayload;
    if (typeof body?.holdBonus === "number" && body.holdBonus > 0) {
      bonus = body.holdBonus;
    }
  } catch {
    // ignore malformed body, fall back to default bonus
  }

  try {
    const { data: current, error: fetchError } = await supabaseAdmin
      .from("lab_users")
      .select("hold_score")
      .eq("id", labUserId)
      .single();

    if (fetchError) {
      throw fetchError;
    }

    const newScore = Number(current?.hold_score ?? 0) + bonus;

    const { data, error } = await supabaseAdmin
      .from("lab_users")
      .update({
        self_verified: true,
        hold_score: newScore,
      })
      .eq("id", labUserId)
      .select("*")
      .single();

    if (error) {
      throw error;
    }

    await persistLabUserId(labUserId);

    return NextResponse.json({
      isSelfVerified: true,
      holdScore: Number(data.hold_score ?? newScore),
    });
  } catch (error) {
    console.error("Failed to mark user self verified", error);
    return NextResponse.json(
      { error: "Unable to verify user" },
      { status: 500 },
    );
  }
}
