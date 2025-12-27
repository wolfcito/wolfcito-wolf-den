/**
 * Lab Mode API
 * POST /api/labs/:slug/lab-mode - Activate Lab Mode
 * DELETE /api/labs/:slug/lab-mode - Deactivate Lab Mode
 */

import { NextResponse } from "next/server";
import { clearActiveLabSlug, setActiveLabSlug } from "@/lib/labMode.server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

interface RouteParams {
  params: Promise<{
    slug: string;
  }>;
}

/**
 * POST /api/labs/:slug/lab-mode
 * Activate Lab Mode by setting cookie
 */
export async function POST(_request: Request, { params }: RouteParams) {
  try {
    const { slug } = await params;

    // Verify lab exists and is active
    const { data: lab, error } = await supabaseAdmin
      .from("event_labs")
      .select("id, slug, status, surfaces_to_observe")
      .eq("slug", slug)
      .single();

    if (error || !lab) {
      return NextResponse.json({ error: "Lab not found" }, { status: 404 });
    }

    if (lab.status !== "active") {
      return NextResponse.json({ error: "Lab is not active" }, { status: 400 });
    }

    // Set Lab Mode cookie
    await setActiveLabSlug(slug);

    return NextResponse.json({
      success: true,
      lab_slug: slug,
      surfaces_to_observe: lab.surfaces_to_observe || [],
      message: "Lab Mode activated",
    });
  } catch (err) {
    console.error("[Lab Mode API] Error activating Lab Mode:", err);
    return NextResponse.json(
      { error: "Failed to activate Lab Mode" },
      { status: 500 },
    );
  }
}

/**
 * DELETE /api/labs/:slug/lab-mode
 * Deactivate Lab Mode by clearing cookie
 */
export async function DELETE(_request: Request, _context: RouteParams) {
  try {
    // Clear Lab Mode cookie
    await clearActiveLabSlug();

    return NextResponse.json({
      success: true,
      message: "Lab Mode deactivated",
    });
  } catch (err) {
    console.error("[Lab Mode API] Error deactivating Lab Mode:", err);
    return NextResponse.json(
      { error: "Failed to deactivate Lab Mode" },
      { status: 500 },
    );
  }
}
