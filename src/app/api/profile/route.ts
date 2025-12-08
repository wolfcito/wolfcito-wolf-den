import { type NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import {
  getStoredLabUserId,
  persistLabUserId,
  readJsonBody,
  sanitizeHandle,
} from "@/lib/userProfile";

type ProfileUpdatePayload = {
  handle?: string;
};

export async function POST(request: NextRequest) {
  const labUserId = await getStoredLabUserId();
  if (!labUserId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const payload = await readJsonBody<ProfileUpdatePayload>(request);
  const handle = sanitizeHandle(payload?.handle);
  if (!handle) {
    return NextResponse.json({ error: "Invalid handle" }, { status: 400 });
  }

  try {
    const { data: conflict, error: conflictError } = await supabaseAdmin
      .from("lab_users")
      .select("id")
      .eq("handle", handle)
      .neq("id", labUserId)
      .maybeSingle();

    if (conflictError && conflictError.code !== "PGRST116") {
      throw conflictError;
    }

    if (conflict) {
      return NextResponse.json(
        { error: "Handle already exists" },
        { status: 409 },
      );
    }

    const { data, error } = await supabaseAdmin
      .from("lab_users")
      .update({
        handle,
        display_name: handle,
      })
      .eq("id", labUserId)
      .select("*")
      .single();

    if (error) {
      throw error;
    }

    await persistLabUserId(labUserId);

    return NextResponse.json({
      handle,
      hasProfile: true,
      user: data,
    });
  } catch (error) {
    console.error("Failed to claim handle", error);
    return NextResponse.json(
      { error: "Unable to claim handle" },
      { status: 500 },
    );
  }
}
