import { type NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import {
  type CreateLabUserPayload,
  getStoredLabUserId,
  type LabUserProfile,
  persistLabUserId,
  readJsonBody,
  sanitizeHandle,
  sanitizeRole,
} from "@/lib/userProfile";

function responseWithUser(user: LabUserProfile | null, init?: ResponseInit) {
  return NextResponse.json({ user }, init);
}

export async function GET() {
  const id = await getStoredLabUserId();
  if (!id) {
    return responseWithUser(null);
  }

  const { data, error } = await supabaseAdmin
    .from("lab_users")
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    console.error("Failed to fetch lab user", error);
    return responseWithUser(null, { status: 500 });
  }

  return responseWithUser(data as LabUserProfile);
}

export async function POST(request: NextRequest) {
  const payload = await readJsonBody<CreateLabUserPayload>(request);
  if (!payload) {
    return responseWithUser(null, {
      status: 400,
      statusText: "Invalid payload",
    });
  }
  const handleInput = payload.handle ?? payload.name;
  const handle = sanitizeHandle(handleInput);
  if (!handle) {
    return responseWithUser(null, {
      status: 400,
      statusText: "Handle is required",
    });
  }
  const safeRole = sanitizeRole(payload.role);

  try {
    if (payload.id) {
      const { data, error } = await supabaseAdmin
        .from("lab_users")
        .update({ handle, role: safeRole })
        .eq("id", payload.id)
        .select("*")
        .single();

      if (error) {
        throw error;
      }

      await persistLabUserId(data.id);
      return responseWithUser(data as LabUserProfile);
    }

    const { data, error } = await supabaseAdmin
      .from("lab_users")
      .insert({ handle, role: safeRole })
      .select("*")
      .single();

    if (error) {
      throw error;
    }

    await persistLabUserId(data.id);
    return responseWithUser(data as LabUserProfile);
  } catch (error) {
    console.error("Failed to upsert lab user", error);
    return responseWithUser(null, { status: 500 });
  }
}
