import { type NextRequest, NextResponse } from "next/server";

export const runtime = "edge";

/**
 * GET /api/scan/8004
 *
 * Trust/verification scanner for addresses or identifiers
 * Returns trust scores and verification status
 *
 * Query params:
 *   - id: address or identifier to scan (required)
 *
 * MVP status: not_implemented (placeholder for future integration)
 */
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const id = searchParams.get("id");

  if (!id) {
    return NextResponse.json(
      {
        status: "error",
        message: "Missing required parameter: id",
        data: null,
      },
      { status: 400 },
    );
  }

  // TODO: Integrate with trust/verification backend
  // For MVP, return not_implemented status with explanatory message

  return NextResponse.json(
    {
      status: "not_implemented",
      message:
        "8004 scan is in MVP stage. Backend trust score integration coming soon. This would verify reputation, credentials, and trustworthiness for the provided identifier.",
      data: {
        scannedId: id,
        timestamp: new Date().toISOString(),
        note: "Integration with onchain trust registry pending",
      },
    },
    { status: 200 },
  );
}
