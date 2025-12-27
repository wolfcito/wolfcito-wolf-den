/**
 * Lab Mode - Client-side helpers and shared utilities
 *
 * Lab Mode allows organizers to activate a lab and navigate internal routes
 * while DenLabs captures telemetry and enriches events/feedback with context.
 */

export const LAB_MODE_COOKIE = "denlabs_active_lab";

/**
 * Client-side: Get active lab slug from document.cookie
 * Returns null if no lab is active
 */
export function getActiveLabSlugClient(): string | null {
  if (typeof document === "undefined") return null;

  const cookies = document.cookie.split("; ");
  const labCookie = cookies.find((c) => c.startsWith(`${LAB_MODE_COOKIE}=`));

  if (!labCookie) return null;

  return labCookie.split("=")[1] || null;
}

/**
 * Client-side: Check if Lab Mode is active
 */
export function isLabModeActive(): boolean {
  return getActiveLabSlugClient() !== null;
}

/**
 * Check if a route is in the observed surfaces list
 * @param route - Current route pathname
 * @param surfaces - Array of surfaces to observe
 * @returns true if route matches any surface, false otherwise
 */
export function isObservedSurface(route: string, surfaces: string[]): boolean {
  if (!surfaces || surfaces.length === 0) {
    // Empty surfaces means observe everything
    return true;
  }

  // Check for exact match or prefix match
  return surfaces.some(
    (surface) => route === surface || route.startsWith(`${surface}/`),
  );
}

/**
 * Get surface label for a route
 * @param route - Current route pathname
 * @param surfaces - Array of surfaces to observe
 * @returns surface label (matched surface or "other")
 */
export function getSurfaceLabel(route: string, surfaces: string[]): string {
  if (!surfaces || surfaces.length === 0) {
    return route; // If observing everything, use the route as label
  }

  const matchedSurface = surfaces.find(
    (surface) => route === surface || route.startsWith(`${surface}/`),
  );

  return matchedSurface || "other";
}
