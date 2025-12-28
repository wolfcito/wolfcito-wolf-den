/**
 * Activity Client - Fetch helper for Activity API
 * Pattern follows existing client helpers (no axios, basic fetch)
 */

import type { ActivityResponse } from "./activity";

/**
 * Fetch lab activity (summary + feed)
 */
export async function getLabActivity(
  slug: string,
  opts?: {
    window?: "24h" | "48h" | "72h";
    limit?: number;
  },
): Promise<ActivityResponse> {
  const params = new URLSearchParams();

  if (opts?.window) {
    params.set("window", opts.window);
  }

  if (opts?.limit !== undefined) {
    params.set("limit", String(opts.limit));
  }

  const url = `/api/labs/${slug}/activity${params.toString() ? `?${params.toString()}` : ""}`;

  const response = await fetch(url);

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(
      errorData.error || `Failed to fetch activity: ${response.statusText}`,
    );
  }

  return response.json();
}
